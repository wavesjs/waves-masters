/* written in ECMAscript 6 */
/**
 * @fileoverview WAVE audio transport class, provides synchronized time-based and position-based scheduling of events
 * @author Norbert.Schnell@ircam.fr, Victor.Saiz@ircam.fr, Karim.Barkati@ircam.fr
 * @version 5.1.0
 */
'use strict';

var EventQueue = require("../event-queue");
var EventEngine = require("../event-engine");

function arrayRemove(array, value) {
  var index = array.indexOf(value);

  if (index === 0) {
    array.splice(index, 1);
    return true;
  }

  return false;
}

var Transport = (function(super$0){var DP$0 = Object.defineProperty;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,Object.getOwnPropertyDescriptor(s,p));}}return t};var S_ITER$0 = typeof Symbol!=='undefined'&&Symbol.iterator||'@@iterator';function GET_ITER$0(v){if(v){if(Array.isArray(v))return 0;var f;if(typeof v==='object'&&typeof (f=v[S_ITER$0])==='function')return f.call(v);if((v+'')==='[object Generator]')return v;}throw new Error(v+' is not iterable')};MIXIN$0(Transport, super$0);

  function Transport() {
    super$0.call(this);

    this.__timeEvents = new EventQueue();
    this.__timeEngines = [];
    this.__nextEventTime = Infinity;

    this.__positionEvents = new EventQueue();
    this.__positionEngines = [];
    this.__nextEventPosition = Infinity;

    this.__nextTime = Infinity;

    this.__time = Infinity;
    this.__position = 0.0;
    this.__speed = 0.0;

    this.__speedListeners = [];
    this.__seekListeners = [];

    this.__playingSpeed = 1.0;

    return this;
  }Transport.prototype = Object.create(super$0.prototype, {"constructor": {"value": Transport, "configurable": true, "writable": true}, time: {"get": time$get$0, "configurable": true, "enumerable": true}, position: {"get": position$get$0, "configurable": true, "enumerable": true}, speed: {"get": speed$get$0, "set": speed$set$0, "configurable": true, "enumerable": true}, reverse: {"get": reverse$get$0, "configurable": true, "enumerable": true}, playingSpeed: {"get": playingSpeed$get$0, "set": playingSpeed$set$0, "configurable": true, "enumerable": true} });DP$0(Transport, "prototype", {"configurable": false, "enumerable": false, "writable": false});

  Transport.prototype.__sync = function(time) {
    this.__position += (time - this.__time) * this.__speed;
    this.__time = time;
  }

  Transport.prototype.__reschedule = function() {
    var nextTime;

    if (this.__nextEventPosition !== Infinity)
      nextTime = Math.min(this.__nextEventTime, this.getTimeAtPosition(this.__nextEventPosition));
    else
      nextTime = this.__nextEventTime;

    if (nextTime !== this.__nextTime) {
      this.__nextTime = nextTime;
      this.rescheduleEngine(nextTime);
    }
  }

  // EventEngine syncEvent
  Transport.prototype.syncEvent = function(time) {
    this.__nextEventTime = Infinity;
    this.__nextEventPosition = Infinity;

    this.__time = time;

    if (this.__speed) {
      this.__timeEvents.clear();
      this.__nextEventTime = this.__timeEvents.insertAll(this.__timeEngines, time);

      this.__positionEvents.reverse = (this.__speed < 0);
      this.__positionEvents.clear();
      this.__nextEventPosition = this.__positionEvents.insertAll(this.__positionEngines, this.__position);
    }

    if (this.__nextEventPosition !== Infinity)
      this.__nextTime = Math.min(this.__nextEventTime, this.getTimeAtPosition(this.__nextEventPosition));
    else
      this.__nextTime = this.__nextEventTime;

    return this.__nextTime - time;
  }

  // EventEngine executeEvent
  Transport.prototype.executeEvent = function(time, audioTime) {
    this.__sync(time);

    if (this.__nextTime === this.__nextEventTime)
      this.__nextEventTime = this.__timeEvents.advance(time, audioTime);
    else
      this.__nextEventPosition = this.__positionEvents.advance(this.__position, audioTime);

    if (this.__nextEventPosition !== Infinity)
      this.__nextTime = Math.min(this.__nextEventTime, this.getTimeAtPosition(this.__nextEventPosition));
    else
      this.__nextTime = this.__nextEventTime;

    return this.__nextTime - time;
  }

  Transport.prototype.getPositionAtTime = function(time) {
    return this.__position + (time - this.__time) * this.__speed;
  }

  Transport.prototype.getTimeAtPosition = function(position) {
    return this.__time + (position - this.__position) / this.__speed;
  }

  /**
   * Get transport time
   */
  function time$get$0() {
    return this.scheduler.time; // inherits time from its scheduler
  }

  /**
   * Get transport position
   */
  function position$get$0() {
    var time = this.scheduler.time;
    return this.getPositionAtTime(time);
  }

  /**
   * Get transport speed
   */
  function speed$get$0() {
    return this.__speed;
  }

  /**
   * Get whether transport runs in reverse direction (backward)
   */
  function reverse$get$0() {
    return (this.__speed < 0);
  }

  /**
   * Set transport speed
   */
  function speed$set$0(speed) {var $D$0;var $D$1;var $D$2;var $D$3;
    var lastSpeed = this.__speed;

    if (speed !== lastSpeed) {
      this.__sync(this.time);

      this.__speed = speed;

      if (lastSpeed === 0) {
        // start
        this.__timeEvents.clear();
        this.__nextEventTime = this.__timeEvents.insertAll(this.__timeEngines, this.__time);

        this.__positionEvents.reverse = (speed < 0);
        this.__positionEvents.clear();
        this.__nextEventPosition = this.__positionEvents.insertAll(this.__positionEngines, this.__position);
      } else if (speed === 0) {
        // stop/pause
        this.__nextEventTime = Infinity;
        this.__nextEventPosition = Infinity;
      } else if (speed * lastSpeed < 0) {
        // reverse direction
        this.__positionEvents.reverse = (speed < 0);
        this.__positionEvents.clear();
        this.__nextEventPosition = this.__positionEvents.insertAll(this.__positionEngines, this.__position);
      }

      this.__reschedule();

      $D$3 = (this.__speedListeners);$D$0 = GET_ITER$0($D$3);$D$2 = $D$0 === 0;$D$1 = ($D$2 ? $D$3.length : void 0);for (var listener ; $D$2 ? ($D$0 < $D$1) : !($D$1 = $D$0["next"]())["done"]; )
{listener = ($D$2 ? $D$3[$D$0++] : $D$1["value"]);listener.speed = speed;};$D$0 = $D$1 = $D$2 = $D$3 = void 0;
    }
  }

  /**
   * Set transport position
   */
  Transport.prototype.seek = function(position) {var $D$4;var $D$5;var $D$6;var $D$7;
    this.__sync(this.time);

    if (position !== this.__position) {
      this.__position = position;

      if (this.__speed !== 0) {
        this.__positionEvents.clear();
        this.__nextEventPosition = this.__positionEvents.insertAll(this.__positionEngines, this.__position, true);

        this.__reschedule();

        $D$7 = (this.__seekListeners);$D$4 = GET_ITER$0($D$7);$D$6 = $D$4 === 0;$D$5 = ($D$6 ? $D$7.length : void 0);for (var listener ; $D$6 ? ($D$4 < $D$5) : !($D$5 = $D$4["next"]())["done"]; )
{listener = ($D$6 ? $D$7[$D$4++] : $D$5["value"]);listener.seek(position);};$D$4 = $D$5 = $D$6 = $D$7 = void 0;
      }
    }
  }

  /**
   * Add an engine to the transport
   */
  Transport.prototype.add = function(engine) {
    if (engine.transport === null) {
      this.__sync(this.time);

      if (engine.syncEvent && engine.executeEvent) {
        // add an event engine

        if (engine.scheduler === null) {
          if (engine.alignToTransportPosition) {
            if (this.__speed !== 0)
              this.__nextEventPosition = this.__positionEvents.insert(engine, this.__position);
            this.__positionEngines.push(engine);
          } else {
            if (this.__speed !== 0)
              this.__nextEventTime = this.__timeEvents.insert(engine, this.__time);
            this.__timeEngines.push(engine);
          }

          engine.scheduler = this;

          if (this.__speed !== 0)
            this.__reschedule();
        }
      } else {
        // add a non-event engine that has a speed property and/or a seek method

        if (engine.speed)
          this.__speedListeners.push(engine);

        if (engine.seek)
          this.__seekListeners.push(engine);
      }

      engine.transport = this;
    }
  }

  /**
   * Remove an engine from the transport
   */
  Transport.prototype.remove = function(engine) {
    if (engine.transport === this) {
      this.__sync(this.time);

      if (engine.syncEvent && engine.executeEvent) {
        // remove an event engine

        if (engine.scheduler === this) {
          if (engine.alignToTransportPosition) {
            this.__nextEventPosition = this.__positionEvents.remove(engine);
            arrayRemove(this.__positionEngines, engine);
          } else {
            this.__nextEventTime = this.__timeEvents.remove(engine);
            arrayRemove(this.__timeEngines, engine);
          }

          engine.scheduler = null;

          if (this.__speed !== 0)
            this.__reschedule();
        }
      } else {
        // remove a non-event engine that has a speed property and/or a seek method

        if (engine.speed)
          arrayRemove(this.__speedListeners, engine);

        if (engine.seek)
          arrayRemove(this.__seekListeners, engine);
      }

      engine.transport = null;
    }
  }

  /**
   * Resychronize event engine
   */
  Transport.prototype.resync = function(engine) {
    if (engine.scheduler === this && engine.syncEvent && engine.executeEvent) {
      this.__sync(this.time);

      if (this._speed !== 0) {
        if (engine.alignToTransportPosition)
          this.__nextEventPosition = this.__positionEvents.move(engine, this.__position);
        else
          this.__nextEventTime = this.__timeEvents.move(engine, this.__time);

        this.__reschedule();
      }
    }
  }

  /**
   * Reschedule event engine at given time (or position)
   */
  Transport.prototype.reschedule = function(engine, time) {
    if (engine.scheduler === this && engine.syncEvent && engine.executeEvent) {
      this.__sync(this.time);

      if (this._speed !== 0) {
        if (engine.alignToTransportPosition)
          this.__nextEventPosition = this.__positionEvents.move(engine, time, false);
        else
          this.__nextEventTime = this.__timeEvents.move(engine, time, false);

        this.__reschedule();
      }
    }
  }

  /**
   * Start playing (high level API)
   */
  Transport.prototype.startPlaying = function() {var seek = arguments[0];if(seek === void 0)seek = null;var speed = arguments[1];if(speed === void 0)speed = null;
    if (seek)
      this.seek(seek);

    if (speed)
      this.playingSpeed = speed;

    this.speed = this.playingSpeed;
  }

  /**
   * Pause playing (high level API)
   */
  Transport.prototype.pausePlaying = function() {
    this.speed = 0;
  }

  /**
   * Stop playing (high level API)
   */
  Transport.prototype.stopPlaying = function() {
    this.speed = 0;
    this.seek(0);
  }

  /**
   * Set playing speed (high level API)
   */
  function playingSpeed$set$0(value) {
    if (value < 0) {
      if (value < -16)
        value = -16
      else if (value > -0.0625)
        value = -0.0625;
    } else if (value > 0) {
      if (value < 0.0625)
        value = 0.0625;
      else if (value > 16)
        value = 16;
    }

    this.__playingSpeed = value;

    if (this.__speed !== 0)
      this.speed = value;
  }

  /**
   * Get playing speed (high level API)
   */
  function playingSpeed$get$0() {
    return this.__playingSpeed;
  }
;return Transport;})(EventEngine);

module.exports = Transport;