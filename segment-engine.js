!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.SegmentEngine=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/* written in ECMAscript 6 */
/**
 * @fileoverview WAVE audio granular engine
 * @author Norbert.Schnell@ircam.fr, Victor.Saiz@ircam.fr, Karim.Barkati@ircam.fr
 */
"use strict";

var audioContext = _dereq_("audio-context");
var EventEngine = _dereq_("event-engine");

var SegmentEngine = (function(super$0){var DP$0 = Object.defineProperty;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,Object.getOwnPropertyDescriptor(s,p));}}return t};MIXIN$0(SegmentEngine, super$0);var $proto$0={};

  function SegmentEngine() {var buffer = arguments[0];if(buffer === void 0)buffer = null;
    super$0.call(this, false); // by default events don't sync to transport position

    /**
     * Audio buffer
     * @type {AudioBuffer}
     */
    this.buffer = buffer;

    /**
     * Absolute segment period in sec
     * @type {Number}
     */
    this.periodAbs = 0.1;

    /**
     * Segment period relative to absolute duration
     * @type {Number}
     */
    this.periodRel = 0;

    /**
     * Amout of random segment period variation relative to segment period
     * @type {Number}
     */
    this.periodVar = 0;

    /**
     * Array of segment positions (onset times in audio buffer) in sec
     * @type {Number}
     */
    this.positionArray = [0.0];

    /**
     * Amout of random segment position variation in sec
     * @type {Number}
     */
    this.positionVar = 0;

    /**
     * Array of segment durations in sec
     * @type {Number}
     */
    this.durationArray = [0.0];

    /**
     * Absolute segment duration in sec
     * @type {Number}
     */
    this.durationAbs = 0;

    /**
     * Segment duration relative to given segment duration or inter-segment positions
     * @type {Number}
     */
    this.durationRel = 1;

    /**
     * Array of segment offsets in sec
     * @type {Number}
     *
     * offset > 0: the segment's reference position is after the given segment position
     * offset < 0: the given segment position is the segment's reference position and the duration has to be corrected by the offset
     */
    this.offsetArray = [0.0];

    /**
     * Absolute segment offset in sec
     * @type {Number}
     */
    this.offsetAbs = -0.005;

    /**
     * Segment offset relative to segment duration
     * @type {Number}
     */
    this.offsetRel = 0;

    /**
     * Absolute attack time in sec
     * @type {Number}
     */
    this.attackAbs = 0.005;

    /**
     * Attack time relative to segment duration
     * @type {Number}
     */
    this.attackRel = 0;

    /**
     * Absolute release time in sec
     * @type {Number}
     */
    this.releaseAbs = 0.005;

    /**
     * Release time relative to segment duration
     * @type {Number}
     */
    this.releaseRel = 0;

    /**
     * Segment resampling in cent
     * @type {Number}
     */
    this.resampling = 0;

    /**
     * Amout of random resampling variation in cent
     * @type {Number}
     */
    this.resamplingVar = 0;

    /**
     * Index of 
     * @type {Number}
     */
    this.segmentIndex = 0;

    /**
     * Whether the audio buffer and segment indices are considered as cyclic
     * @type {Bool}
     */    
    this.cyclic = false;

    this.outputNode = this.__gainNode = audioContext.createGain();
  }SegmentEngine.prototype = Object.create(super$0.prototype, {"constructor": {"value": SegmentEngine, "configurable": true, "writable": true}, gain: {"get": gain$get$0, "set": gain$set$0, "configurable": true, "enumerable": true} });DP$0(SegmentEngine, "prototype", {"configurable": false, "enumerable": false, "writable": false});

  // EventEngine syncEvent
  $proto$0.syncEvent = function(time) {
    var delay = 0;

    if (this.__aligned || this.transport) { // is always aligned in transport
      var cycles = time / this.period;

      if (this.transport && this.transport.reverse)
        cycles *= -1;

      delay = (Math.ceil(cycles) - cycles) * this.period;
    }

    return delay;
  };

  // EventEngine executeEvent
  $proto$0.executeEvent = function(time, audioTime) {
    return this.trigger(audioTime);
  };

  /**
   * Set gain
   * @param {Number} value linear gain factor
   */
  function gain$set$0(value) {
    this.__gainNode.gain.value = value;
  }

  /**
   * Get gain
   * @return {Number} current gain
   */
  function gain$get$0() {
    return this.__gainNode.gain.value;
  }

  /**
   * Trigger a segment
   * @param {audioTime} segment synthesis audio time
   * @return {Number} period to next segment
   *
   * This function can be called at any time (whether the engine is scheduled or not)
   * to generate a single segment according to the current segment parameters.
   */
  $proto$0.trigger = function(audioTime) {
    var segmentTime = audioTime || audioContext.currentTime;
    var segmentPeriod = this.periodAbs;
    var segmentIndex = this.segmentIndex;

    if (this.buffer) {
      var segmentPosition = 0.0;
      var segmentDuration = 0.0;
      var segmentOffset = 0.0;
      var resamplingRate = 1.0;

      if (this.cyclic)
        segmentIndex = segmentIndex % this.positionArray.length;
      else
        segmentIndex = Math.max(0, Math.min(segmentIndex, this.positionArray.length - 1));

      if (this.positionArray)
        segmentPosition = this.positionArray[segmentIndex] || 0;

      if (this.durationArray)
        segmentDuration = this.durationArray[segmentIndex] || 0;

      if (this.offsetArray)
        segmentOffset = this.offsetArray[segmentIndex] || 0;

      // calculate resampling
      if (this.resampling !== 0 || this.resamplingVar > 0) {
        var randomResampling = (Math.random() - 0.5) * 2.0 * this.resamplingVar;
        resamplingRate = Math.pow(2.0, (this.resampling + randomResampling) / 1200.0);
      }

      // calculate inter marker distance
      if (segmentDuration === 0 || this.periodRel > 0) {
        var nextPosition = this.positionArray[segmentIndex + 1] || this.buffer.duration;
        var nextOffset = this.offsetArray[segmentIndex + 1] || 0;
        var interMarker = nextPosition - segmentPosition;

        // correct inter marker distance by offsets
        //   offset > 0: the segment's reference position is after the given segment position
        if (segmentOffset > 0)
          interMarker -= segmentOffset;

        if (nextOffset > 0)
          interMarker += nextOffset;

        if (interMarker < 0)
          interMarker = 0;

        // use inter marker distance instead of segment duration 
        if (segmentDuration === 0)
          segmentDuration = interMarker;

        // calculate period relative to inter marker distance
        segmentPeriod += this.periodRel * interMarker;
      }

      // add relative and absolute segment duration
      segmentDuration *= this.durationRel;
      segmentDuration += this.durationAbs;

      // add relative and absolute segment offset
      segmentOffset *= this.offsetRel;
      segmentOffset += this.offsetAbs;

      // apply segment offset
      //   offset > 0: the segment's reference position is after the given segment position
      //   offset < 0: the given segment position is the segment's reference position and the duration has to be corrected by the offset
      if (segmentOffset < 0) {
        segmentDuration -= segmentOffset;
        segmentPosition += segmentOffset;
        segmentTime += (segmentOffset / resamplingRate);
      } else {
        segmentTime -= (segmentOffset / resamplingRate);
      }

      // randomize segment position
      if (this.positionVar > 0)
        segmentPosition += 2.0 * (Math.random() - 0.5) * this.positionVar;

      // shorten duration of segments over the edges of the buffer
      if (segmentPosition < 0) {
        segmentDuration += segmentPosition;
        segmentPosition = 0;
      }

      if (segmentPosition + segmentDuration > this.buffer.duration)
        segmentDuration = this.buffer.duration - segmentPosition;

      // make segment
      if (this.gain > 0 && segmentDuration > 0) {
        // make segment envelope
        var envelopeNode = audioContext.createGain();
        var attack = this.attackAbs + this.attackRel * segmentDuration;
        var release = this.releaseAbs + this.releaseRel * segmentDuration;

        if (attack + release > segmentDuration) {
          var factor = segmentDuration / (attack + release);
          attack *= factor;
          release *= factor;
        }

        var attackEndTime = segmentTime + attack;
        var segmentEndTime = segmentTime + segmentDuration;
        var releaseStartTime = segmentEndTime - release;

        envelopeNode.gain.value = this.gain;

        envelopeNode.gain.setValueAtTime(0.0, segmentTime);
        envelopeNode.gain.linearRampToValueAtTime(this.gain, attackEndTime);

        if (releaseStartTime > attackEndTime)
          envelopeNode.gain.setValueAtTime(this.gain, releaseStartTime);

        envelopeNode.gain.linearRampToValueAtTime(0.0, segmentEndTime);
        envelopeNode.connect(this.__gainNode);

        // make source
        var source = audioContext.createBufferSource();

        source.buffer = this.buffer;
        source.playbackRate.value = resamplingRate;
        source.connect(envelopeNode);
        envelopeNode.connect(this.__gainNode);

        source.start(segmentTime, segmentPosition);
        source.stop(segmentTime + segmentDuration / resamplingRate);
      }
    }

    return segmentPeriod;
  };
