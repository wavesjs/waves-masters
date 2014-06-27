/**
 * @fileoverview WAVE audio library element: a web audio scheduler, without time loop.
 * @author Karim.Barkati@ircam.fr, Norbert.Schnell@ircam.fr, Victor.Saiz@ircam.fr
 * @version 3.8.2
 */

var createEventQueue = require("../event-queue");

/**
 * Function invocation pattern for object creation.
 * @public
 */

var createQueueScheduler = function createQueueScheduler(optName) {
  'use strict';

  // Ensure global availability of an "audioContext" instance of web audio AudioContext.
  window.audioContext = window.audioContext || new AudioContext() || new webkitAudioContext();

  /**
   * ECMAScript5 property descriptors object.
   */
  var queueSchedulerObject = {

    // Properties with default values
    isRunning: {
      writable: true,
      value: false
    },
    name: {
      writable: true,
      value: "QueueScheduler"
    },
    eventQueue: {
      writable: true,
      value: createEventQueue()
    },
    nextEventTime: {
      writable: true,
      value: Infinity
    },
    schedulablesList: {
      writable: true,
      value: []
    },
    parent: {
      writable: true,
      value: null
    },

    /**
     * Mandatory initialization method.
     * @public
     * @chainable
     */
    init: {
      enumerable: true,
      value: function(optName) {
        if (optName) {
          this.name = optName;
        }
        return this;
      }
    },

    /**
     * Schedule a schedulable object and add it to the scheduling list.
     * @public
     * @chainable
     */
    add: {
      enumerable: true,
      value: function(object) {
        if (object && object.isSchedulable) {
          object.setScheduler(this);
          var length = this.schedulablesList.push(object);
          var index = length - 1;
          var name = object.name ? object.name : object.schedulingID;
          console.log("Scheduling element #" + index + ' \"' + name + '\"');
          if (!this.isRunning) {
            // this.resetAll();
          }
          return this; // for chainability
        } else {
          throw new Error("add(): object must be schedulable");
        }
      }
    },

    /**
     * Unschedule a schedulable object and remove it from the scheduling list.
     * @public
     * @chainable
     */
    remove: {
      enumerable: true,
      value: function(object) {
        if (object) {
          // Search for the object in the scheduling list.
          var index = this.schedulablesList.indexOf(object);

          if (index < 0) {
            throw new Error("remove(): object not found," + object);
          } else {
            this.schedulablesList.splice(index, 1);
            console.log("Unscheduling element #" + index, object.name ? '\"' + object.name + '\"' : "", object.schedulingID);
            // Stop when scheduling list is empty.
            if (this.schedulablesList.length <= 0) {
              this.stop();
            }
          }
          return this; // for chainability
        } else {
          throw new Error("remove(): no object");
        }
      }
    },

    /**
     * Start scheduling.
     * @private
     */
    run: {
      enumerable: false,
      value: function() {
        if (!this.isRunning) {
          this.isRunning = true;
          console.log("Scheduling on", "(" + this.name + ")");
          this.parent.start();
        }
      }
    },

    /**
     * Stop scheduling.
     * @private
     */
    stop: {
      enumerable: false,
      value: function() {
        this.parent.stop();
        this.isRunning = false;
        console.log("Scheduling off (" + this.name + ")");
      }
    },

    /**
     * Reset all schedulables objects of this scheduler.
     * @private
     */
    resetAll: {
      enumerable: false,
      value: function() {
        this.eventQueue.flush();
        this.insertAll();
      }
    },

    /**
     * Push all events into the event queue and sort it afterward.
     * @private
     */
    insertAll: {
      enumerable: false,
      value: function() {
        var time = null;
        var element = null;
        console.log("schedulablesList: ", this.schedulablesList);
        for (var i = this.schedulablesList.length - 1; i >= 0; i--) {
          element = this.schedulablesList[i];
          time = element.resetAndReturnNextTime(audioContext.currentTime);
          this.eventQueue.pushEvent(element, time);
        }
        this.eventQueue.sort();
      }
    },

    /**
     * Insert an event into the event queue.
     * @public
     */
    insertEvent: {
      enumerable: true,
      value: function(object, time) {
        if (time !== Infinity) {
          this.eventQueue.Insert(object, time);
        }
      }
    },

    /**
     * Get current time from the Web Audio context.
     * @public
     */
    getCurrentTime: {
      enumerable: true,
      value: function() {
        return audioContext.currentTime;
      }
    },

    /**
     * Update next scheduling time of a scheduled object.
     * @public
     * @param {Object} object reference
     * @param {Float} new scheduling time of its next event
     */
    updateNextTime: {
      enumerable: false,
      value: function(object, time) {
        if (time === Infinity) {
          this.eventQueue.remove(object);
          // Stop when the queue is empty.
          if (this.eventQueue.length <= 0) {
            this.stop();
          }
        } else {
          if (this.eventQueue.indexOf(object) < 0) {
            this.eventQueue.insert(object, time);
          } else {
            this.eventQueue.move(object, time);
          }
          this.run();
        }
      }
    },

    /////////////////////////////
    /// Transporting methods ///
    /////////////////////////////

    /**
     * Call the event making method of the first schedulable object,
     * and then update the first event of the queue.
     * @public
     */
    makeNextEvent: {
      enumerable: true,
      value: function() {
        var engine = this.eventQueue.getFirstObject();
        this.nextEventTime = engine.makeEventAndComputeNextTime();
        this.eventQueue.moveFirstEvent(engine, this.nextEventTime);
      }
    },

    /**
     * Get next event time by querying it in the event queue.
     * @public
     */
    getNextTime: {
      enumerable: true,
      writable: true, // allow superseding for specific schedulers
      value: function() {
        this.nextEventTime = this.schedulablesList.length !== 0 ? this.eventQueue.getFirstValue() : Infinity;
        return this.nextEventTime;
      }
    },

    /**
     * Set next event time.
     * @private
     */
    setNextTime: {
      enumerable: false,
      value: function(time) {
        this.nextEventTime = time;
      }
    },


  }; // End of object definition.


  // Instantiate an object.
  var instance = Object.create({}, queueSchedulerObject);
  return instance.init(optName);
};


// CommonJS function export
module.exports = createQueueScheduler;