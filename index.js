/* written in ECMAscript 6 */
/**
 * @fileoverview WAVE scheduler singleton based on audio time
 * @author Norbert.Schnell@ircam.fr, Victor.Saiz@ircam.fr, Karim.Barkati@ircam.fr
 */
'use strict';

var audioContext = require("audio-context");
var TimeEngineQueue = require("time-engine-queue");

var Scheduler = (function(){var DP$0 = Object.defineProperty;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,Object.getOwnPropertyDescriptor(s,p));}}return t};var $proto$0={};

  function Scheduler() {
    this.__engineQueue = new TimeEngineQueue();

    this.__currentTime = null;
    this.__nextTime = Infinity;
    this.__timeout = null;

    /**
     * scheduler (setTimeout) period
     * @type {Number}
     */
    this.period = 0.025;

    /**
     * scheduler lookahead time (> period)
     * @type {Number}
     */
    this.lookahead = 0.1;
  }Object.defineProperties(Scheduler.prototype, {time: {"get": time$get$0, "configurable": true, "enumerable": true}});DP$0(Scheduler, "prototype", {"configurable": false, "enumerable": false, "writable": false});

  // global setTimeout scheduling loop
  $proto$0.__tick = function() {var this$0 = this;
    while (this.__nextTime <= audioContext.currentTime + this.lookahead) {
      this.__currentTime = this.__nextTime;
      this.__nextTime = this.__engineQueue.execute(this.__nextTime, this.__nextTime);
    }

    this.__currentTime = null;

    if (this.__nextTime !== Infinity) {
      this.__timeout = setTimeout(function()  {
        this$0.__tick();
      }, this.period * 1000);
    }
  };

  $proto$0.__reschedule = function(time) {
    if (this.__nextTime !== Infinity) {
      if (!this.__timeout)
        this.__tick();
    } else if (this.__timeout) {
      clearTimeout(this.__timeout);
      this.__timeout = null;
    }
  };

  /**
   * Get scheduler time
   * @return {Number} current scheduler time including lookahead
   */
  function time$get$0() {
    return this.__currentTime || audioContext.currentTime + this.lookahead;
  }

  /**
   * Add a callback to the scheduler
   * @param {Function} callback function(time, audioTime) to be called
   * @param {Number} period callback period
   * @param {Number} delay of first callback
   * @return {Object} scheduled object that can be used to call remove and reschedule
   */
  $proto$0.callback = function(callback) {var delay = arguments[1];if(delay === void 0)delay = 0;
    var object = {
      executeNext: function(time, audioTime) {
        callback(time, audioTime);
        return Infinity;
      }
    };

    this.__nextTime = this.__engineQueue.insert(object, this.time + delay, false);
    this.__reschedule();

    return object;
  };

  /**
   * Add a periodically repeated callback to the scheduler
   * @param {Function} callback function(time, audioTime) to be called periodically
   * @param {Number} period callback period
   * @param {Number} delay of first callback
   * @return {Object} scheduled object that can be used to call remove and reschedule
   */
  $proto$0.repeat = function(callback) {var period = arguments[1];if(period === void 0)period = 1;var delay = arguments[2];if(delay === void 0)delay = 0;
    var object = {
      period: period,
      executeNext: function(time, audioTime) {
        callback(time, audioTime);
        return this.period;
      }
    };

    this.__nextTime = this.__engineQueue.insert(object, this.time + delay, false);
    this.__reschedule();

    return object;
  };

  /**
   * Add a time engine to the scheduler
   * @param {Object} engine time engine to be added to the scheduler
   * @param {Number} delay scheduling delay time
   */
  $proto$0.add = function(engine) {var delay = arguments[1];if(delay === void 0)delay = 0;
    if (engine.scheduler !== null)
      throw new Error("object has already been added to a scheduler");

    if (!engine.syncNext)
      throw new Error("object does not have a syncNext method");

    if (!engine.executeNext)
      throw new Error("object does not have a executeNext method");

    engine.scheduler = this;
    this.__nextTime = this.__engineQueue.insert(engine, this.time + delay);
    this.__reschedule();
  };

  /**
   * Remove time engine from the scheduler
   * @param {Object} engine time engine or callback to be removed from the scheduler
   */
  $proto$0.remove = function(engine) {
    if (engine.scheduler !== this)
      throw new Error("object has not been added to this scheduler");

    engine.scheduler = null;
    this.__nextTime = this.__engineQueue.remove(engine);
    this.__reschedule();
  };

  /**
   * Resychronize a scheduled time engine
   * @param {Object} engine time engine to be resynchronized
   */
  $proto$0.resync = function(engine) {
    if (engine.scheduler !== this)
      throw new Error("object has not been added to this scheduler");

    if (!engine.syncNext)
      throw new Error("object does not have a syncNext method");

    this.__nextTime = this.__engineQueue.move(engine, this.time);
    this.__reschedule();
  };

  /**
   * Reschedule a scheduled time engine or callback
   * @param {Object} engine time engine or callback to be rescheduled
   * @param {Number} time time when to reschedule
   */
  $proto$0.reschedule = function(engine, time) {
    if (engine.scheduler !== this)
      throw new Error("object has not been added to this scheduler");

    this.__nextTime = this.__engineQueue.move(engine, time, false);
    this.__reschedule();
  };
MIXIN$0(Scheduler.prototype,$proto$0);$proto$0=void 0;return Scheduler;})();

module.exports = new Scheduler; // export scheduler singleton