MIXIN$0(SegmentEngine.prototype,$proto$0);$proto$0=void 0;return SegmentEngine;})(EventEngine);

module.exports = SegmentEngine;
},{"audio-context":2,"event-engine":3}],2:[function(_dereq_,module,exports){
/* Generated by es6-transpiler v 0.7.14-2 */
// instantiates an audio context in the global scope if not there already
var context = window.audioContext || new AudioContext() || new webkitAudioContext();
window.audioContext = context;
module.exports = context;
},{}],3:[function(_dereq_,module,exports){

/**
 * @fileoverview WAVE audio event engine base class
 * @author Norbert.Schnell@ircam.fr, Victor.Saiz@ircam.fr, Karim.Barkati@ircam.fr
 * @version 3.0
 */
"use strict";

var EventEngine = (function(){var DP$0 = Object.defineProperty;
  function EventEngine() {var alignToTransportPosition = arguments[0];if(alignToTransportPosition === void 0)alignToTransportPosition = true;
    this.scheduler = null;
    this.transport = null;

    this.alignToTransportPosition = alignToTransportPosition; // true: events are aligned to position when executed within transport

    this.outputNode = null;
  }DP$0(EventEngine, "prototype", {"configurable": false, "enumerable": false, "writable": false});

  /**
   * Synchronize event engine
   * @param {float} time synchronization time or transport position
   * @return {float} next event time
   */
  EventEngine.prototype.syncEvent = function(time) {
    return Infinity;
  }

  /**
   * Execute next event
   * @param {float} time the event's scheduler time or transport position
   * @param {float} audioTime the event's corresponding audio context's currentTime
   * @return {float} next event time
   */
  EventEngine.prototype.executeEvent = function(time, audioTime) {
    return Infinity; // return next event time
  }

  /**
   * Request event engine resynchronization (called by engine itself)
   */
  EventEngine.prototype.resyncEngine = function() {
    if(this.scheduler)
      this.scheduler.resync(this);
  }

  /**
   * Request event engine rescheduling (called by engine itself)
   * @param {float} time the event's new scheduler time or transport position
   */
  EventEngine.prototype.rescheduleEngine = function(time) {
    if(this.scheduler)
      this.scheduler.reschedule(this, time);
  }

  EventEngine.prototype.connect = function(target) {
    this.outputNode.connect(target);
    return this;
  }

  EventEngine.prototype.disconnect = function(target) {
    this.outputNode.disconnect(target);
    return this;
  }
;return EventEngine;})();

module.exports = EventEngine;
},{}]},{},[1])
(1)
});