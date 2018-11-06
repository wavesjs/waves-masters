(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// works by reference
function swap(arr, i1, i2) {
  var tmp = arr[i1];
  arr[i1] = arr[i2];
  arr[i2] = tmp;
}

// https://jsperf.com/js-for-loop-vs-array-indexof/346
function indexOf(arr, el) {
  var l = arr.length;
  // ignore first element as it can't be a entry
  for (var i = 1; i < l; i++) {
    if (arr[i] === el) {
      return i;
    }
  }

  return -1;
}

/**
 * Define if `time1` should be lower in the topography than `time2`.
 * Is dynamically affected to the priority queue according to handle `min` and `max` heap.
 *
 * @private
 * @param {Number} time1
 * @param {Number} time2
 * @return {Boolean}
 */
var _isLowerMaxHeap = function _isLowerMaxHeap(time1, time2) {
  return time1 < time2;
};

var _isLowerMinHeap = function _isLowerMinHeap(time1, time2) {
  return time1 > time2;
};

/**
 * Define if `time1` should be higher in the topography than `time2`.
 * Is dynamically affected to the priority queue according to handle `min` and `max` heap.
 *
 * @private
 * @param {Number} time1
 * @param {Number} time2
 * @return {Boolean}
 */
var _isHigherMaxHeap = function _isHigherMaxHeap(time1, time2) {
  return time1 > time2;
};

var _isHigherMinHeap = function _isHigherMinHeap(time1, time2) {
  return time1 < time2;
};

var POSITIVE_INFINITY = Number.POSITIVE_INFINITY;

/**
 * Priority queue implementing a binary heap.
 * Acts as a min heap by default, can be dynamically changed to a max heap
 * by setting `reverse` to true.
 *
 * _note_: the queue creates and maintains a new property (i.e. `queueTime`)
 * to each object added.
 *
 * @param {Number} [heapLength=100] - Default size of the array used to create the heap.
 */

var PriorityQueue = function () {
  function PriorityQueue() {
    var heapLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
    (0, _classCallCheck3.default)(this, PriorityQueue);

    /**
     * Pointer to the first empty index of the heap.
     * @type {Number}
     * @memberof PriorityQueue
     * @name _currentLength
     * @private
     */
    this._currentLength = 1;

    /**
     * Array of the sorted indexes of the entries, the actual heap. Ignore the index 0.
     * @type {Array}
     * @memberof PriorityQueue
     * @name _heap
     * @private
     */
    this._heap = new Array(heapLength + 1);

    /**
     * Type of the queue: `min` heap if `false`, `max` heap if `true`
     * @type {Boolean}
     * @memberof PriorityQueue
     * @name _reverse
     * @private
     */
    this._reverse = null;

    // initialize compare functions
    this.reverse = false;
  }

  /**
   * Time of the first element in the binary heap.
   * @returns {Number}
   */


  (0, _createClass3.default)(PriorityQueue, [{
    key: "_bubbleUp",


    /**
     * Fix the heap by moving an entry to a new upper position.
     *
     * @private
     * @param {Number} startIndex - The index of the entry to move.
     */
    value: function _bubbleUp(startIndex) {
      var entry = this._heap[startIndex];

      var index = startIndex;
      var parentIndex = Math.floor(index / 2);
      var parent = this._heap[parentIndex];

      while (parent && this._isHigher(entry.queueTime, parent.queueTime)) {
        swap(this._heap, index, parentIndex);

        index = parentIndex;
        parentIndex = Math.floor(index / 2);
        parent = this._heap[parentIndex];
      }
    }

    /**
     * Fix the heap by moving an entry to a new lower position.
     *
     * @private
     * @param {Number} startIndex - The index of the entry to move.
     */

  }, {
    key: "_bubbleDown",
    value: function _bubbleDown(startIndex) {
      var entry = this._heap[startIndex];

      var index = startIndex;
      var c1index = index * 2;
      var c2index = c1index + 1;
      var child1 = this._heap[c1index];
      var child2 = this._heap[c2index];

      while (child1 && this._isLower(entry.queueTime, child1.queueTime) || child2 && this._isLower(entry.queueTime, child2.queueTime)) {
        // swap with the minimum child
        var targetIndex = void 0;

        if (child2) targetIndex = this._isHigher(child1.queueTime, child2.queueTime) ? c1index : c2index;else targetIndex = c1index;

        swap(this._heap, index, targetIndex);

        // update to find next children
        index = targetIndex;
        c1index = index * 2;
        c2index = c1index + 1;
        child1 = this._heap[c1index];
        child2 = this._heap[c2index];
      }
    }

    /**
     * Build the heap (from bottom up).
     */

  }, {
    key: "buildHeap",
    value: function buildHeap() {
      // find the index of the last internal node
      // @todo - make sure that's the right way to do.
      var maxIndex = Math.floor((this._currentLength - 1) / 2);

      for (var i = maxIndex; i > 0; i--) {
        this._bubbleDown(i);
      }
    }

    /**
     * Insert a new object in the binary heap and sort it.
     *
     * @param {Object} entry - Entry to insert.
     * @param {Number} time - Time at which the entry should be orderer.
     * @returns {Number} - Time of the first entry in the heap.
     */

  }, {
    key: "insert",
    value: function insert(entry, time) {
      if (Math.abs(time) !== POSITIVE_INFINITY) {
        entry.queueTime = time;
        // add the new entry at the end of the heap
        this._heap[this._currentLength] = entry;
        // bubble it up
        this._bubbleUp(this._currentLength);
        this._currentLength += 1;

        return this.time;
      }

      entry.queueTime = undefined;
      return this.remove(entry);
    }

    /**
     * Move a given entry to a new position.
     *
     * @param {Object} entry - Entry to move.
     * @param {Number} time - Time at which the entry should be orderer.
     * @return {Number} - Time of first entry in the heap.
     */

  }, {
    key: "move",
    value: function move(entry, time) {
      if (Math.abs(time) !== POSITIVE_INFINITY) {
        var index = indexOf(this._heap, entry);

        if (index !== -1) {
          entry.queueTime = time;
          // define if the entry should be bubbled up or down
          var parent = this._heap[Math.floor(index / 2)];

          if (parent && this._isHigher(time, parent.queueTime)) this._bubbleUp(index);else this._bubbleDown(index);
        }

        return this.time;
      }

      entry.queueTime = undefined;
      return this.remove(entry);
    }

    /**
     * Remove an entry from the heap and fix the heap.
     *
     * @param {Object} entry - Entry to remove.
     * @return {Number} - Time of first entry in the heap.
     */

  }, {
    key: "remove",
    value: function remove(entry) {
      // find the index of the entry
      var index = indexOf(this._heap, entry);

      if (index !== -1) {
        var lastIndex = this._currentLength - 1;

        // if the entry is the last one
        if (index === lastIndex) {
          // remove the element from heap
          this._heap[lastIndex] = undefined;
          // update current length
          this._currentLength = lastIndex;

          return this.time;
        } else {
          // swap with the last element of the heap
          swap(this._heap, index, lastIndex);
          // remove the element from heap
          this._heap[lastIndex] = undefined;

          if (index === 1) {
            this._bubbleDown(1);
          } else {
            // bubble the (ex last) element up or down according to its new context
            var _entry = this._heap[index];
            var parent = this._heap[Math.floor(index / 2)];

            if (parent && this._isHigher(_entry.queueTime, parent.queueTime)) this._bubbleUp(index);else this._bubbleDown(index);
          }
        }

        // update current length
        this._currentLength = lastIndex;
      }

      return this.time;
    }

    /**
     * Clear the queue.
     */

  }, {
    key: "clear",
    value: function clear() {
      this._currentLength = 1;
      this._heap = new Array(this._heap.length);
    }

    /**
     * Defines if the queue contains the given `entry`.
     *
     * @param {Object} entry - Entry to be checked
     * @return {Boolean}
     */

  }, {
    key: "has",
    value: function has(entry) {
      return this._heap.indexOf(entry) !== -1;
    }
  }, {
    key: "time",
    get: function get() {
      if (this._currentLength > 1) return this._heap[1].queueTime;

      return Infinity;
    }

    /**
     * First element in the binary heap.
     * @returns {Number}
     * @readonly
     */

  }, {
    key: "head",
    get: function get() {
      return this._heap[1];
    }

    /**
     * Change the order of the queue (max heap if true, min heap if false),
     * rebuild the heap with the existing entries.
     *
     * @type {Boolean}
     */

  }, {
    key: "reverse",
    set: function set(value) {
      if (value !== this._reverse) {
        this._reverse = value;

        if (this._reverse === true) {
          this._isLower = _isLowerMaxHeap;
          this._isHigher = _isHigherMaxHeap;
        } else {
          this._isLower = _isLowerMinHeap;
          this._isHigher = _isHigherMinHeap;
        }

        this.buildHeap();
      }
    },
    get: function get() {
      return this._reverse;
    }
  }]);
  return PriorityQueue;
}();

exports.default = PriorityQueue;

},{"babel-runtime/helpers/classCallCheck":127,"babel-runtime/helpers/createClass":128}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _PriorityQueue = require('./PriorityQueue');

var _PriorityQueue2 = _interopRequireDefault(_PriorityQueue);

var _TimeEngine2 = require('./TimeEngine');

var _TimeEngine3 = _interopRequireDefault(_TimeEngine2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class SchedulingQueue
 * @extends TimeEngine
 */
/**
 * SchedulingQueue base class
 * http://wavesjs.github.io/audio/#audio-scheduling-queue
 *
 * Norbert.Schnell@ircam.fr
 * Copyright 2014, 2015 IRCAM – Centre Pompidou
 */

var SchedulingQueue = function (_TimeEngine) {
  (0, _inherits3.default)(SchedulingQueue, _TimeEngine);

  function SchedulingQueue() {
    (0, _classCallCheck3.default)(this, SchedulingQueue);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SchedulingQueue.__proto__ || (0, _getPrototypeOf2.default)(SchedulingQueue)).call(this));

    _this.__queue = new _PriorityQueue2.default();
    _this.__engines = new _set2.default();
    return _this;
  }

  // TimeEngine 'scheduled' interface


  (0, _createClass3.default)(SchedulingQueue, [{
    key: 'advanceTime',
    value: function advanceTime(time) {
      var engine = this.__queue.head;
      var nextEngineTime = engine.advanceTime(time);

      if (!nextEngineTime) {
        engine.master = null;
        this.__engines.delete(engine);
        this.__queue.remove(engine);
      } else {
        this.__queue.move(engine, nextEngineTime);
      }

      return this.__queue.time;
    }

    // TimeEngine master method to be implemented by derived class

  }, {
    key: 'defer',


    // call a function at a given time
    value: function defer(fun) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.currentTime;

      if (!(fun instanceof Function)) throw new Error("object cannot be defered by scheduler");

      this.add({
        advanceTime: function advanceTime(time) {
          fun(time);
        } // make sure that the advanceTime method does not returm anything
      }, time);
    }

    // add a time engine to the scheduler

  }, {
    key: 'add',
    value: function add(engine) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.currentTime;

      if (!_TimeEngine3.default.implementsScheduled(engine)) throw new Error("object cannot be added to scheduler");

      if (engine.master) throw new Error("object has already been added to a master");

      engine.master = this;

      // add to engines and queue
      this.__engines.add(engine);
      var nextTime = this.__queue.insert(engine, time);

      // reschedule queue
      this.resetTime(nextTime);
    }

    // remove a time engine from the queue

  }, {
    key: 'remove',
    value: function remove(engine) {
      if (engine.master !== this) throw new Error("object has not been added to this scheduler");

      engine.master = null;

      // remove from array and queue
      this.__engines.delete(engine);
      var nextTime = this.__queue.remove(engine);

      // reschedule queue
      this.resetTime(nextTime);
    }

    // reset next engine time

  }, {
    key: 'resetEngineTime',
    value: function resetEngineTime(engine) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.currentTime;

      if (engine.master !== this) throw new Error("object has not been added to this scheduler");

      var nextTime = void 0;

      if (this.__queue.has(engine)) nextTime = this.__queue.move(engine, time);else nextTime = this.__queue.insert(engine, time);

      this.resetTime(nextTime);
    }

    // check whether a given engine is scheduled

  }, {
    key: 'has',
    value: function has(engine) {
      return this.__engines.has(engine);
    }

    // clear queue

  }, {
    key: 'clear',
    value: function clear() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this.__engines), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var engine = _step.value;

          engine.master = null;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.__queue.clear();
      this.__engines.clear();
      this.resetTime(Infinity);
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return 0;
    }
  }]);
  return SchedulingQueue;
}(_TimeEngine3.default);

exports.default = SchedulingQueue;

},{"./PriorityQueue":1,"./TimeEngine":3,"babel-runtime/core-js/get-iterator":118,"babel-runtime/core-js/object/get-prototype-of":122,"babel-runtime/core-js/set":124,"babel-runtime/helpers/classCallCheck":127,"babel-runtime/helpers/createClass":128,"babel-runtime/helpers/inherits":130,"babel-runtime/helpers/possibleConstructorReturn":131}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base class for time engines
 *
 * A time engine generates more or less regular events and/or plays back a
 * media stream. It implements one or multiple interfaces to be driven by a
 * master (i.e. a Scheduler, a Transport or a PlayControl) in synchronization
 * with other engines. The provided interfaces are scheduled, transported,
 * and play-controlled.
 *
 *
 * #### The `scheduled` interface
 *
 * The scheduled interface allows for synchronizing an engine to a monotonous time
 * as it is provided by the Scheduler master.
 *
 * ###### `advanceTime(time :Number) -> {Number}`
 *
 * The `advanceTime` method has to be implemented by an `TimeEngine` as part of the
 * scheduled interface. The method is called by the master (e.g. the scheduler).
 * It generates an event and to returns the time of the next event (i.e. the next
 * call of advanceTime). The returned time has to be greater than the time
 * received as argument of the method. In case that a TimeEngine has to generate
 * multiple events at the same time, the engine has to implement its own loop
 * while(event.time <= time) and return the time of the next event (if any).
 *
 * ###### `resetTime(time=undefined :Number)`
 *
 * The `resetTime` method is provided by the `TimeEngine` base class. An engine may
 * call this method to reset its next event time (e.g. when a parameter is
 * changed that influences the engine's temporal behavior). When no argument
 * is given, the time is reset to the current master time. When calling the
 * method with Infinity the engine is suspended without being removed from the
 * master.
 *
 *
 * #### The `transported` interface
 *
 * The transported interface allows for synchronizing an engine to a position
 * (i.e. media playback time) that can run forward and backward and jump as it
 * is provided by the Transport master.
 *
 * ###### `syncPosition(time :Number, position :Number, speed :Number) -> {Number}`
 *
 * The `syncPositon` method has to be implemented by a `TimeEngine` as part of the
 * transported interface. The method syncPositon is called whenever the master
 * of a transported engine has to (re-)synchronize the engine's position. This
 * is for example required when the master (re-)starts playback, jumps to an
 * arbitrary position, and when reversing playback direction. The method returns
 * the next position of the engine in the given playback direction
 * (i.e. `speed < 0` or `speed > 0`).
 *
 * ###### `advancePosition(time :Number, position :Number, speed :Number) -> {Number}`
 *
 * The `advancePosition` method has to be implemented by a `TimeEngine` as part
 * of the transported interface. The master calls the advancePositon method when
 * the engine's event position is reached. The method generates an event and
 * returns the next position in the given playback direction (i.e. speed < 0 or
 * speed > 0). The returned position has to be greater (i.e. when speed > 0)
 * or less (i.e. when speed < 0) than the position received as argument of the
 * method.
 *
 * ###### `resetPosition(position=undefined :Number)`
 *
 * The resetPosition method is provided by the TimeEngine base class. An engine
 * may call this method to reset its next event position. When no argument
 * is given, the time is reset to the current master time. When calling the
 * method with Infinity the engine is suspended without being removed from
 * the master.
 *
 *
 * #### The speed-controlled interface
 *
 * The "speed-controlled" interface allows for syncronizing an engine that is
 * neither driven through the scheduled nor the transported interface. The
 * interface allows in particular to synchronize engines that assure their own
 * scheduling (i.e. audio player or an oscillator) to the event-based scheduled
 * and transported engines.
 *
 * ###### `syncSpeed(time :Number, position :Number, speed :Number, seek=false :Boolean)`
 *
 * The syncSpeed method has to be implemented by a TimeEngine as part of the
 * speed-controlled interface. The method is called by the master whenever the
 * playback speed changes or the position jumps arbitarily (i.e. on a seek).
 *
 *
 * <hr />
 *
 * Example that shows a `TimeEngine` running in a `Scheduler` that counts up
 * at a given frequency:
 * {@link https://rawgit.com/wavesjs/waves-audio/master/examples/time-engine.html}
 *
 * @example
 * import * as audio from 'waves-audio';
 *
 * class MyEngine extends audio.TimeEngine {
 *   constructor() {
 *     super();
 *     // ...
 *   }
 * }
 *
 */
var TimeEngine = function () {
  function TimeEngine() {
    (0, _classCallCheck3.default)(this, TimeEngine);

    /**
     * The engine's master.
     *
     * @type {Mixed}
     * @name master
     * @memberof TimeEngine
     */
    this.master = null;
  }

  /**
   * The time engine's current (master) time.
   *
   * @type {Number}
   * @memberof TimeEngine
   * @readonly
   */


  (0, _createClass3.default)(TimeEngine, [{
    key: "resetTime",
    value: function resetTime() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      if (this.master) this.master.resetEngineTime(this, time);
    }

    /**
     * Transported interface
     *   - syncPosition(time, position, speed), called to reposition TimeEngine, returns next position
     *   - advancePosition(time, position, speed), called to generate next event at given time and position, returns next position
     *
     * @static
     * @memberof TimeEngine
     */

  }, {
    key: "resetPosition",
    value: function resetPosition() {
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      if (this.master) this.master.resetEnginePosition(this, position);
    }

    /**
     * Speed-controlled interface
     *   - syncSpeed(time, position, speed, ), called to
     *
     * @static
     * @memberof TimeEngine
     */

  }, {
    key: "currentTime",
    get: function get() {
      if (this.master) return this.master.currentTime;

      return undefined;
    }

    /**
     * The time engine's current (master) audio time.
     *
     * @type {Number}
     * @memberof TimeEngine
     * @readonly
     */

  }, {
    key: "audioTime",
    get: function get() {
      if (this.master) return this.master.audioTime;

      return undefined;
    }

    /**
     * The time engine's current (master) position.
     *
     * @type {Number}
     * @memberof TimeEngine
     * @readonly
     */

  }, {
    key: "currentPosition",
    get: function get() {
      var master = this.master;

      if (master && master.currentPosition !== undefined) return master.currentPosition;

      return undefined;
    }

    /**
     * Scheduled interface
     *   - advanceTime(time), called to generate next event at given time, returns next time
     *
     * @static
     * @memberof TimeEngine
     */

  }], [{
    key: "implementsScheduled",
    value: function implementsScheduled(engine) {
      return engine.advanceTime && engine.advanceTime instanceof Function;
    }
  }, {
    key: "implementsTransported",
    value: function implementsTransported(engine) {
      return engine.syncPosition && engine.syncPosition instanceof Function && engine.advancePosition && engine.advancePosition instanceof Function;
    }
  }, {
    key: "implementsSpeedControlled",
    value: function implementsSpeedControlled(engine) {
      return engine.syncSpeed && engine.syncSpeed instanceof Function;
    }
  }]);
  return TimeEngine;
}();

exports.default = TimeEngine;

},{"babel-runtime/helpers/classCallCheck":127,"babel-runtime/helpers/createClass":128}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TimeEngine = require('./core/TimeEngine');

Object.defineProperty(exports, 'TimeEngine', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TimeEngine).default;
  }
});

var _PriorityQueue = require('./core/PriorityQueue');

Object.defineProperty(exports, 'PriorityQueue', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_PriorityQueue).default;
  }
});

var _SchedulingQueue = require('./core/SchedulingQueue');

Object.defineProperty(exports, 'SchedulingQueue', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SchedulingQueue).default;
  }
});

var _PlayControl = require('./masters/PlayControl');

Object.defineProperty(exports, 'PlayControl', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_PlayControl).default;
  }
});

var _Transport = require('./masters/Transport');

Object.defineProperty(exports, 'Transport', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Transport).default;
  }
});

var _Scheduler = require('./masters/Scheduler');

Object.defineProperty(exports, 'Scheduler', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Scheduler).default;
  }
});

var _SimpleScheduler = require('./masters/SimpleScheduler');

Object.defineProperty(exports, 'SimpleScheduler', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SimpleScheduler).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./core/PriorityQueue":1,"./core/SchedulingQueue":2,"./core/TimeEngine":3,"./masters/PlayControl":5,"./masters/Scheduler":6,"./masters/SimpleScheduler":7,"./masters/Transport":8}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _SchedulingQueue2 = require('../core/SchedulingQueue');

var _SchedulingQueue3 = _interopRequireDefault(_SchedulingQueue2);

var _TimeEngine4 = require('../core/TimeEngine');

var _TimeEngine5 = _interopRequireDefault(_TimeEngine4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EPSILON = 1e-8;

var LoopControl = function (_TimeEngine) {
  (0, _inherits3.default)(LoopControl, _TimeEngine);

  function LoopControl(playControl) {
    (0, _classCallCheck3.default)(this, LoopControl);

    var _this = (0, _possibleConstructorReturn3.default)(this, (LoopControl.__proto__ || (0, _getPrototypeOf2.default)(LoopControl)).call(this));

    _this.__playControl = playControl;
    _this.speed = 1;
    _this.lower = -Infinity;
    _this.upper = Infinity;
    return _this;
  }

  // TimeEngine method (scheduled interface)


  (0, _createClass3.default)(LoopControl, [{
    key: 'advanceTime',
    value: function advanceTime(time) {
      var playControl = this.__playControl;
      var speed = this.speed;
      var lower = this.lower;
      var upper = this.upper;

      if (speed > 0) time += EPSILON;else time -= EPSILON;

      if (speed > 0) {
        playControl.syncSpeed(time, lower, speed, true);
        return playControl.__getTimeAtPosition(upper) - EPSILON;
      } else if (speed < 0) {
        playControl.syncSpeed(time, upper, speed, true);
        return playControl.__getTimeAtPosition(lower) + EPSILON;
      }

      return Infinity;
    }
  }, {
    key: 'reschedule',
    value: function reschedule(speed) {
      var playControl = this.__playControl;
      var lower = Math.min(playControl.__loopStart, playControl.__loopEnd);
      var upper = Math.max(playControl.__loopStart, playControl.__loopEnd);

      this.speed = speed;
      this.lower = lower;
      this.upper = upper;

      if (lower === upper) speed = 0;

      if (speed > 0) this.resetTime(playControl.__getTimeAtPosition(upper) - EPSILON);else if (speed < 0) this.resetTime(playControl.__getTimeAtPosition(lower) + EPSILON);else this.resetTime(Infinity);
    }
  }, {
    key: 'applyLoopBoundaries',
    value: function applyLoopBoundaries(position, speed) {
      var lower = this.lower;
      var upper = this.upper;

      if (speed > 0 && position >= upper) return lower + (position - lower) % (upper - lower);else if (speed < 0 && position < lower) return upper - (upper - position) % (upper - lower);

      return position;
    }
  }]);
  return LoopControl;
}(_TimeEngine5.default);

// play controlled base class


var PlayControlled = function () {
  function PlayControlled(playControl, engine) {
    (0, _classCallCheck3.default)(this, PlayControlled);

    this.__playControl = playControl;

    engine.master = this;
    this.__engine = engine;
  }

  (0, _createClass3.default)(PlayControlled, [{
    key: 'syncSpeed',
    value: function syncSpeed(time, position, speed, seek, lastSpeed) {
      this.__engine.syncSpeed(time, position, speed, seek);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.__playControl = null;

      this.__engine.master = null;
      this.__engine = null;
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return this.__playControl.currentTime;
    }
  }, {
    key: 'audioTime',
    get: function get() {
      return this.__playControl.audioTime;
    }
  }, {
    key: 'currentPosition',
    get: function get() {
      return this.__playControl.currentPosition;
    }
  }]);
  return PlayControlled;
}();

// play control for engines implementing the *speed-controlled* interface


var PlayControlledSpeedControlled = function (_PlayControlled) {
  (0, _inherits3.default)(PlayControlledSpeedControlled, _PlayControlled);

  function PlayControlledSpeedControlled(playControl, engine) {
    (0, _classCallCheck3.default)(this, PlayControlledSpeedControlled);
    return (0, _possibleConstructorReturn3.default)(this, (PlayControlledSpeedControlled.__proto__ || (0, _getPrototypeOf2.default)(PlayControlledSpeedControlled)).call(this, playControl, engine));
  }

  return PlayControlledSpeedControlled;
}(PlayControlled);

// play control for engines implmenting the *transported* interface


var PlayControlledTransported = function (_PlayControlled2) {
  (0, _inherits3.default)(PlayControlledTransported, _PlayControlled2);

  function PlayControlledTransported(playControl, engine) {
    (0, _classCallCheck3.default)(this, PlayControlledTransported);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (PlayControlledTransported.__proto__ || (0, _getPrototypeOf2.default)(PlayControlledTransported)).call(this, playControl, engine));

    _this3.__schedulerHook = new PlayControlledSchedulerHook(playControl, engine);
    return _this3;
  }

  (0, _createClass3.default)(PlayControlledTransported, [{
    key: 'syncSpeed',
    value: function syncSpeed(time, position, speed, seek, lastSpeed) {
      if (speed !== lastSpeed || seek) {
        var nextPosition;

        // resync transported engines
        if (seek || speed * lastSpeed < 0) {
          // seek or reverse direction
          nextPosition = this.__engine.syncPosition(time, position, speed);
        } else if (lastSpeed === 0) {
          // start
          nextPosition = this.__engine.syncPosition(time, position, speed);
        } else if (speed === 0) {
          // stop / pause
          this.__engine.syncPosition(time, position, speed);
          nextPosition = Infinity;

          // if (this.__engine.syncSpeed)
          //   this.__engine.syncSpeed(time, position, 0);
        } else if (this.__engine.syncSpeed) {
          // change speed without reversing direction
          this.__engine.syncSpeed(time, position, speed);
        }

        this.__schedulerHook.resetPosition(nextPosition);
      }
    }
  }, {
    key: 'resetEnginePosition',
    value: function resetEnginePosition(engine) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      if (position === undefined) {
        var playControl = this.__playControl;
        var time = playControl.__sync();

        position = this.__engine.syncPosition(time, playControl.__position, playControl.__speed);
      }

      this.__schedulerHook.resetPosition(position);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.__schedulerHook.destroy();
      this.__schedulerHook = null;

      (0, _get3.default)(PlayControlledTransported.prototype.__proto__ || (0, _getPrototypeOf2.default)(PlayControlledTransported.prototype), 'destroy', this).call(this);
    }
  }]);
  return PlayControlledTransported;
}(PlayControlled);

// play control for time engines implementing the *scheduled* interface


var PlayControlledScheduled = function (_PlayControlled3) {
  (0, _inherits3.default)(PlayControlledScheduled, _PlayControlled3);

  function PlayControlledScheduled(playControl, engine) {
    (0, _classCallCheck3.default)(this, PlayControlledScheduled);

    // scheduling queue becomes master of engine
    var _this4 = (0, _possibleConstructorReturn3.default)(this, (PlayControlledScheduled.__proto__ || (0, _getPrototypeOf2.default)(PlayControlledScheduled)).call(this, playControl, engine));

    engine.master = null;
    _this4.__schedulingQueue = new PlayControlledSchedulingQueue(playControl, engine);
    return _this4;
  }

  (0, _createClass3.default)(PlayControlledScheduled, [{
    key: 'syncSpeed',
    value: function syncSpeed(time, position, speed, seek, lastSpeed) {
      if (lastSpeed === 0 && speed !== 0) // start or seek
        this.__engine.resetTime();else if (lastSpeed !== 0 && speed === 0) // stop
        this.__engine.resetTime(Infinity);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.__schedulingQueue.destroy();
      (0, _get3.default)(PlayControlledScheduled.prototype.__proto__ || (0, _getPrototypeOf2.default)(PlayControlledScheduled.prototype), 'destroy', this).call(this);
    }
  }]);
  return PlayControlledScheduled;
}(PlayControlled);

// translates transported engine advancePosition into global scheduler times


var PlayControlledSchedulerHook = function (_TimeEngine2) {
  (0, _inherits3.default)(PlayControlledSchedulerHook, _TimeEngine2);

  function PlayControlledSchedulerHook(playControl, engine) {
    (0, _classCallCheck3.default)(this, PlayControlledSchedulerHook);

    var _this5 = (0, _possibleConstructorReturn3.default)(this, (PlayControlledSchedulerHook.__proto__ || (0, _getPrototypeOf2.default)(PlayControlledSchedulerHook)).call(this));

    _this5.__playControl = playControl;
    _this5.__engine = engine;

    _this5.__nextPosition = Infinity;
    playControl.__scheduler.add(_this5, Infinity);
    return _this5;
  }

  (0, _createClass3.default)(PlayControlledSchedulerHook, [{
    key: 'advanceTime',
    value: function advanceTime(time) {
      var playControl = this.__playControl;
      var engine = this.__engine;
      var position = this.__nextPosition;
      var nextPosition = engine.advancePosition(time, position, playControl.__speed);
      var nextTime = playControl.__getTimeAtPosition(nextPosition);

      this.__nextPosition = nextPosition;
      return nextTime;
    }
  }, {
    key: 'resetPosition',
    value: function resetPosition() {
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.__nextPosition;

      var time = this.__playControl.__getTimeAtPosition(position);
      this.__nextPosition = position;
      this.resetTime(time);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.__playControl.__scheduler.remove(this);
      this.__playControl = null;
      this.__engine = null;
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return this.__playControl.currentTime;
    }
  }, {
    key: 'audioTime',
    get: function get() {
      return this.__playControl.audioTime;
    }
  }, {
    key: 'currentPosition',
    get: function get() {
      return this.__playControl.currentPosition;
    }
  }]);
  return PlayControlledSchedulerHook;
}(_TimeEngine5.default);

// internal scheduling queue that returns the current position (and time) of the play control


var PlayControlledSchedulingQueue = function (_SchedulingQueue) {
  (0, _inherits3.default)(PlayControlledSchedulingQueue, _SchedulingQueue);

  function PlayControlledSchedulingQueue(playControl, engine) {
    (0, _classCallCheck3.default)(this, PlayControlledSchedulingQueue);

    var _this6 = (0, _possibleConstructorReturn3.default)(this, (PlayControlledSchedulingQueue.__proto__ || (0, _getPrototypeOf2.default)(PlayControlledSchedulingQueue)).call(this));

    _this6.__playControl = playControl;
    _this6.__engine = engine;

    _this6.add(engine, Infinity);
    playControl.__scheduler.add(_this6, Infinity);
    return _this6;
  }

  (0, _createClass3.default)(PlayControlledSchedulingQueue, [{
    key: 'destroy',
    value: function destroy() {
      this.__playControl.__scheduler.remove(this);
      this.remove(this.__engine);

      this.__playControl = null;
      this.__engine = null;
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return this.__playControl.currentTime;
    }
  }, {
    key: 'audioTime',
    get: function get() {
      return this.__playControl.audioTime;
    }
  }, {
    key: 'currentPosition',
    get: function get() {
      return this.__playControl.currentPosition;
    }
  }]);
  return PlayControlledSchedulingQueue;
}(_SchedulingQueue3.default);

/**
 * Extends Time Engine to provide playback control of a Time Engine instance.
 *
 * [example]{@link https://rawgit.com/wavesjs/waves-masters/master/examples/transport/index.html}
 *
 * @extends TimeEngine
 * @param {Object} scheduler - instance of Scheduler
 * @param {TimeEngine} engine - engine to control
 *
 * @example
 * import * as masters from 'waves-masters';
 *
 * const getTimeFunction = () => {
 *   const now = process.hrtime();
 *   return now[0] + now[1] * 1e-9;
 * }
 * const scheduler = new masters.Scheduler(getTimeFunction);
 * const playerEngine = new MyTimeEngine();
 * const playControl = new masters.PlayControl(scheduler, playerEngine);
 *
 * playControl.start();
 */


var PlayControl = function (_TimeEngine3) {
  (0, _inherits3.default)(PlayControl, _TimeEngine3);

  function PlayControl(scheduler, engine) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, PlayControl);

    var _this7 = (0, _possibleConstructorReturn3.default)(this, (PlayControl.__proto__ || (0, _getPrototypeOf2.default)(PlayControl)).call(this));

    _this7.__scheduler = scheduler;

    _this7.__playControlled = null;
    _this7.__loopControl = null;
    _this7.__loopStart = 0;
    _this7.__loopEnd = 1;

    // synchronized tie, position, and speed
    _this7.__time = 0;
    _this7.__position = 0;
    _this7.__speed = 0;

    // non-zero "user" speed
    _this7.__playingSpeed = 1;

    if (engine) _this7.__setEngine(engine);
    return _this7;
  }

  (0, _createClass3.default)(PlayControl, [{
    key: '__setEngine',
    value: function __setEngine(engine) {
      if (engine.master) throw new Error("object has already been added to a master");

      if (_TimeEngine5.default.implementsSpeedControlled(engine)) this.__playControlled = new PlayControlledSpeedControlled(this, engine);else if (_TimeEngine5.default.implementsTransported(engine)) this.__playControlled = new PlayControlledTransported(this, engine);else if (_TimeEngine5.default.implementsScheduled(engine)) this.__playControlled = new PlayControlledScheduled(this, engine);else throw new Error("object cannot be added to play control");
    }
  }, {
    key: '__resetEngine',
    value: function __resetEngine() {
      this.__playControlled.destroy();
      this.__playControlled = null;
    }

    /**
     * Calculate/extrapolate playing time for given position
     *
     * @param {Number} position position
     * @return {Number} extrapolated time
     * @private
     */

  }, {
    key: '__getTimeAtPosition',
    value: function __getTimeAtPosition(position) {
      return this.__time + (position - this.__position) / this.__speed;
    }

    /**
     * Calculate/extrapolate playing position for given time
     *
     * @param {Number} time time
     * @return {Number} extrapolated position
     * @private
     */

  }, {
    key: '__getPositionAtTime',
    value: function __getPositionAtTime(time) {
      return this.__position + (time - this.__time) * this.__speed;
    }
  }, {
    key: '__sync',
    value: function __sync() {
      var now = this.currentTime;
      this.__position += (now - this.__time) * this.__speed;
      this.__time = now;

      return now;
    }

    /**
     * Get current master time.
     *
     * @name currentTime
     * @type {Number}
     * @memberof PlayControl
     * @instance
     * @readonly
     */

  }, {
    key: 'set',
    value: function set() {
      var engine = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var time = this.__sync();
      var speed = this.__speed;

      if (this.__playControlled !== null && this.__playControlled.__engine !== engine) {

        this.syncSpeed(time, this.__position, 0);

        if (this.__playControlled) this.__resetEngine();

        if (this.__playControlled === null && engine !== null) {
          this.__setEngine(engine);

          if (speed !== 0) this.syncSpeed(time, this.__position, speed);
        }
      }
    }

    /**
     * Sets the play control loop behavior.
     *
     * @type {Boolean}
     * @name loop
     * @memberof PlayControl
     * @instance
     */

  }, {
    key: 'setLoopBoundaries',


    /**
     * Sets loop start and end time.
     *
     * @param {Number} loopStart - loop start value.
     * @param {Number} loopEnd - loop end value.
     */
    value: function setLoopBoundaries(loopStart, loopEnd) {
      this.__loopStart = loopStart;
      this.__loopEnd = loopEnd;

      this.loop = this.loop;
    }

    /**
     * Sets loop start value
     *
     * @type {Number}
     * @name loopStart
     * @memberof PlayControl
     * @instance
     */

  }, {
    key: 'syncSpeed',


    // TimeEngine method (speed-controlled interface)
    value: function syncSpeed(time, position, speed) {
      var seek = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var lastSpeed = this.__speed;

      if (speed !== lastSpeed || seek) {
        if ((seek || lastSpeed === 0) && this.__loopControl) position = this.__loopControl.applyLoopBoundaries(position, speed);

        this.__time = time;
        this.__position = position;
        this.__speed = speed;

        if (this.__playControlled) this.__playControlled.syncSpeed(time, position, speed, seek, lastSpeed);

        if (this.__loopControl) this.__loopControl.reschedule(speed);
      }
    }

    /**
     * Starts playback
     */

  }, {
    key: 'start',
    value: function start() {
      var time = this.__sync();
      this.syncSpeed(time, this.__position, this.__playingSpeed);
    }

    /**
     * Pauses playback and stays at the same position.
     */

  }, {
    key: 'pause',
    value: function pause() {
      var time = this.__sync();
      this.syncSpeed(time, this.__position, 0);
    }

    /**
     * Stops playback and seeks to initial (0) position.
     */

  }, {
    key: 'stop',
    value: function stop() {
      var time = this.__sync();
      this.syncSpeed(time, 0, 0, true);
    }

    /**
     * If speed if provided, sets the playback speed. The speed value should
     * be non-zero between -16 and -1/16 or between 1/16 and 16.
     *
     * @type {Number}
     * @name speed
     * @memberof PlayControl
     * @instance
     */

  }, {
    key: 'seek',


    /**
     * Set (jump to) playing position.
     *
     * @param {Number} position target position
     */
    value: function seek(position) {
      var time = this.__sync();
      this.__position = position;
      this.syncSpeed(time, position, this.__speed, true);
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return this.__scheduler.currentTime;
    }

    /**
     * Get current master time.
     *
     * @name audioTime
     * @type {Number}
     * @memberof PlayControl
     * @instance
     * @readonly
     */

  }, {
    key: 'audioTime',
    get: function get() {
      return this.__scheduler.audioTime;
    }

    /**
     * Get current master position.
     * This function will be replaced when the play-control is added to a master.
     *
     * @name currentPosition
     * @type {Number}
     * @memberof PlayControl
     * @instance
     * @readonly
     */

  }, {
    key: 'currentPosition',
    get: function get() {
      return this.__position + (this.__scheduler.currentTime - this.__time) * this.__speed;
    }

    /**
     * Returns if the play control is running.
     *
     * @name running
     * @type {Boolean}
     * @memberof PlayControl
     * @instance
     * @readonly
     */

  }, {
    key: 'running',
    get: function get() {
      return !(this.__speed === 0);
    }
  }, {
    key: 'loop',
    set: function set(enable) {
      if (enable && this.__loopStart > -Infinity && this.__loopEnd < Infinity) {
        if (!this.__loopControl) {
          this.__loopControl = new LoopControl(this);
          this.__scheduler.add(this.__loopControl, Infinity);
        }

        if (this.__speed !== 0) {
          var position = this.currentPosition;
          var lower = Math.min(this.__loopStart, this.__loopEnd);
          var upper = Math.max(this.__loopStart, this.__loopEnd);

          if (this.__speed > 0 && position > upper) this.seek(upper);else if (this.__speed < 0 && position < lower) this.seek(lower);else this.__loopControl.reschedule(this.__speed);
        }
      } else if (this.__loopControl) {
        this.__scheduler.remove(this.__loopControl);
        this.__loopControl = null;
      }
    },
    get: function get() {
      return !!this.__loopControl;
    }
  }, {
    key: 'loopStart',
    set: function set(loopStart) {
      this.setLoopBoundaries(loopStart, this.__loopEnd);
    },
    get: function get() {
      return this.__loopStart;
    }

    /**
     * Sets loop end value
     *
     * @type {Number}
     * @name loopEnd
     * @memberof PlayControl
     * @instance
     */

  }, {
    key: 'loopEnd',
    set: function set(loopEnd) {
      this.setLoopBoundaries(this.__loopStart, loopEnd);
    },
    get: function get() {
      return this.__loopEnd;
    }
  }, {
    key: 'speed',
    set: function set(speed) {
      var time = this.__sync();

      if (speed >= 0) {
        if (speed < 0.01) speed = 0.01;else if (speed > 100) speed = 100;
      } else {
        if (speed < -100) speed = -100;else if (speed > -0.01) speed = -0.01;
      }

      this.__playingSpeed = speed;

      if (!this.master && this.__speed !== 0) this.syncSpeed(time, this.__position, speed);
    },
    get: function get() {
      return this.__playingSpeed;
    }
  }]);
  return PlayControl;
}(_TimeEngine5.default);

exports.default = PlayControl;

},{"../core/SchedulingQueue":2,"../core/TimeEngine":3,"babel-runtime/core-js/object/get-prototype-of":122,"babel-runtime/helpers/classCallCheck":127,"babel-runtime/helpers/createClass":128,"babel-runtime/helpers/get":129,"babel-runtime/helpers/inherits":130,"babel-runtime/helpers/possibleConstructorReturn":131}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _SchedulingQueue2 = require('../core/SchedulingQueue');

var _SchedulingQueue3 = _interopRequireDefault(_SchedulingQueue2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('wavesjs:masters');

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

/**
 * The `Scheduler` class implements a master for `TimeEngine` instances
 * that implement the *scheduled* interface (such as the `Metronome` and
 * `GranularEngine`).
 *
 * A `Scheduler` can also schedule simple callback functions.
 * The class is based on recursive calls to `setTimeout` and uses the time
 * returned by the `getTimeFunction` passed as first argument as a logical time
 * passed to the `advanceTime` methods of the scheduled engines or to the
 * scheduled callback functions.
 * It extends the `SchedulingQueue` class that itself includes a `PriorityQueue`
 * to assure the order of the scheduled engines (see `SimpleScheduler` for a
 * simplified scheduler implementation without `PriorityQueue`).
 *
 * {@link https://rawgit.com/wavesjs/waves-masters/master/examples/scheduler/index.html}
 *
 * @param {Function} getTimeFunction - Function that must return a time in second.
 * @param {Object} [options={}] - default options.
 * @param {Number} [options.period=0.025] - period of the scheduler.
 * @param {Number} [options.lookahead=0.1] - lookahead of the scheduler.
 * @param {Number} [options.currentTimeToAudioTimeFunction] - function that convert
 *  `currentTime` to `audioTime`. Defaults to no-op.
 *
 * @see TimeEngine
 * @see SimpleScheduler
 *
 * @example
 * import * as masters from 'waves-masters';
 *
 * const getTimeFunction = () => preformance.now() / 1000;
 * const scheduler = new masters.Scheduler(getTimeFunction);
 *
 * scheduler.add(myEngine);
 */

var Scheduler = function (_SchedulingQueue) {
  (0, _inherits3.default)(Scheduler, _SchedulingQueue);

  function Scheduler(getTimeFunction) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, Scheduler);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Scheduler.__proto__ || (0, _getPrototypeOf2.default)(Scheduler)).call(this));

    if (!isFunction(getTimeFunction)) throw new Error('Invalid argument `getTimeFunction`');

    _this.getTimeFunction = getTimeFunction;

    _this.__currentTime = null;
    _this.__nextTime = Infinity;
    _this.__timeout = null;

    /**
     * scheduler (setTimeout) period
     * @type {Number}
     * @name period
     * @memberof Scheduler
     * @instance
     */
    _this.period = options.period || 0.025;

    /**
     * scheduler lookahead time (> period)
     * @type {Number}
     * @name lookahead
     * @memberof Scheduler
     * @instance
     */
    _this.lookahead = options.lookahead || 0.1;

    _this._currentTimeToAudioTimeFunction = options.currentTimeToAudioTimeFunction || function (currentTime) {
      return currentTime;
    };
    return _this;
  }

  // setTimeout scheduling loop


  (0, _createClass3.default)(Scheduler, [{
    key: '__tick',
    value: function __tick() {
      var currentTime = this.getTimeFunction();
      var time = this.__nextTime;

      this.__timeout = null;

      while (time <= currentTime + this.lookahead) {
        this.__currentTime = time;
        time = this.advanceTime(time);
      }

      this.__currentTime = null;
      this.resetTime(time);
    }
  }, {
    key: 'resetTime',
    value: function resetTime() {
      var _this2 = this;

      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.currentTime;

      if (this.master) {
        this.master.reset(this, time);
      } else {
        if (this.__timeout) {
          clearTimeout(this.__timeout);
          this.__timeout = null;
        }

        if (time !== Infinity) {
          if (this.__nextTime === Infinity) log('Scheduler Start');

          var timeOutDelay = Math.max(time - this.lookahead - this.getTimeFunction(), this.period);

          this.__timeout = setTimeout(function () {
            _this2.__tick();
          }, Math.ceil(timeOutDelay * 1000));
        } else if (this.__nextTime !== Infinity) {
          log('Scheduler Stop');
        }

        this.__nextTime = time;
      }
    }

    /**
     * Scheduler current logical time.
     *
     * @name currentTime
     * @type {Number}
     * @memberof Scheduler
     * @instance
     */

  }, {
    key: 'currentTime',
    get: function get() {
      // @note - can this really happen, and if yes, in which case?
      if (this.master) return this.master.currentTime;

      return this.__currentTime || this.getTimeFunction() + this.lookahead;
    }

    /**
     * Scheduler current audio time according to `currentTime`
     *
     * @name audioTime
     * @type {Number}
     * @memberif Scheduler
     * @instance
     */

  }, {
    key: 'audioTime',
    get: function get() {
      // @note - add this as in
      if (this.master) return this.master.audioTime;

      return this._currentTimeToAudioTimeFunction(this.currentTime);
    }
  }, {
    key: 'currentPosition',
    get: function get() {
      var master = this.master;

      if (master && master.currentPosition !== undefined) return master.currentPosition;

      return undefined;
    }

    // inherited from scheduling queue
    /**
     * Add a TimeEngine or a simple callback function to the scheduler at an
     * optionally given time. Whether the add method is called with a TimeEngine
     * or a callback function it returns a TimeEngine that can be used as argument
     * of the methods remove and resetEngineTime. A TimeEngine added to a scheduler
     * has to implement the scheduled interface. The callback function added to a
     * scheduler will be called at the given time and with the given time as
     * argument. The callback can return a new scheduling time (i.e. the next
     * time when it will be called) or it can return Infinity to suspend scheduling
     * without removing the function from the scheduler. A function that does
     * not return a value (or returns null or 0) is removed from the scheduler
     * and cannot be used as argument of the methods remove and resetEngineTime
     * anymore.
     *
     * @name add
     * @function
     * @memberof Scheduler
     * @instance
     * @param {TimeEngine|Function} engine - Engine to add to the scheduler
     * @param {Number} [time=this.currentTime] - Schedule time
     */
    /**
     * Remove a TimeEngine from the scheduler that has been added to the
     * scheduler using the add method.
     *
     * @name add
     * @function
     * @memberof Scheduler
     * @instance
     * @param {TimeEngine} engine - Engine to remove from the scheduler
     * @param {Number} [time=this.currentTime] - Schedule time
     */
    /**
     * Reschedule a scheduled time engine at a given time.
     *
     * @name resetEngineTime
     * @function
     * @memberof Scheduler
     * @instance
     * @param {TimeEngine} engine - Engine to reschedule
     * @param {Number} time - Schedule time
     */
    /**
     * Remove all scheduled callbacks and engines from the scheduler.
     *
     * @name clear
     * @function
     * @memberof Scheduler
     * @instance
     */

  }]);
  return Scheduler;
}(_SchedulingQueue3.default);

exports.default = Scheduler;

},{"../core/SchedulingQueue":2,"babel-runtime/core-js/object/get-prototype-of":122,"babel-runtime/helpers/classCallCheck":127,"babel-runtime/helpers/createClass":128,"babel-runtime/helpers/inherits":130,"babel-runtime/helpers/possibleConstructorReturn":131,"debug":234}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _TimeEngine = require('../core/TimeEngine');

var _TimeEngine2 = _interopRequireDefault(_TimeEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('wavesjs:masters');

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

/**
 *
 *
 *
 * The SimpleScheduler class implements a simplified master for time engines
 * (see TimeEngine) that implement the scheduled interface
 * such as the Metronome and the GranularEngine. The API and funtionalities of
 * the SimpleScheduler class are identical to the Scheduler class. But, other
 * than the Scheduler, the SimpleScheduler class does not guarantee the order
 * of events (i.e. calls to the advanceTime method of scheduled time engines
 * and to scheduled callback functions) within a scheduling period (see period
 * attribute).
 *
 * {@link https://rawgit.com/wavesjs/waves-masters/master/examples/scheduler/index.html}
 *
 * @param {Function} getTimeFunction - Function that must return a time in second.
 * @param {Object} [options={}] - default options
 * @param {Number} [options.period=0.025] - period of the scheduler.
 * @param {Number} [options.lookahead=0.1] - lookahead of the scheduler.
 *
 * @see TimeEngine
 * @see Scheduler
 *
 * @example
 * import * as masters from 'waves-masters';
 *
 * const getTimeFunction = () => preformance.now() / 1000;
 * const scheduler = new masters.SimpleScheduler(getTimeFunction);
 *
 * scheduler.add(myEngine);
 */

var SimpleScheduler = function () {
  function SimpleScheduler(getTimeFunction) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, SimpleScheduler);

    if (!isFunction(getTimeFunction)) throw new Error('Invalid argument `getTimeFunction`');

    this.getTimeFunction = getTimeFunction;

    this.__engines = new _set2.default();

    this.__schedEngines = [];
    this.__schedTimes = [];

    this.__currentTime = null;
    this.__timeout = null;

    /**
     * scheduler (setTimeout) period
     * @type {Number}
     * @name period
     * @memberof Scheduler
     * @instance
     */
    this.period = options.period || 0.025;

    /**
     * scheduler lookahead time (> period)
     * @type {Number}
     * @name lookahead
     * @memberof Scheduler
     * @instance
     */
    this.lookahead = options.lookahead || 0.1;

    this._currentTimeToAudioTimeFunction = options.currentTimeToAudioTimeFunction || function (currentTime) {
      return currentTime;
    };
  }

  (0, _createClass3.default)(SimpleScheduler, [{
    key: '__scheduleEngine',
    value: function __scheduleEngine(engine, time) {
      this.__schedEngines.push(engine);
      this.__schedTimes.push(time);
    }
  }, {
    key: '__rescheduleEngine',
    value: function __rescheduleEngine(engine, time) {
      var index = this.__schedEngines.indexOf(engine);

      if (index >= 0) {
        if (time !== Infinity) {
          this.__schedTimes[index] = time;
        } else {
          this.__schedEngines.splice(index, 1);
          this.__schedTimes.splice(index, 1);
        }
      } else if (time < Infinity) {
        this.__schedEngines.push(engine);
        this.__schedTimes.push(time);
      }
    }
  }, {
    key: '__unscheduleEngine',
    value: function __unscheduleEngine(engine) {
      var index = this.__schedEngines.indexOf(engine);

      if (index >= 0) {
        this.__schedEngines.splice(index, 1);
        this.__schedTimes.splice(index, 1);
      }
    }
  }, {
    key: '__resetTick',
    value: function __resetTick() {
      if (this.__schedEngines.length > 0) {
        if (!this.__timeout) {
          log('SimpleScheduler Start');
          this.__tick();
        }
      } else if (this.__timeout) {
        log('SimpleScheduler Stop');
        clearTimeout(this.__timeout);
        this.__timeout = null;
      }
    }
  }, {
    key: '__tick',
    value: function __tick() {
      var _this = this;

      var currentTime = this.getTimeFunction();
      var i = 0;

      while (i < this.__schedEngines.length) {
        var engine = this.__schedEngines[i];
        var time = this.__schedTimes[i];

        while (time && time <= currentTime + this.lookahead) {
          time = Math.max(time, currentTime);
          this.__currentTime = time;
          time = engine.advanceTime(time);
        }

        if (time && time < Infinity) {
          this.__schedTimes[i++] = time;
        } else {
          this.__unscheduleEngine(engine);

          // remove engine from scheduler
          if (!time) {
            engine.master = null;
            this.__engines.delete(engine);
          }
        }
      }

      this.__currentTime = null;
      this.__timeout = null;

      if (this.__schedEngines.length > 0) {
        this.__timeout = setTimeout(function () {
          _this.__tick();
        }, this.period * 1000);
      }
    }

    /**
     * Scheduler current logical time.
     *
     * @name currentTime
     * @type {Number}
     * @memberof Scheduler
     * @instance
     */

  }, {
    key: 'defer',


    // call a function at a given time
    /**
     * Defer the execution of a function at a given time.
     *
     * @param {Function} fun - Function to defer
     * @param {Number} [time=this.currentTime] - Schedule time
     */
    value: function defer(fun) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.currentTime;

      if (!(fun instanceof Function)) throw new Error("object cannot be defered by scheduler");

      this.add({
        advanceTime: function advanceTime(time) {
          fun(time);
        } // make sur that the advanceTime method does not returm anything
      }, time);
    }

    /**
     * Add a TimeEngine function to the scheduler at an optionally given time.
     *
     * @param {TimeEngine} engine - Engine to add to the scheduler
     * @param {Number} [time=this.currentTime] - Schedule time
     */

  }, {
    key: 'add',
    value: function add(engine) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.currentTime;

      if (!_TimeEngine2.default.implementsScheduled(engine)) throw new Error("object cannot be added to scheduler");

      if (engine.master) throw new Error("object has already been added to a master");

      // set master and add to array
      engine.master = this;
      this.__engines.add(engine);

      // schedule engine
      this.__scheduleEngine(engine, time);
      this.__resetTick();
    }

    /**
     * Remove a TimeEngine from the scheduler that has been added to the
     * scheduler using the add method.
     *
     * @param {TimeEngine} engine - Engine to remove from the scheduler
     * @param {Number} [time=this.currentTime] - Schedule time
     */

  }, {
    key: 'remove',
    value: function remove(engine) {
      if (!engine.master || engine.master !== this) throw new Error("engine has not been added to this scheduler");

      // reset master and remove from array
      engine.master = null;
      this.__engines.delete(engine);

      // unschedule engine
      this.__unscheduleEngine(engine);
      this.__resetTick();
    }

    /**
     * Reschedule a scheduled time engine at a given time.
     *
     * @param {TimeEngine} engine - Engine to reschedule
     * @param {Number} time - Schedule time
     */

  }, {
    key: 'resetEngineTime',
    value: function resetEngineTime(engine) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.currentTime;

      this.__rescheduleEngine(engine, time);
      this.__resetTick();
    }

    /**
     * Check whether a given engine is scheduled.
     *
     * @param {TimeEngine} engine - Engine to check
     */

  }, {
    key: 'has',
    value: function has(engine) {
      return this.__engines.has(engine);
    }

    /**
     * Remove all engines from the scheduler.
     */

  }, {
    key: 'clear',
    value: function clear() {
      if (this.__timeout) {
        clearTimeout(this.__timeout);
        this.__timeout = null;
      }

      this.__schedEngines.length = 0;
      this.__schedTimes.length = 0;
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return this.__currentTime || this.getTimeFunction() + this.lookahead;
    }

    /**
     * Scheduler current audio time according to `currentTime`
     *
     * @name audioTime
     * @type {Number}
     * @memberif Scheduler
     * @instance
     */

  }, {
    key: 'audioTime',
    get: function get() {
      // @note - add this as in
      if (this.master) return this.master.audioTime;

      return this._currentTimeToAudioTimeFunction(this.currentTime);
    }
  }, {
    key: 'currentPosition',
    get: function get() {
      return undefined;
    }
  }]);
  return SimpleScheduler;
}();

exports.default = SimpleScheduler;

},{"../core/TimeEngine":3,"babel-runtime/core-js/set":124,"babel-runtime/helpers/classCallCheck":127,"babel-runtime/helpers/createClass":128,"debug":234}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _PriorityQueue = require('../core/PriorityQueue');

var _PriorityQueue2 = _interopRequireDefault(_PriorityQueue);

var _SchedulingQueue2 = require('../core/SchedulingQueue');

var _SchedulingQueue3 = _interopRequireDefault(_SchedulingQueue2);

var _TimeEngine4 = require('../core/TimeEngine');

var _TimeEngine5 = _interopRequireDefault(_TimeEngine4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addDuplet(firstArray, secondArray, firstElement, secondElement) {
  firstArray.push(firstElement);
  secondArray.push(secondElement);
}

function removeDuplet(firstArray, secondArray, firstElement) {
  var index = firstArray.indexOf(firstElement);

  if (index >= 0) {
    var secondElement = secondArray[index];

    firstArray.splice(index, 1);
    secondArray.splice(index, 1);

    return secondElement;
  }

  return null;
}

// The Transported call is the base class of the adapters between
// different types of engines (i.e. transported, scheduled, play-controlled)
// The adapters are at the same time masters for the engines added to the transport
// and transported TimeEngines inserted into the transport's position-based pritority queue.

var Transported = function (_TimeEngine) {
  (0, _inherits3.default)(Transported, _TimeEngine);

  function Transported(transport, engine, start, duration, offset) {
    var stretch = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
    (0, _classCallCheck3.default)(this, Transported);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Transported.__proto__ || (0, _getPrototypeOf2.default)(Transported)).call(this));

    _this.master = transport;

    _this.__engine = engine;
    engine.master = _this;

    _this.__startPosition = start;
    _this.__endPosition = !isFinite(duration) ? Infinity : start + duration;
    _this.__offsetPosition = start + offset;
    _this.__stretchPosition = stretch;
    _this.__isRunning = false;
    return _this;
  }

  (0, _createClass3.default)(Transported, [{
    key: 'setBoundaries',
    value: function setBoundaries(start, duration) {
      var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var stretch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

      this.__startPosition = start;
      this.__endPosition = start + duration;
      this.__offsetPosition = start + offset;
      this.__stretchPosition = stretch;
      this.resetPosition();
    }
  }, {
    key: 'start',
    value: function start(time, position, speed) {}
  }, {
    key: 'stop',
    value: function stop(time, position) {}
  }, {
    key: 'resetPosition',
    value: function resetPosition(position) {
      if (position !== undefined) position += this.__offsetPosition;

      this.master.resetEnginePosition(this, position);
    }
  }, {
    key: 'syncPosition',
    value: function syncPosition(time, position, speed) {
      if (speed > 0) {
        if (position < this.__startPosition) {

          if (this.__isRunning) this.stop(time, position - this.__offsetPosition);

          this.__isRunning = false;
          return this.__startPosition;
        } else if (position < this.__endPosition) {
          this.start(time, position - this.__offsetPosition, speed);

          this.__isRunning = true;
          return this.__endPosition;
        }
      } else {
        if (position > this.__endPosition) {
          if (this.__isRunning) // if engine is running
            this.stop(time, position - this.__offsetPosition);

          this.__isRunning = false;
          return this.__endPosition;
        } else if (position > this.__startPosition) {
          this.start(time, position - this.__offsetPosition, speed);

          this.__isRunning = true;
          return this.__startPosition;
        }
      }

      if (this.__isRunning) // if engine is running
        this.stop(time, position);

      this.__isRunning = false;
      return Infinity * speed;
    }
  }, {
    key: 'advancePosition',
    value: function advancePosition(time, position, speed) {
      if (!this.__isRunning) {
        this.start(time, position - this.__offsetPosition, speed);
        this.__isRunning = true;

        if (speed > 0) return this.__endPosition;

        return this.__startPosition;
      }

      // stop engine
      this.stop(time, position - this.__offsetPosition);

      this.__isRunning = false;
      return Infinity * speed;
    }
  }, {
    key: 'syncSpeed',
    value: function syncSpeed(time, position, speed) {
      if (speed === 0) // stop
        this.stop(time, position - this.__offsetPosition);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.master = null;

      this.__engine.master = null;
      this.__engine = null;
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return this.master.currentTime;
    }
  }, {
    key: 'audioTime',
    get: function get() {
      return this.master.audioTime;
    }
  }, {
    key: 'currentPosition',
    get: function get() {
      return this.master.currentPosition - this.__offsetPosition;
    }
  }]);
  return Transported;
}(_TimeEngine5.default);

// TransportedTransported
// has to switch on and off the scheduled engines when the transport hits the engine's start and end position


var TransportedTransported = function (_Transported) {
  (0, _inherits3.default)(TransportedTransported, _Transported);

  function TransportedTransported(transport, engine, startPosition, endPosition, offsetPosition) {
    (0, _classCallCheck3.default)(this, TransportedTransported);
    return (0, _possibleConstructorReturn3.default)(this, (TransportedTransported.__proto__ || (0, _getPrototypeOf2.default)(TransportedTransported)).call(this, transport, engine, startPosition, endPosition, offsetPosition));
  }

  (0, _createClass3.default)(TransportedTransported, [{
    key: 'syncPosition',
    value: function syncPosition(time, position, speed) {
      if (speed > 0 && position < this.__endPosition) position = Math.max(position, this.__startPosition);else if (speed < 0 && position >= this.__startPosition) position = Math.min(position, this.__endPosition);

      return this.__offsetPosition + this.__engine.syncPosition(time, position - this.__offsetPosition, speed);
    }
  }, {
    key: 'advancePosition',
    value: function advancePosition(time, position, speed) {
      position = this.__offsetPosition + this.__engine.advancePosition(time, position - this.__offsetPosition, speed);

      if (speed > 0 && position < this.__endPosition || speed < 0 && position >= this.__startPosition) return position;

      return Infinity * speed;
    }
  }, {
    key: 'syncSpeed',
    value: function syncSpeed(time, position, speed) {
      if (this.__engine.syncSpeed) this.__engine.syncSpeed(time, position, speed);
    }
  }, {
    key: 'resetEnginePosition',
    value: function resetEnginePosition(engine) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      if (position !== undefined) position += this.__offsetPosition;

      this.resetPosition(position);
    }
  }]);
  return TransportedTransported;
}(Transported);

// TransportedSpeedControlled
// has to start and stop the speed-controlled engines when the transport hits the engine's start and end position


var TransportedSpeedControlled = function (_Transported2) {
  (0, _inherits3.default)(TransportedSpeedControlled, _Transported2);

  function TransportedSpeedControlled(transport, engine, startPosition, endPosition, offsetPosition) {
    (0, _classCallCheck3.default)(this, TransportedSpeedControlled);
    return (0, _possibleConstructorReturn3.default)(this, (TransportedSpeedControlled.__proto__ || (0, _getPrototypeOf2.default)(TransportedSpeedControlled)).call(this, transport, engine, startPosition, endPosition, offsetPosition));
  }

  (0, _createClass3.default)(TransportedSpeedControlled, [{
    key: 'start',
    value: function start(time, position, speed) {
      this.__engine.syncSpeed(time, position, speed, true);
    }
  }, {
    key: 'stop',
    value: function stop(time, position) {
      this.__engine.syncSpeed(time, position, 0);
    }
  }, {
    key: 'syncSpeed',
    value: function syncSpeed(time, position, speed) {
      if (this.__isRunning) this.__engine.syncSpeed(time, position, speed);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.__engine.syncSpeed(this.master.currentTime, this.master.currentPosition - this.__offsetPosition, 0);
      (0, _get3.default)(TransportedSpeedControlled.prototype.__proto__ || (0, _getPrototypeOf2.default)(TransportedSpeedControlled.prototype), 'destroy', this).call(this);
    }
  }]);
  return TransportedSpeedControlled;
}(Transported);

// TransportedScheduled
// has to switch on and off the scheduled engines when the transport hits the engine's start and end position


var TransportedScheduled = function (_Transported3) {
  (0, _inherits3.default)(TransportedScheduled, _Transported3);

  function TransportedScheduled(transport, engine, startPosition, endPosition, offsetPosition) {
    (0, _classCallCheck3.default)(this, TransportedScheduled);

    // scheduling queue becomes master of engine
    var _this4 = (0, _possibleConstructorReturn3.default)(this, (TransportedScheduled.__proto__ || (0, _getPrototypeOf2.default)(TransportedScheduled)).call(this, transport, engine, startPosition, endPosition, offsetPosition));

    engine.master = null;
    transport.__schedulingQueue.add(engine, Infinity);
    return _this4;
  }

  (0, _createClass3.default)(TransportedScheduled, [{
    key: 'start',
    value: function start(time, position, speed) {
      this.master.__schedulingQueue.resetEngineTime(this.__engine, time);
    }
  }, {
    key: 'stop',
    value: function stop(time, position) {
      this.master.__schedulingQueue.resetEngineTime(this.__engine, Infinity);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.master.__schedulingQueue.remove(this.__engine);
      (0, _get3.default)(TransportedScheduled.prototype.__proto__ || (0, _getPrototypeOf2.default)(TransportedScheduled.prototype), 'destroy', this).call(this);
    }
  }]);
  return TransportedScheduled;
}(Transported);

// translates advancePosition of *transported* engines into global scheduler times


var TransportSchedulerHook = function (_TimeEngine2) {
  (0, _inherits3.default)(TransportSchedulerHook, _TimeEngine2);

  function TransportSchedulerHook(transport) {
    (0, _classCallCheck3.default)(this, TransportSchedulerHook);

    var _this5 = (0, _possibleConstructorReturn3.default)(this, (TransportSchedulerHook.__proto__ || (0, _getPrototypeOf2.default)(TransportSchedulerHook)).call(this));

    _this5.__transport = transport;

    _this5.__nextPosition = Infinity;
    _this5.__nextTime = Infinity;
    transport.__scheduler.add(_this5, Infinity);
    return _this5;
  }

  // TimeEngine method (scheduled interface)


  (0, _createClass3.default)(TransportSchedulerHook, [{
    key: 'advanceTime',
    value: function advanceTime(time) {
      var transport = this.__transport;
      var position = this.__nextPosition;
      var speed = transport.__speed;
      var nextPosition = transport.advancePosition(time, position, speed);
      var nextTime = transport.__getTimeAtPosition(nextPosition);

      this.__nextPosition = nextPosition;
      this.__nextTime = nextTime;

      return nextTime;
    }
  }, {
    key: 'resetPosition',
    value: function resetPosition() {
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.__nextPosition;

      var transport = this.__transport;
      var time = transport.__getTimeAtPosition(position);

      this.__nextPosition = position;
      this.__nextTime = time;

      this.resetTime(time);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.__transport.__scheduler.remove(this);
      this.__transport = null;
    }
  }]);
  return TransportSchedulerHook;
}(_TimeEngine5.default);

// internal scheduling queue that returns the current position (and time) of the transport


var TransportSchedulingQueue = function (_SchedulingQueue) {
  (0, _inherits3.default)(TransportSchedulingQueue, _SchedulingQueue);

  function TransportSchedulingQueue(transport) {
    (0, _classCallCheck3.default)(this, TransportSchedulingQueue);

    var _this6 = (0, _possibleConstructorReturn3.default)(this, (TransportSchedulingQueue.__proto__ || (0, _getPrototypeOf2.default)(TransportSchedulingQueue)).call(this));

    _this6.__transport = transport;
    transport.__scheduler.add(_this6, Infinity);
    return _this6;
  }

  (0, _createClass3.default)(TransportSchedulingQueue, [{
    key: 'destroy',
    value: function destroy() {
      this.__transport.__scheduler.remove(this);
      this.__transport = null;
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return this.__transport.currentTime;
    }
  }, {
    key: 'audioTime',
    get: function get() {
      return this.__transport.audioTime;
    }
  }, {
    key: 'currentPosition',
    get: function get() {
      return this.__transport.currentPosition;
    }
  }]);
  return TransportSchedulingQueue;
}(_SchedulingQueue3.default);

/**
 * Provides position-based scheduling of TimeEngine instances.
 *
 * [example]{@link https://rawgit.com/wavesjs/waves-masters/master/examples/transport/index.html}
 *
 *
 * @param {Object} scheduler - instance of Scheduler
 *
 * @example
 * import * as masters from 'waves-masters';
 *
 * const getTimeFunction = () => {
 *   const now = process.hrtime();
 *   return now[0] + now[1] * 1e-9;
 * }
 * const scheduler = new masters.Scheduler(getTimeFunction);
 * const transport = new masters.Transport(scheduler);
 * const playControl = new masters.PlayControl(scheduler, transport);
 * const myEngine = new MyEngine();
 * const yourEngine = new yourEngine();
 *
 * transport.add(myEngine);
 * transport.add(yourEngine);
 *
 * playControl.start();
 */


var Transport = function (_TimeEngine3) {
  (0, _inherits3.default)(Transport, _TimeEngine3);

  function Transport(scheduler) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, Transport);

    var _this7 = (0, _possibleConstructorReturn3.default)(this, (Transport.__proto__ || (0, _getPrototypeOf2.default)(Transport)).call(this));

    if (!scheduler) throw new Error('Invalid argument `scheduler`, should be an instance of `Scheduler`');

    _this7.__engines = [];
    _this7.__transported = [];

    _this7.__scheduler = scheduler;
    _this7.__schedulerHook = new TransportSchedulerHook(_this7);
    _this7.__transportedQueue = new _PriorityQueue2.default();
    _this7.__schedulingQueue = new TransportSchedulingQueue(_this7);

    // syncronized time, position, and speed
    _this7.__time = 0;
    _this7.__position = 0;
    _this7.__speed = 0;
    return _this7;
  }

  (0, _createClass3.default)(Transport, [{
    key: '__getTimeAtPosition',
    value: function __getTimeAtPosition(position) {
      if (this.__speed === 0) return +Infinity;else return this.__time + (position - this.__position) / this.__speed;
    }
  }, {
    key: '__getPositionAtTime',
    value: function __getPositionAtTime(time) {
      return this.__position + (time - this.__time) * this.__speed;
    }
  }, {
    key: '__syncTransportedPosition',
    value: function __syncTransportedPosition(time, position, speed) {
      var numTransportedEngines = this.__transported.length;
      var nextPosition = Infinity * speed;

      if (numTransportedEngines > 0) {
        this.__transportedQueue.clear();
        this.__transportedQueue.reverse = speed < 0;

        for (var i = 0; i < numTransportedEngines; i++) {
          var engine = this.__transported[i];
          var nextEnginePosition = engine.syncPosition(time, position, speed);
          this.__transportedQueue.insert(engine, nextEnginePosition);
        }

        nextPosition = this.__transportedQueue.time;
      }

      return nextPosition;
    }
  }, {
    key: '__syncTransportedSpeed',
    value: function __syncTransportedSpeed(time, position, speed) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this.__transported), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var transported = _step.value;

          transported.syncSpeed(time, position, speed);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Get current master time.
     *
     * @type {Number}
     * @name currentTime
     * @memberof Transport
     * @instance
     * @readonly
     */

  }, {
    key: 'resetPosition',


    /**
     * Reset next transport position
     *
     * @param {Number} next - transport position
     */
    value: function resetPosition(position) {
      var master = this.master;

      if (master && master.resetEnginePosition !== undefined) master.resetEnginePosition(this, position);else this.__schedulerHook.resetPosition(position);
    }

    /**
     * Implementation of the transported time engine interface.
     *
     * @param {Number} time
     * @param {Number} position
     * @param {Number} speed
     */

  }, {
    key: 'syncPosition',
    value: function syncPosition(time, position, speed) {
      this.__time = time;
      this.__position = position;
      this.__speed = speed;

      return this.__syncTransportedPosition(time, position, speed);
    }

    /**
     * Implementation of the transported time engine interface.
     *
     * @param {Number} time
     * @param {Number} position
     * @param {Number} speed
     */

  }, {
    key: 'advancePosition',
    value: function advancePosition(time, position, speed) {
      var engine = this.__transportedQueue.head;
      var nextEnginePosition = engine.advancePosition(time, position, speed);
      return this.__transportedQueue.move(engine, nextEnginePosition);
    }

    /**
     * Implementation of the transported time engine interface.
     *
     * @param {Number} time
     * @param {Number} position
     * @param {Number} speed
     * @param {Boolean} [seek=false]
     */

  }, {
    key: 'syncSpeed',
    value: function syncSpeed(time, position, speed) {
      var seek = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var lastSpeed = this.__speed;

      this.__time = time;
      this.__position = position;
      this.__speed = speed;

      if (speed !== lastSpeed || seek) {
        var nextPosition = void 0;

        // resync transported engines
        if (seek || speed * lastSpeed < 0) {
          // seek or reverse direction
          nextPosition = this.__syncTransportedPosition(time, position, speed);
        } else if (lastSpeed === 0) {
          // start
          nextPosition = this.__syncTransportedPosition(time, position, speed);
        } else if (speed === 0) {
          // stop
          nextPosition = Infinity;
          this.__syncTransportedPosition(time, position, speed);
        } else {
          // change speed without reversing direction
          this.__syncTransportedSpeed(time, position, speed);
        }

        this.resetPosition(nextPosition);
      }
    }

    /**
     * Add a time engine to the transport.
     *
     * @param {Object} engine - engine to be added to the transport
     * @param {Number} position - start position
     */

  }, {
    key: 'add',
    value: function add(engine) {
      var startPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var endPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
      var offsetPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      var transported = null;

      if (offsetPosition === -Infinity) offsetPosition = 0;

      if (engine.master) throw new Error("object has already been added to a master");

      if (_TimeEngine5.default.implementsTransported(engine)) transported = new TransportedTransported(this, engine, startPosition, endPosition, offsetPosition);else if (_TimeEngine5.default.implementsSpeedControlled(engine)) transported = new TransportedSpeedControlled(this, engine, startPosition, endPosition, offsetPosition);else if (_TimeEngine5.default.implementsScheduled(engine)) transported = new TransportedScheduled(this, engine, startPosition, endPosition, offsetPosition);else throw new Error("object cannot be added to a transport");

      if (transported) {
        var speed = this.__speed;

        addDuplet(this.__engines, this.__transported, engine, transported);

        if (speed !== 0) {
          // sync and start
          var nextEnginePosition = transported.syncPosition(this.currentTime, this.currentPosition, speed);
          var nextPosition = this.__transportedQueue.insert(transported, nextEnginePosition);

          this.resetPosition(nextPosition);
        }
      }

      return transported;
    }

    /**
     * Remove a time engine from the transport.
     *
     * @param {object} engineOrTransported - engine or transported to be removed from the transport
     */

  }, {
    key: 'remove',
    value: function remove(engineOrTransported) {
      var engine = engineOrTransported;
      var transported = removeDuplet(this.__engines, this.__transported, engineOrTransported);

      if (!transported) {
        engine = removeDuplet(this.__transported, this.__engines, engineOrTransported);
        transported = engineOrTransported;
      }

      if (engine && transported) {
        var nextPosition = this.__transportedQueue.remove(transported);

        transported.destroy();

        if (this.__speed !== 0) this.resetPosition(nextPosition);
      } else {
        throw new Error("object has not been added to this transport");
      }
    }

    /**
     * Reset position of the given engine.
     *
     * @param {TimeEngine} transported - Engine to reset
     * @param {Number} position - New position
     */

  }, {
    key: 'resetEnginePosition',
    value: function resetEnginePosition(transported) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      var speed = this.__speed;

      if (speed !== 0) {
        if (position === undefined) position = transported.syncPosition(this.currentTime, this.currentPosition, speed);

        var nextPosition = null;

        // the priority queue does not keep track of the elements that are
        // inserted at Infinity, so we need to reinsert transported engine in
        // this case.
        // @note - this could probably be more clean
        //       - probably the priority queue should keep these references
        if (!this.__transportedQueue.has(transported)) {
          nextPosition = this.__transportedQueue.insert(transported, position);
        } else {
          nextPosition = this.__transportedQueue.move(transported, position);
        }

        this.resetPosition(nextPosition);
      }
    }

    /**
     * Remove all time engines from the transport.
     */

  }, {
    key: 'clear',
    value: function clear() {
      this.syncSpeed(this.currentTime, this.currentPosition, 0);

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(this.__transported), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var transported = _step2.value;

          transported.destroy();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return this.__scheduler.currentTime;
    }

    /**
     * Get master audio time.
     *
     * @type {Number}
     * @name currentTime
     * @memberof Transport
     * @instance
     * @readonly
     */

  }, {
    key: 'audioTime',
    get: function get() {
      return this.__scheduler.audioTime;
    }

    /**
     * Get current master position. This getter will be replaced when the transport
     * is added to a master (i.e. transport or play-control).
     *
     * @type {Number}
     * @name currentPosition
     * @memberof Transport
     * @instance
     * @readonly
     */

  }, {
    key: 'currentPosition',
    get: function get() {
      var master = this.master;

      if (master && master.currentPosition !== undefined) return master.currentPosition;

      return this.__position + (this.__scheduler.currentTime - this.__time) * this.__speed;
    }
  }]);
  return Transport;
}(_TimeEngine5.default);

exports.default = Transport;

},{"../core/PriorityQueue":1,"../core/SchedulingQueue":2,"../core/TimeEngine":3,"babel-runtime/core-js/get-iterator":118,"babel-runtime/core-js/object/get-prototype-of":122,"babel-runtime/helpers/classCallCheck":127,"babel-runtime/helpers/createClass":128,"babel-runtime/helpers/get":129,"babel-runtime/helpers/inherits":130,"babel-runtime/helpers/possibleConstructorReturn":131}],9:[function(require,module,exports){
'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _wavesMasters = require('waves-masters');

var masters = _interopRequireWildcard(_wavesMasters);

var _basicControllers = require('@ircam/basic-controllers');

var controllers = _interopRequireWildcard(_basicControllers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

controllers.setTheme('dark');

var PositionDisplay = function (_masters$TimeEngine) {
  (0, _inherits3.default)(PositionDisplay, _masters$TimeEngine);

  function PositionDisplay($slider) {
    (0, _classCallCheck3.default)(this, PositionDisplay);

    var _this = (0, _possibleConstructorReturn3.default)(this, (PositionDisplay.__proto__ || (0, _getPrototypeOf2.default)(PositionDisplay)).call(this));

    _this.$slider = $slider;
    _this.period = 0.02;
    return _this;
  }

  (0, _createClass3.default)(PositionDisplay, [{
    key: 'syncPosition',
    value: function syncPosition(time, position, speed) {
      var nextPosition = Math.floor(position / this.period) * this.period;

      if (speed > 0 && nextPosition < position) nextPosition += this.period;else if (speed < 0 && nextPosition > position) nextPosition -= this.period;

      this.$slider.value = position.toFixed(2);

      return nextPosition;
    }
  }, {
    key: 'advancePosition',
    value: function advancePosition(time, position, speed) {
      this.$slider.value = position.toFixed(2);

      if (speed < 0) return position - this.period;else return position + this.period;
    }
  }]);
  return PositionDisplay;
}(masters.TimeEngine);

var getTimeFunction = function getTimeFunction() {
  return performance.now() / 1000;
};
var scheduler = new masters.Scheduler(getTimeFunction);
var transport = new masters.Transport(scheduler);
var playControl = new masters.PlayControl(scheduler, transport);

var $slider = new controllers.Slider({
  label: 'position',
  min: 0,
  max: 10,
  step: 0.01,
  default: 0,
  size: 'large',
  container: '.controllers',
  callback: function callback(value) {
    return playControl.seek(value);
  }
});

new controllers.SelectButtons({
  label: '&nbsp;',
  options: ['start', 'pause', 'stop'],
  default: 'stop',
  container: '.controllers',
  callback: function callback(value) {
    return playControl[value]();
  }
});

new controllers.Slider({
  label: 'speed',
  min: -1,
  max: 1,
  default: 1,
  size: 'large',
  container: '.controllers',
  callback: function callback(value) {
    return playControl.speed = value;
  }
});

var positionDisplay = new PositionDisplay($slider);
transport.add(positionDisplay);

playControl.setLoopBoundaries(0, 10);
playControl.loop = true;

},{"@ircam/basic-controllers":22,"babel-runtime/core-js/object/get-prototype-of":34,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39,"babel-runtime/helpers/inherits":40,"babel-runtime/helpers/possibleConstructorReturn":41,"waves-masters":4}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @module basic-controller */

var typeCounters = {};

/**
 * Base class to create new controllers.
 *
 * @param {String} type - String describing the type of the controller.
 * @param {Object} defaults - Default parameters of the controller.
 * @param {Object} config - User defined configuration options.
 */

var BaseComponent = function () {
  function BaseComponent(type, defaults) {
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, BaseComponent);

    this.type = type;
    this.params = Object.assign({}, defaults, config);

    // handle id
    if (!typeCounters[type]) typeCounters[type] = 0;

    if (!this.params.id) {
      this.id = type + "-" + typeCounters[type];
      typeCounters[type] += 1;
    } else {
      this.id = this.params.id;
    }

    this._listeners = new Set();
    this._groupListeners = new Set();

    // register callback if given
    if (this.params.callback) this.addListener(this.params.callback);
  }

  /**
   * Add a listener to the controller.
   *
   * @param {Function} callback - Function to be applied when the controller
   *  state change.
   */


  _createClass(BaseComponent, [{
    key: "addListener",
    value: function addListener(callback) {
      this._listeners.add(callback);
    }

    /**
     * Called when a listener is added from a containing group.
     * @private
     */

  }, {
    key: "_addGroupListener",
    value: function _addGroupListener(id, callId, callback) {
      if (!callId) this.addListener(callback);else {
        this._groupListeners.add({ callId: callId, callback: callback });
      }
    }

    /**
     * Remove a listener from the controller.
     *
     * @param {Function} callback - Function to remove from the listeners.
     * @private
     * @todo - reexpose when `container` can override this method...
     */
    // removeListener(callback) {
    //   this._listeners.remove(callback);
    // }

    /** @private */

  }, {
    key: "executeListeners",
    value: function executeListeners() {
      for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
        values[_key] = arguments[_key];
      }

      this._listeners.forEach(function (callback) {
        return callback.apply(undefined, values);
      });

      this._groupListeners.forEach(function (payload) {
        var callback = payload.callback,
            callId = payload.callId;

        callback.apply(undefined, [callId].concat(values));
      });
    }
  }]);

  return BaseComponent;
}();

exports.default = BaseComponent;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BaseComponent = require('./BaseComponent');

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

var _display2 = require('../mixins/display');

var _display3 = _interopRequireDefault(_display2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AudioContext = window.AudioContext || window.webkitAudioContext;

/** @module basic-controllers */

var defaults = {
  label: 'Drag and drop audio files',
  labelProcess: 'process...',
  audioContext: null,
  container: null,
  callback: null
};

/**
 * Drag and drop zone for audio files returning `AudioBuffer`s and/or JSON
 * descriptor data.
 *
 * @param {Object} config - Override default parameters.
 * @param {String} [config.label='Drag and drop audio files'] - Label of the
 *  controller.
 * @param {String} [config.labelProcess='process...'] - Label of the controller
 *  while audio files are decoded.
 * @param {AudioContext} [config.audioContext=null] - Optionnal audio context
 *  to use in order to decode audio files.
 * @param {String|Element|basic-controller~Group} [config.container=null] -
 *  Container of the controller.
 * @param {Function} [config.callback=null] - Callback to be executed when the
 *  value changes.
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * const dragAndDrop = new controllers.DragAndDrop({
 *   container: '#container',
 *   callback: (results) => console.log(results),
 * });
 */

var DragAndDrop = function (_display) {
  _inherits(DragAndDrop, _display);

  function DragAndDrop(options) {
    _classCallCheck(this, DragAndDrop);

    var _this = _possibleConstructorReturn(this, (DragAndDrop.__proto__ || Object.getPrototypeOf(DragAndDrop)).call(this, 'drag-and-drop', defaults, options));

    _this._value = null;

    if (!_this.params.audioContext) _this.params.audioContext = new AudioContext();

    _get(DragAndDrop.prototype.__proto__ || Object.getPrototypeOf(DragAndDrop.prototype), 'initialize', _this).call(_this);
    return _this;
  }

  /**
   * Get the last results
   * @type {Object<String, AudioBuffer|JSON>}
   * @readonly
   */


  _createClass(DragAndDrop, [{
    key: 'render',
    value: function render() {
      var label = this.params.label;

      var content = '\n      <div class="drop-zone">\n        <p class="label">' + label + '</p>\n      </div>\n    ';

      this.$el = _get(DragAndDrop.prototype.__proto__ || Object.getPrototypeOf(DragAndDrop.prototype), 'render', this).call(this);
      this.$el.innerHTML = content;
      this.$dropZone = this.$el.querySelector('.drop-zone');
      this.$label = this.$el.querySelector('.label');

      this._bindEvents();

      return this.$el;
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      this.$dropZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();

        _this2.$dropZone.classList.add('drag');
        e.dataTransfer.dropEffect = 'copy';
      }, false);

      this.$dropZone.addEventListener('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();

        _this2.$dropZone.classList.remove('drag');
      }, false);

      this.$dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var files = Array.from(e.dataTransfer.files);
        var audioFiles = files.filter(function (file) {
          if (/^audio/.test(file.type)) {
            file.shortType = 'audio';
            return true;
          } else if (/json$/.test(file.type)) {
            file.shortType = 'json';
            return true;
          }

          return false;
        });

        var results = {};
        var counter = 0;

        _this2.$label.textContent = _this2.params.labelProcess;

        var testEnd = function testEnd() {
          counter += 1;

          if (counter === audioFiles.length) {
            _this2._value = results;
            _this2.executeListeners(results);

            _this2.$dropZone.classList.remove('drag');
            _this2.$label.textContent = _this2.params.label;
          }
        };

        files.forEach(function (file, index) {
          var reader = new FileReader();

          reader.onload = function (e) {
            if (file.shortType === 'json') {
              results[file.name] = JSON.parse(e.target.result);
              testEnd();
            } else if (file.shortType === 'audio') {
              _this2.params.audioContext.decodeAudioData(e.target.result).then(function (audioBuffer) {
                results[file.name] = audioBuffer;
                testEnd();
              }).catch(function (err) {
                results[file.name] = null;
                testEnd();
              });
            }
          };

          if (file.shortType === 'json') reader.readAsText(file);else if (file.shortType === 'audio') reader.readAsArrayBuffer(file);
        });
      }, false);
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    }
  }]);

  return DragAndDrop;
}((0, _display3.default)(_BaseComponent2.default));

exports.default = DragAndDrop;

},{"../mixins/display":24,"./BaseComponent":10}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BaseComponent = require('./BaseComponent');

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

var _display = require('../mixins/display');

var _display2 = _interopRequireDefault(_display);

var _container2 = require('../mixins/container');

var _container3 = _interopRequireDefault(_container2);

var _elements = require('../utils/elements');

var elements = _interopRequireWildcard(_elements);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @module basic-controllers */

var defaults = {
  legend: '&nbsp;',
  default: 'opened',
  container: null
};

/**
 * Group of controllers.
 *
 * @param {Object} config - Override default parameters.
 * @param {String} config.label - Label of the group.
 * @param {'opened'|'closed'} [config.default='opened'] - Default state of the
 *  group.
 * @param {String|Element|basic-controller~Group} [config.container=null] -
 *  Container of the controller.
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * // create a group
 * const group = new controllers.Group({
 *   label: 'Group',
 *   default: 'opened',
 *   container: '#container'
 * });
 *
 * // insert controllers in the group
 * const groupSlider = new controllers.Slider({
 *   label: 'Group Slider',
 *   min: 20,
 *   max: 1000,
 *   step: 1,
 *   default: 200,
 *   unit: 'Hz',
 *   size: 'large',
 *   container: group,
 *   callback: (value) => console.log(value),
 * });
 *
 * const groupText = new controllers.Text({
 *   label: 'Group Text',
 *   default: 'text input',
 *   readonly: false,
 *   container: group,
 *   callback: (value) => console.log(value),
 * });
 */

var Group = function (_container) {
  _inherits(Group, _container);

  function Group(config) {
    _classCallCheck(this, Group);

    var _this = _possibleConstructorReturn(this, (Group.__proto__ || Object.getPrototypeOf(Group)).call(this, 'group', defaults, config));

    _this._states = ['opened', 'closed'];

    if (_this._states.indexOf(_this.params.default) === -1) throw new Error('Invalid state "' + value + '"');

    _this._state = _this.params.default;

    _get(Group.prototype.__proto__ || Object.getPrototypeOf(Group.prototype), 'initialize', _this).call(_this);
    return _this;
  }

  /**
   * State of the group (`'opened'` or `'closed'`).
   * @type {String}
   */


  _createClass(Group, [{
    key: 'render',


    /** @private */
    value: function render() {
      var content = '\n      <div class="group-header">\n        ' + elements.smallArrowRight + '\n        ' + elements.smallArrowBottom + '\n        <span class="label">' + this.params.label + '</span>\n      </div>\n      <div class="group-content"></div>\n    ';

      this.$el = _get(Group.prototype.__proto__ || Object.getPrototypeOf(Group.prototype), 'render', this).call(this);
      this.$el.innerHTML = content;
      this.$el.classList.add(this._state);

      this.$header = this.$el.querySelector('.group-header');
      this.$container = this.$el.querySelector('.group-content');

      this._bindEvents();

      return this.$el;
    }

    /** @private */

  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      this.$header.addEventListener('click', function () {
        var state = _this2._state === 'closed' ? 'opened' : 'closed';
        _this2.state = state;
      });
    }
  }, {
    key: 'value',
    get: function get() {
      return this.state;
    },
    set: function set(state) {
      this.state = state;
    }

    /**
     * Alias for `value`.
     * @type {String}
     */

  }, {
    key: 'state',
    get: function get() {
      return this._state;
    },
    set: function set(value) {
      if (this._states.indexOf(value) === -1) throw new Error('Invalid state "' + value + '"');

      this.$el.classList.remove(this._state);
      this.$el.classList.add(value);

      this._state = value;
    }
  }]);

  return Group;
}((0, _container3.default)((0, _display2.default)(_BaseComponent2.default)));

exports.default = Group;

},{"../mixins/container":23,"../mixins/display":24,"../utils/elements":25,"./BaseComponent":10}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BaseComponent = require('./BaseComponent');

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

var _display2 = require('../mixins/display');

var _display3 = _interopRequireDefault(_display2);

var _elements = require('../utils/elements');

var elements = _interopRequireWildcard(_elements);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @module basic-controllers */

var defaults = {
  label: '&nbsp;',
  min: 0,
  max: 1,
  step: 0.01,
  default: 0,
  container: null,
  callback: null
};

/**
 * Number Box controller
 *
 * @param {Object} config - Override default parameters.
 * @param {String} config.label - Label of the controller.
 * @param {Number} [config.min=0] - Minimum value.
 * @param {Number} [config.max=1] - Maximum value.
 * @param {Number} [config.step=0.01] - Step between consecutive values.
 * @param {Number} [config.default=0] - Default value.
 * @param {String|Element|basic-controller~Group} [config.container=null] -
 *  Container of the controller.
 * @param {Function} [config.callback=null] - Callback to be executed when the
 *  value changes.
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * const numberBox = new controllers.NumberBox({
 *   label: 'My Number Box',
 *   min: 0,
 *   max: 10,
 *   step: 0.1,
 *   default: 5,
 *   container: '#container',
 *   callback: (value) => console.log(value),
 * });
 */

var NumberBox = function (_display) {
  _inherits(NumberBox, _display);

  // legend, min = 0, max = 1, step = 0.01, defaultValue = 0, $container = null, callback = null
  function NumberBox(config) {
    _classCallCheck(this, NumberBox);

    var _this = _possibleConstructorReturn(this, (NumberBox.__proto__ || Object.getPrototypeOf(NumberBox)).call(this, 'number-box', defaults, config));

    _this._value = _this.params.default;
    _this._isIntStep = _this.params.step % 1 === 0;

    _get(NumberBox.prototype.__proto__ || Object.getPrototypeOf(NumberBox.prototype), 'initialize', _this).call(_this);
    return _this;
  }

  /**
   * Current value of the controller.
   *
   * @type {Number}
   */


  _createClass(NumberBox, [{
    key: 'render',


    /** @private */
    value: function render() {
      var _params = this.params,
          label = _params.label,
          min = _params.min,
          max = _params.max,
          step = _params.step;

      var content = '\n      <span class="label">' + label + '</span>\n      <div class="inner-wrapper">\n        ' + elements.arrowLeft + '\n        <input class="number" type="number" min="' + min + '" max="' + max + '" step="' + step + '" value="' + this._value + '" />\n        ' + elements.arrowRight + '\n      </div>\n    ';

      this.$el = _get(NumberBox.prototype.__proto__ || Object.getPrototypeOf(NumberBox.prototype), 'render', this).call(this);
      this.$el.classList.add('align-small');
      this.$el.innerHTML = content;

      this.$prev = this.$el.querySelector('.arrow-left');
      this.$next = this.$el.querySelector('.arrow-right');
      this.$number = this.$el.querySelector('input[type="number"]');

      this._bindEvents();

      return this.$el;
    }

    /** @private */

  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      this.$prev.addEventListener('click', function (e) {
        var step = _this2.params.step;
        var decimals = step.toString().split('.')[1];
        var exp = decimals ? decimals.length : 0;
        var mult = Math.pow(10, exp);

        var intValue = Math.floor(_this2._value * mult + 0.5);
        var intStep = Math.floor(step * mult + 0.5);
        var value = (intValue - intStep) / mult;

        _this2._propagate(value);
      }, false);

      this.$next.addEventListener('click', function (e) {
        var step = _this2.params.step;
        var decimals = step.toString().split('.')[1];
        var exp = decimals ? decimals.length : 0;
        var mult = Math.pow(10, exp);

        var intValue = Math.floor(_this2._value * mult + 0.5);
        var intStep = Math.floor(step * mult + 0.5);
        var value = (intValue + intStep) / mult;

        _this2._propagate(value);
      }, false);

      this.$number.addEventListener('change', function (e) {
        var value = _this2.$number.value;
        value = _this2._isIntStep ? parseInt(value, 10) : parseFloat(value);
        value = Math.min(_this2.params.max, Math.max(_this2.params.min, value));

        _this2._propagate(value);
      }, false);
    }

    /** @private */

  }, {
    key: '_propagate',
    value: function _propagate(value) {
      if (value === this._value) {
        return;
      }

      this._value = value;
      this.$number.value = value;

      this.executeListeners(this._value);
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    },
    set: function set(value) {
      // use $number element min, max and step system
      this.$number.value = value;
      value = this.$number.value;
      value = this._isIntStep ? parseInt(value, 10) : parseFloat(value);
      this._value = value;
    }
  }]);

  return NumberBox;
}((0, _display3.default)(_BaseComponent2.default));

exports.default = NumberBox;

},{"../mixins/display":24,"../utils/elements":25,"./BaseComponent":10}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BaseComponent = require('./BaseComponent');

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

var _display2 = require('../mixins/display');

var _display3 = _interopRequireDefault(_display2);

var _elements = require('../utils/elements');

var elements = _interopRequireWildcard(_elements);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @module basic-controllers */

var defaults = {
  label: '&nbsp;',
  options: null,
  default: null,
  container: null,
  callback: null
};

/**
 * List of buttons with state.
 *
 * @param {Object} config - Override default parameters.
 * @param {String} config.label - Label of the controller.
 * @param {Array} [config.options=null] - Values of the drop down list.
 * @param {Number} [config.default=null] - Default value.
 * @param {String|Element|basic-controller~Group} [config.container=null] -
 *  Container of the controller.
 * @param {Function} [config.callback=null] - Callback to be executed when the
 *  value changes.
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * const selectButtons = new controllers.SelectButtons({
 *   label: 'SelectButtons',
 *   options: ['standby', 'run', 'end'],
 *   default: 'run',
 *   container: '#container',
 *   callback: (value, index) => console.log(value, index),
 * });
 */

var SelectButtons = function (_display) {
  _inherits(SelectButtons, _display);

  function SelectButtons(config) {
    _classCallCheck(this, SelectButtons);

    var _this = _possibleConstructorReturn(this, (SelectButtons.__proto__ || Object.getPrototypeOf(SelectButtons)).call(this, 'select-buttons', defaults, config));

    if (!Array.isArray(_this.params.options)) throw new Error('TriggerButton: Invalid option "options"');

    _this._value = _this.params.default;

    var options = _this.params.options;
    var index = options.indexOf(_this._value);
    _this._index = index === -1 ? 0 : index;
    _this._maxIndex = options.length - 1;

    _get(SelectButtons.prototype.__proto__ || Object.getPrototypeOf(SelectButtons.prototype), 'initialize', _this).call(_this);
    return _this;
  }

  /**
   * Current value.
   * @type {String}
   */


  _createClass(SelectButtons, [{
    key: 'render',


    /** @private */
    value: function render() {
      var _params = this.params,
          options = _params.options,
          label = _params.label;

      var content = '\n      <span class="label">' + label + '</span>\n      <div class="inner-wrapper">\n        ' + elements.arrowLeft + '\n        ' + options.map(function (option, index) {
        return '\n            <button class="btn" data-index="' + index + '" data-value="' + option + '">\n              ' + option + '\n            </button>';
      }).join('') + '\n        ' + elements.arrowRight + '\n      </div>\n    ';

      this.$el = _get(SelectButtons.prototype.__proto__ || Object.getPrototypeOf(SelectButtons.prototype), 'render', this).call(this, this.type);
      this.$el.innerHTML = content;

      this.$prev = this.$el.querySelector('.arrow-left');
      this.$next = this.$el.querySelector('.arrow-right');
      this.$btns = Array.from(this.$el.querySelectorAll('.btn'));

      this._highlightBtn(this._index);
      this._bindEvents();

      return this.$el;
    }

    /** @private */

  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      this.$prev.addEventListener('click', function () {
        var index = _this2._index - 1;
        _this2._propagate(index);
      });

      this.$next.addEventListener('click', function () {
        var index = _this2._index + 1;
        _this2._propagate(index);
      });

      this.$btns.forEach(function ($btn, index) {
        $btn.addEventListener('click', function (e) {
          e.preventDefault();
          _this2._propagate(index);
        });
      });
    }

    /** @private */

  }, {
    key: '_propagate',
    value: function _propagate(index) {
      if (index < 0 || index > this._maxIndex) return;

      this._index = index;
      this._value = this.params.options[index];
      this._highlightBtn(this._index);

      this.executeListeners(this._value, this._index);
    }

    /** @private */

  }, {
    key: '_highlightBtn',
    value: function _highlightBtn(activeIndex) {
      this.$btns.forEach(function ($btn, index) {
        $btn.classList.remove('active');

        if (activeIndex === index) {
          $btn.classList.add('active');
        }
      });
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    },
    set: function set(value) {
      var index = this.params.options.indexOf(value);

      if (index !== -1) this.index = index;
    }

    /**
     * Current option index.
     * @type {Number}
     */

  }, {
    key: 'index',
    get: function get() {
      this._index;
    },
    set: function set(index) {
      if (index < 0 || index > this._maxIndex) return;

      this._value = this.params.options[index];
      this._index = index;
      this._highlightBtn(this._index);
    }
  }]);

  return SelectButtons;
}((0, _display3.default)(_BaseComponent2.default));

exports.default = SelectButtons;

},{"../mixins/display":24,"../utils/elements":25,"./BaseComponent":10}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BaseComponent = require('./BaseComponent');

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

var _display2 = require('../mixins/display');

var _display3 = _interopRequireDefault(_display2);

var _elements = require('../utils/elements');

var elements = _interopRequireWildcard(_elements);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @module basic-controllers */

var defaults = {
  label: '&nbsp;',
  options: null,
  default: null,
  container: null,
  callback: null

  /**
   * Drop-down list controller.
   *
   * @param {Object} config - Override default parameters.
   * @param {String} config.label - Label of the controller.
   * @param {Array} [config.options=null] - Values of the drop down list.
   * @param {Number} [config.default=null] - Default value.
   * @param {String|Element|basic-controller~Group} [config.container=null] -
   *  Container of the controller.
   * @param {Function} [config.callback=null] - Callback to be executed when the
   *  value changes.
   *
   * @example
   * import * as controllers from 'basic-controllers';
   *
   * const selectList = new controllers.SelectList({
   *   label: 'SelectList',
   *   options: ['standby', 'run', 'end'],
   *   default: 'run',
   *   container: '#container',
   *   callback: (value, index) => console.log(value, index),
   * });
   */
};
var SelectList = function (_display) {
  _inherits(SelectList, _display);

  function SelectList(config) {
    _classCallCheck(this, SelectList);

    var _this = _possibleConstructorReturn(this, (SelectList.__proto__ || Object.getPrototypeOf(SelectList)).call(this, 'select-list', defaults, config));

    if (!Array.isArray(_this.params.options)) throw new Error('TriggerButton: Invalid option "options"');

    _this._value = _this.params.default;

    var options = _this.params.options;
    var index = options.indexOf(_this._value);
    _this._index = index === -1 ? 0 : index;
    _this._maxIndex = options.length - 1;

    _get(SelectList.prototype.__proto__ || Object.getPrototypeOf(SelectList.prototype), 'initialize', _this).call(_this);
    return _this;
  }

  /**
   * Current value.
   * @type {String}
   */


  _createClass(SelectList, [{
    key: 'render',


    /** @private */
    value: function render() {
      var _params = this.params,
          label = _params.label,
          options = _params.options;

      var content = '\n      <span class="label">' + label + '</span>\n      <div class="inner-wrapper">\n        ' + elements.arrowLeft + '\n        <select>\n        ' + options.map(function (option, index) {
        return '<option value="' + option + '">' + option + '</option>';
      }).join('') + '\n        <select>\n        ' + elements.arrowRight + '\n      </div>\n    ';

      this.$el = _get(SelectList.prototype.__proto__ || Object.getPrototypeOf(SelectList.prototype), 'render', this).call(this, this.type);
      this.$el.classList.add('align-small');
      this.$el.innerHTML = content;

      this.$prev = this.$el.querySelector('.arrow-left');
      this.$next = this.$el.querySelector('.arrow-right');
      this.$select = this.$el.querySelector('select');
      // set to default value
      this.$select.value = options[this._index];
      this._bindEvents();

      return this.$el;
    }

    /** @private */

  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      this.$prev.addEventListener('click', function () {
        var index = _this2._index - 1;
        _this2._propagate(index);
      }, false);

      this.$next.addEventListener('click', function () {
        var index = _this2._index + 1;
        _this2._propagate(index);
      }, false);

      this.$select.addEventListener('change', function () {
        var value = _this2.$select.value;
        var index = _this2.params.options.indexOf(value);
        _this2._propagate(index);
      });
    }

    /** @private */

  }, {
    key: '_propagate',
    value: function _propagate(index) {
      if (index < 0 || index > this._maxIndex) return;

      var value = this.params.options[index];
      this._index = index;
      this._value = value;
      this.$select.value = value;

      this.executeListeners(this._value, this._index);
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    },
    set: function set(value) {
      this.$select.value = value;
      this._value = value;
      this._index = this.params.options.indexOf(value);
    }

    /**
     * Current option index.
     * @type {Number}
     */

  }, {
    key: 'index',
    get: function get() {
      return this._index;
    },
    set: function set(index) {
      if (index < 0 || index > this._maxIndex) return;
      this.value = this.params.options[index];
    }
  }]);

  return SelectList;
}((0, _display3.default)(_BaseComponent2.default));

exports.default = SelectList;

},{"../mixins/display":24,"../utils/elements":25,"./BaseComponent":10}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BaseComponent = require('./BaseComponent');

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

var _display2 = require('../mixins/display');

var _display3 = _interopRequireDefault(_display2);

var _guiComponents = require('@ircam/gui-components');

var guiComponents = _interopRequireWildcard(_guiComponents);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @module basic-controllers */

var defaults = {
  label: '&nbsp;',
  min: 0,
  max: 1,
  step: 0.01,
  default: 0,
  unit: '',
  size: 'medium',
  container: null,
  callback: null

  /**
   * Slider controller.
   *
   * @param {Object} config - Override default parameters.
   * @param {String} config.label - Label of the controller.
   * @param {Number} [config.min=0] - Minimum value.
   * @param {Number} [config.max=1] - Maximum value.
   * @param {Number} [config.step=0.01] - Step between consecutive values.
   * @param {Number} [config.default=0] - Default value.
   * @param {String} [config.unit=''] - Unit of the value.
   * @param {'small'|'medium'|'large'} [config.size='medium'] - Size of the
   *  slider.
   * @param {String|Element|basic-controller~Group} [config.container=null] -
   *  Container of the controller.
   * @param {Function} [config.callback=null] - Callback to be executed when the
   *  value changes.
   *
   * @example
   * import * as controllers from 'basic-controllers';
   *
   * const slider = new controllers.Slider({
   *   label: 'My Slider',
   *   min: 20,
   *   max: 1000,
   *   step: 1,
   *   default: 537,
   *   unit: 'Hz',
   *   size: 'large',
   *   container: '#container',
   *   callback: (value) => console.log(value),
   * });
   */
};
var Slider = function (_display) {
  _inherits(Slider, _display);

  function Slider(config) {
    _classCallCheck(this, Slider);

    var _this = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this, 'slider', defaults, config));

    _this._value = _this.params.default;
    _this._onSliderChange = _this._onSliderChange.bind(_this);

    _get(Slider.prototype.__proto__ || Object.getPrototypeOf(Slider.prototype), 'initialize', _this).call(_this);
    return _this;
  }

  /**
   * Current value.
   * @type {Number}
   */


  _createClass(Slider, [{
    key: 'render',


    /** @private */
    value: function render() {
      var _params = this.params,
          label = _params.label,
          min = _params.min,
          max = _params.max,
          step = _params.step,
          unit = _params.unit,
          size = _params.size;

      var content = '\n      <span class="label">' + label + '</span>\n      <div class="inner-wrapper">\n        <div class="range"></div>\n        <div class="number-wrapper">\n          <input type="number" class="number" min="' + min + '" max="' + max + '" step="' + step + '" value="' + this._value + '" />\n          <span class="unit">' + unit + '</span>\n        </div>\n      </div>';

      this.$el = _get(Slider.prototype.__proto__ || Object.getPrototypeOf(Slider.prototype), 'render', this).call(this, this.type);
      this.$el.innerHTML = content;
      this.$el.classList.add('slider-' + size);

      this.$range = this.$el.querySelector('.range');
      this.$number = this.$el.querySelector('input[type="number"]');

      this.slider = new guiComponents.Slider({
        container: this.$range,
        callback: this._onSliderChange,
        min: min,
        max: max,
        step: step,
        default: this._value,
        foregroundColor: '#ababab'
      });

      this._bindEvents();

      return this.$el;
    }

    /** @private */

  }, {
    key: 'resize',
    value: function resize() {
      _get(Slider.prototype.__proto__ || Object.getPrototypeOf(Slider.prototype), 'resize', this).call(this);

      var _$range$getBoundingCl = this.$range.getBoundingClientRect(),
          width = _$range$getBoundingCl.width,
          height = _$range$getBoundingCl.height;

      this.slider.resize(width, height);
    }

    /** @private */

  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      this.$number.addEventListener('change', function () {
        var value = parseFloat(_this2.$number.value);
        // the slider propagates the value
        _this2.slider.value = value;
        _this2._value = value;

        _this2.executeListeners(_this2._value);
      }, false);
    }

    /** @private */

  }, {
    key: '_onSliderChange',
    value: function _onSliderChange(value) {
      this.$number.value = value;
      this._value = value;

      this.executeListeners(this._value);
    }
  }, {
    key: 'value',
    set: function set(value) {
      this._value = value;

      if (this.$number && this.$range) {
        this.$number.value = this.value;
        this.slider.value = this.value;
      }
    },
    get: function get() {
      return this._value;
    }
  }]);

  return Slider;
}((0, _display3.default)(_BaseComponent2.default));

exports.default = Slider;

},{"../mixins/display":24,"./BaseComponent":10,"@ircam/gui-components":31}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BaseComponent = require('./BaseComponent');

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

var _display2 = require('../mixins/display');

var _display3 = _interopRequireDefault(_display2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @module basic-controllers */

var defaults = {
  label: '&nbsp;',
  default: '',
  readonly: false,
  container: null,
  callback: null

  /**
   * Text controller.
   *
   * @param {Object} config - Override default parameters.
   * @param {String} config.label - Label of the controller.
   * @param {Array} [config.default=''] - Default value of the controller.
   * @param {Array} [config.readonly=false] - Define if the controller is readonly.
   * @param {String|Element|basic-controller~Group} [config.container=null] -
   *  Container of the controller.
   * @param {Function} [config.callback=null] - Callback to be executed when the
   *  value changes.
   *
   * @example
   * import * as controllers from 'basic-contollers';
   *
   * const text = new controllers.Text({
   *   label: 'My Text',
   *   default: 'default value',
   *   readonly: false,
   *   container: '#container',
   *   callback: (value) => console.log(value),
   * });
   */
};
var Text = function (_display) {
  _inherits(Text, _display);

  function Text(config) {
    _classCallCheck(this, Text);

    var _this = _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, 'text', defaults, config));

    _this._value = _this.params.default;
    _this.initialize();
    return _this;
  }

  /**
   * Current value.
   * @type {String}
   */


  _createClass(Text, [{
    key: 'render',


    /** @private */
    value: function render() {
      var readonly = this.params.readonly ? 'readonly' : '';
      var content = '\n      <span class="label">' + this.params.label + '</span>\n      <div class="inner-wrapper">\n        <input class="text" type="text" value="' + this._value + '" ' + readonly + ' />\n      </div>\n    ';

      this.$el = _get(Text.prototype.__proto__ || Object.getPrototypeOf(Text.prototype), 'render', this).call(this);
      this.$el.innerHTML = content;
      this.$input = this.$el.querySelector('.text');

      this.bindEvents();
      return this.$el;
    }

    /** @private */

  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this2 = this;

      this.$input.addEventListener('keyup', function () {
        _this2._value = _this2.$input.value;
        _this2.executeListeners(_this2._value);
      }, false);
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    },
    set: function set(value) {
      this.$input.value = value;
      this._value = value;
    }
  }]);

  return Text;
}((0, _display3.default)(_BaseComponent2.default));

exports.default = Text;

},{"../mixins/display":24,"./BaseComponent":10}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BaseComponent = require('./BaseComponent');

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

var _display2 = require('../mixins/display');

var _display3 = _interopRequireDefault(_display2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @module basic-controllers */

var defaults = {
  label: '&nbsp;',
  container: null
};

/**
 * Title.
 *
 * @param {Object} config - Override default parameters.
 * @param {String} config.label - Label of the controller.
 * @param {String|Element|basic-controller~Group} [config.container=null] -
 *  Container of the controller.
 *
 * @example
 * import * as controller from 'basic-controllers';
 *
 * const title = new controllers.Title({
 *   label: 'My Title',
 *   container: '#container'
 * });
 */

var Title = function (_display) {
  _inherits(Title, _display);

  function Title(config) {
    _classCallCheck(this, Title);

    var _this = _possibleConstructorReturn(this, (Title.__proto__ || Object.getPrototypeOf(Title)).call(this, 'title', defaults, config));

    _get(Title.prototype.__proto__ || Object.getPrototypeOf(Title.prototype), 'initialize', _this).call(_this);
    return _this;
  }

  /** @private */


  _createClass(Title, [{
    key: 'render',
    value: function render() {
      var content = '<span class="label">' + this.params.label + '</span>';

      this.$el = _get(Title.prototype.__proto__ || Object.getPrototypeOf(Title.prototype), 'render', this).call(this);
      this.$el.innerHTML = content;

      return this.$el;
    }
  }]);

  return Title;
}((0, _display3.default)(_BaseComponent2.default));

exports.default = Title;

},{"../mixins/display":24,"./BaseComponent":10}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BaseComponent = require('./BaseComponent');

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

var _display2 = require('../mixins/display');

var _display3 = _interopRequireDefault(_display2);

var _elements = require('../utils/elements');

var elements = _interopRequireWildcard(_elements);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @module basic-controllers */

var defaults = {
  label: '&bnsp;',
  active: false,
  container: null,
  callback: null
};

/**
 * On/Off controller.
 *
 * @param {Object} config - Override default parameters.
 * @param {String} config.label - Label of the controller.
 * @param {Array} [config.active=false] - Default state of the toggle.
 * @param {String|Element|basic-controller~Group} [config.container=null] -
 *  Container of the controller.
 * @param {Function} [config.callback=null] - Callback to be executed when the
 *  value changes.
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * const toggle = new controllers.Toggle({
 *   label: 'My Toggle',
 *   active: false,
 *   container: '#container',
 *   callback: (active) => console.log(active),
 * });
 */

var Toggle = function (_display) {
  _inherits(Toggle, _display);

  function Toggle(config) {
    _classCallCheck(this, Toggle);

    var _this = _possibleConstructorReturn(this, (Toggle.__proto__ || Object.getPrototypeOf(Toggle)).call(this, 'toggle', defaults, config));

    _this._active = _this.params.active;

    _get(Toggle.prototype.__proto__ || Object.getPrototypeOf(Toggle.prototype), 'initialize', _this).call(_this);
    return _this;
  }

  /**
   * Value of the toggle
   * @type {Boolean}
   */


  _createClass(Toggle, [{
    key: '_updateBtn',


    /** @private */
    value: function _updateBtn() {
      var method = this.active ? 'add' : 'remove';
      this.$toggle.classList[method]('active');
    }

    /** @private */

  }, {
    key: 'render',
    value: function render() {
      var content = '\n      <span class="label">' + this.params.label + '</span>\n      <div class="inner-wrapper">\n        ' + elements.toggle + '\n      </div>';

      this.$el = _get(Toggle.prototype.__proto__ || Object.getPrototypeOf(Toggle.prototype), 'render', this).call(this);
      this.$el.classList.add('align-small');
      this.$el.innerHTML = content;

      this.$toggle = this.$el.querySelector('.toggle-element');
      // initialize state
      this.active = this._active;
      this.bindEvents();

      return this.$el;
    }

    /** @private */

  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this2 = this;

      this.$toggle.addEventListener('click', function (e) {
        e.preventDefault();

        _this2.active = !_this2.active;
        _this2.executeListeners(_this2._active);
      });
    }
  }, {
    key: 'value',
    set: function set(bool) {
      this.active = bool;
    },
    get: function get() {
      return this._active;
    }

    /**
     * Alias for `value`.
     * @type {Boolean}
     */

  }, {
    key: 'active',
    set: function set(bool) {
      this._active = bool;
      this._updateBtn();
    },
    get: function get() {
      return this._active;
    }
  }]);

  return Toggle;
}((0, _display3.default)(_BaseComponent2.default));

exports.default = Toggle;

},{"../mixins/display":24,"../utils/elements":25,"./BaseComponent":10}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BaseComponent = require('./BaseComponent');

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

var _display2 = require('../mixins/display');

var _display3 = _interopRequireDefault(_display2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @module basic-controllers */

var defaults = {
  label: '&nbsp;',
  options: null,
  container: null,
  callback: null
};

/**
 * List of buttons without state.
 *
 * @param {Object} config - Override default parameters.
 * @param {String} config.label - Label of the controller.
 * @param {Array} [config.options=null] - Options for each button.
 * @param {String|Element|basic-controller~Group} [config.container=null] -
 *  Container of the controller.
 * @param {Function} [config.callback=null] - Callback to be executed when the
 *  value changes.
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * const triggerButtons = new controllers.TriggerButtons({
 *   label: 'My Trigger Buttons',
 *   options: ['value 1', 'value 2', 'value 3'],
 *   container: '#container',
 *   callback: (value, index) => console.log(value, index),
 * });
 */

var TriggerButtons = function (_display) {
  _inherits(TriggerButtons, _display);

  function TriggerButtons(config) {
    _classCallCheck(this, TriggerButtons);

    var _this = _possibleConstructorReturn(this, (TriggerButtons.__proto__ || Object.getPrototypeOf(TriggerButtons)).call(this, 'trigger-buttons', defaults, config));

    if (!Array.isArray(_this.params.options)) throw new Error('TriggerButton: Invalid option "options"');

    _this._index = null;
    _this._value = null;

    _get(TriggerButtons.prototype.__proto__ || Object.getPrototypeOf(TriggerButtons.prototype), 'initialize', _this).call(_this);
    return _this;
  }

  /**
   * Last triggered button value.
   *
   * @readonly
   * @type {String}
   */


  _createClass(TriggerButtons, [{
    key: 'render',


    /** @private */
    value: function render() {
      var _params = this.params,
          label = _params.label,
          options = _params.options;


      var content = '\n      <span class="label">' + label + '</span>\n      <div class="inner-wrapper">\n        ' + options.map(function (option, index) {
        return '<a href="#" class="btn">' + option + '</a>';
      }).join('') + '\n      </div>';

      this.$el = _get(TriggerButtons.prototype.__proto__ || Object.getPrototypeOf(TriggerButtons.prototype), 'render', this).call(this);
      this.$el.innerHTML = content;

      this.$buttons = Array.from(this.$el.querySelectorAll('.btn'));
      this._bindEvents();

      return this.$el;
    }

    /** @private */

  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      this.$buttons.forEach(function ($btn, index) {
        var value = _this2.params.options[index];

        $btn.addEventListener('click', function (e) {
          e.preventDefault();

          _this2._value = value;
          _this2._index = index;

          _this2.executeListeners(value, index);
        });
      });
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    }

    /**
     * Last triggered button index.
     *
     * @readonly
     * @type {String}
     */

  }, {
    key: 'index',
    get: function get() {
      return this._index;
    }
  }]);

  return TriggerButtons;
}((0, _display3.default)(_BaseComponent2.default));

exports.default = TriggerButtons;

},{"../mixins/display":24,"./BaseComponent":10}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseComponent = require('./components/BaseComponent');

var _BaseComponent2 = _interopRequireDefault(_BaseComponent);

var _Group = require('./components/Group');

var _Group2 = _interopRequireDefault(_Group);

var _NumberBox = require('./components/NumberBox');

var _NumberBox2 = _interopRequireDefault(_NumberBox);

var _SelectButtons = require('./components/SelectButtons');

var _SelectButtons2 = _interopRequireDefault(_SelectButtons);

var _SelectList = require('./components/SelectList');

var _SelectList2 = _interopRequireDefault(_SelectList);

var _Slider = require('./components/Slider');

var _Slider2 = _interopRequireDefault(_Slider);

var _Text = require('./components/Text');

var _Text2 = _interopRequireDefault(_Text);

var _Title = require('./components/Title');

var _Title2 = _interopRequireDefault(_Title);

var _Toggle = require('./components/Toggle');

var _Toggle2 = _interopRequireDefault(_Toggle);

var _TriggerButtons = require('./components/TriggerButtons');

var _TriggerButtons2 = _interopRequireDefault(_TriggerButtons);

var _container2 = require('./mixins/container');

var _container3 = _interopRequireDefault(_container2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// map type names to constructors
var typeCtorMap = {
  'group': _Group2.default,
  'number-box': _NumberBox2.default,
  'select-buttons': _SelectButtons2.default,
  'select-list': _SelectList2.default,
  'slider': _Slider2.default,
  'text': _Text2.default,
  'title': _Title2.default,
  'toggle': _Toggle2.default,
  'trigger-buttons': _TriggerButtons2.default
};

var defaults = {
  container: 'body'
};

var Control = function (_container) {
  _inherits(Control, _container);

  function Control(config) {
    _classCallCheck(this, Control);

    var _this = _possibleConstructorReturn(this, (Control.__proto__ || Object.getPrototypeOf(Control)).call(this, 'control', defaults, config));

    var $container = _this.params.container;

    if (typeof $container === 'string') $container = document.querySelector($container);

    _this.$container = $container;
    return _this;
  }

  return Control;
}((0, _container3.default)(_BaseComponent2.default));

/** @module basic-controllers */

/**
 * Create a whole control surface from a json definition.
 *
 * @param {String|Element} container - Container of the controls.
 * @param {Object} - Definitions for the controls.
 * @return {Object} - A `Control` instance that behaves like a group without graphic.
 * @static
 *
 * @example
 * import * as controllers from 'basic-controllers';
 *
 * const definitions = [
 *   {
 *     id: 'my-slider',
 *     type: 'slider',
 *     label: 'My Slider',
 *     size: 'large',
 *     min: 0,
 *     max: 1000,
 *     step: 1,
 *     default: 253,
 *   }, {
 *     id: 'my-group',
 *     type: 'group',
 *     label: 'Group',
 *     default: 'opened',
 *     elements: [
 *       {
 *         id: 'my-number',
 *         type: 'number-box',
 *         default: 0.4,
 *         min: -1,
 *         max: 1,
 *         step: 0.01,
 *       }
 *     ],
 *   }
 * ];
 *
 * const controls = controllers.create('#container', definitions);
 *
 * // add a listener on all the component inside `my-group`
 * controls.addListener('my-group', (id, value) => console.log(id, value));
 *
 * // retrieve the instance of `my-number`
 * const myNumber = controls.getComponent('my-group/my-number');
 */


function create(container, definitions) {

  function _parse(container, definitions) {
    definitions.forEach(function (def, index) {
      var type = def.type;
      var ctor = typeCtorMap[type];
      var config = Object.assign({}, def);

      //
      config.container = container;
      delete config.type;

      var component = new ctor(config);

      if (type === 'group') _parse(component, config.elements);
    });
  };

  var _root = new Control({ container: container });
  _parse(_root, definitions);

  return _root;
}

exports.default = create;

},{"./components/BaseComponent":10,"./components/Group":12,"./components/NumberBox":13,"./components/SelectButtons":14,"./components/SelectList":15,"./components/Slider":16,"./components/Text":17,"./components/Title":18,"./components/Toggle":19,"./components/TriggerButtons":20,"./mixins/container":23}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setTheme = exports.create = exports.TriggerButtons = exports.Toggle = exports.Title = exports.Text = exports.Slider = exports.SelectList = exports.SelectButtons = exports.NumberBox = exports.DragAndDrop = exports.Group = exports.BaseComponent = exports.styles = undefined;

var _Group = require('./components/Group');

Object.defineProperty(exports, 'Group', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Group).default;
  }
});

var _DragAndDrop = require('./components/DragAndDrop');

Object.defineProperty(exports, 'DragAndDrop', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragAndDrop).default;
  }
});

var _NumberBox = require('./components/NumberBox');

Object.defineProperty(exports, 'NumberBox', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_NumberBox).default;
  }
});

var _SelectButtons = require('./components/SelectButtons');

Object.defineProperty(exports, 'SelectButtons', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SelectButtons).default;
  }
});

var _SelectList = require('./components/SelectList');

Object.defineProperty(exports, 'SelectList', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SelectList).default;
  }
});

var _Slider = require('./components/Slider');

Object.defineProperty(exports, 'Slider', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Slider).default;
  }
});

var _Text = require('./components/Text');

Object.defineProperty(exports, 'Text', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Text).default;
  }
});

var _Title = require('./components/Title');

Object.defineProperty(exports, 'Title', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Title).default;
  }
});

var _Toggle = require('./components/Toggle');

Object.defineProperty(exports, 'Toggle', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Toggle).default;
  }
});

var _TriggerButtons = require('./components/TriggerButtons');

Object.defineProperty(exports, 'TriggerButtons', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TriggerButtons).default;
  }
});

var _factory = require('./factory');

Object.defineProperty(exports, 'create', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_factory).default;
  }
});

var _display = require('./mixins/display');

Object.defineProperty(exports, 'setTheme', {
  enumerable: true,
  get: function get() {
    return _display.setTheme;
  }
});
exports.disableStyles = disableStyles;

var _styles2 = require('./utils/styles');

var _styles = _interopRequireWildcard(_styles2);

var _BaseComponent2 = require('./components/BaseComponent');

var _BaseComponent3 = _interopRequireDefault(_BaseComponent2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = exports.styles = _styles;

/** @module basic-controllers */

// expose for plugins
var BaseComponent = exports.BaseComponent = _BaseComponent3.default;

// components


/**
 * Disable default styling (expect a broken ui)
 */
function disableStyles() {
  _styles.disable();
};

},{"./components/BaseComponent":10,"./components/DragAndDrop":11,"./components/Group":12,"./components/NumberBox":13,"./components/SelectButtons":14,"./components/SelectList":15,"./components/Slider":16,"./components/Text":17,"./components/Title":18,"./components/Toggle":19,"./components/TriggerButtons":20,"./factory":21,"./mixins/display":24,"./utils/styles":27}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var separator = '/';

function getHead(path) {
  return path.split(separator)[0];
}

function getTail(path) {
  var parts = path.split(separator);
  parts.shift();
  return parts.join(separator);
}

var container = function container(superclass) {
  return function (_superclass) {
    _inherits(_class, _superclass);

    function _class() {
      var _ref;

      _classCallCheck(this, _class);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args)));

      _this.elements = new Set();

      // sure of that ?
      delete _this._listeners;
      delete _this._groupListeners;
      return _this;
    }

    /**
     * Return one of the group children according to its `id`, `null` otherwise.
     * @private
     */


    _createClass(_class, [{
      key: '_getHead',
      value: function _getHead(id) {}
    }, {
      key: '_getTail',
      value: function _getTail(id) {}

      /**
       * Return a child of the group recursively according to the given `id`,
       * `null` otherwise.
       * @private
       */

    }, {
      key: 'getComponent',
      value: function getComponent(id) {
        var head = getHead(id);

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var component = _step.value;

            if (head === component.id) {
              if (head === id) return component;else if (component.type = 'group') return component.getComponent(getTail(id));else throw new Error('Undefined component ' + id);
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        throw new Error('Undefined component ' + id);
      }

      /**
       * Add Listener on each components of the group.
       *
       * @param {String} id - Path to component id.
       * @param {Function} callback - Function to execute.
       */

    }, {
      key: 'addListener',
      value: function addListener(id, callback) {
        if (arguments.length === 1) {
          callback = id;
          this._addGroupListener('', '', callback);
        } else {
          this._addGroupListener(id, '', callback);
        }
      }

      /** @private */

    }, {
      key: '_addGroupListener',
      value: function _addGroupListener(id, callId, callback) {
        if (id) {
          var componentId = getHead(id);
          var component = this.getComponent(componentId);

          if (component) {
            id = getTail(id);
            component._addGroupListener(id, callId, callback);
          } else {
            throw new Error('Undefined component ' + this.rootId + '/' + componentId);
          }
        } else {
          this.elements.forEach(function (component) {
            var _callId = callId; // create a new branche
            _callId += callId === '' ? component.id : separator + component.id;
            component._addGroupListener(id, _callId, callback);
          });
        }
      }
    }]);

    return _class;
  }(superclass);
};

exports.default = container;

},{}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.setTheme = setTheme;

var _styles = require('../utils/styles');

var styles = _interopRequireWildcard(_styles);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @module basic-controllers */

// default theme
var theme = 'light';
// set of the instanciated controllers
var controllers = new Set();

/**
 * Change the theme of the controllers, currently 3 themes are available:
 *  - `'light'` (default)
 *  - `'grey'`
 *  - `'dark'`
 *
 * @param {String} theme - Name of the theme.
 */
function setTheme(value) {
  controllers.forEach(function (controller) {
    return controller.$el.classList.remove(theme);
  });
  theme = value;
  controllers.forEach(function (controller) {
    return controller.$el.classList.add(theme);
  });
}

/**
 * display mixin - components with DOM
 * @private
 */
var display = function display(superclass) {
  return function (_superclass) {
    _inherits(_class, _superclass);

    function _class() {
      var _ref;

      _classCallCheck(this, _class);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // insert styles when the first controller is created
      var _this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args)));

      if (controllers.size === 0) styles.insertStyleSheet();

      _this.resize = _this.resize.bind(_this);

      controllers.add(_this);
      return _this;
    }

    _createClass(_class, [{
      key: 'initialize',
      value: function initialize() {
        var _this2 = this;

        var $container = this.params.container;

        if ($container) {
          // css selector
          if (typeof $container === 'string') {
            $container = document.querySelector($container);
            // group
          } else if ($container.$container) {
            // this.group = $container;
            $container.elements.add(this);
            $container = $container.$container;
          }

          $container.appendChild(this.render());
          setTimeout(function () {
            return _this2.resize();
          }, 0);
        }
      }

      /** @private */

    }, {
      key: 'render',
      value: function render() {
        this.$el = document.createElement('div');
        this.$el.classList.add(styles.ns, theme, this.type);

        window.removeEventListener('resize', this.resize);
        window.addEventListener('resize', this.resize);

        return this.$el;
      }

      /** @private */

    }, {
      key: 'resize',
      value: function resize() {
        if (this.$el) {
          var boundingRect = this.$el.getBoundingClientRect();
          var width = boundingRect.width;
          var method = width > 600 ? 'remove' : 'add';

          this.$el.classList[method]('small');
        }
      }
    }]);

    return _class;
  }(superclass);
};

exports.default = display;

},{"../utils/styles":27}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var toggle = exports.toggle = "\n  <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"toggle-element\" version=\"1.1\" viewBox=\"0 0 50 50\" preserveAspectRatio=\"none\">\n      <g class=\"x\">\n        <line x1=\"8\" y1=\"8\" x2=\"42\" y2=\"42\" stroke=\"white\" />\n        <line x1=\"8\" y1=\"42\" x2=\"42\" y2=\"8\" stroke=\"white\" />\n      </g>\n  </svg>\n";

var arrowRight = exports.arrowRight = "\n  <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"arrow-right\" version=\"1.1\" viewBox=\"0 0 50 50\" preserveAspectRatio=\"none\">\n    <line x1=\"10\" y1=\"10\" x2=\"40\" y2=\"25\" />\n    <line x1=\"10\" y1=\"40\" x2=\"40\" y2=\"25\" />\n  </svg>\n";

var arrowLeft = exports.arrowLeft = "\n  <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"arrow-left\" version=\"1.1\" viewBox=\"0 0 50 50\" preserveAspectRatio=\"none\">\n    <line x1=\"40\" y1=\"10\" x2=\"10\" y2=\"25\" />\n    <line x1=\"40\" y1=\"40\" x2=\"10\" y2=\"25\" />\n  </svg>\n";

var smallArrowRight = exports.smallArrowRight = "\n  <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"small-arrow-right\" viewBox=\"0 0 50 50\">\n    <path d=\"M 20 15 L 35 25 L 20 35 Z\" />\n  </svg>\n";

var smallArrowBottom = exports.smallArrowBottom = "\n  <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"small-arrow-bottom\" viewBox=\"0 0 50 50\">\n    <path d=\"M 15 17 L 35 17 L 25 32 Z\" />\n  </svg>\n";

},{}],26:[function(require,module,exports){
module.exports = " .basic-controllers { } .basic-controllers { width: 100%; max-width: 800px; height: 34px; padding: 3px; margin: 4px 0; background-color: #efefef; border: 1px solid #aaaaaa; box-sizing: border-box; border-radius: 2px; display: block; color: #464646; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } .basic-controllers .label { font: italic normal 1.2em Quicksand, arial, sans-serif; line-height: 26px; overflow: hidden; text-align: right; padding: 0 8px 0 0; display: block; box-sizing: border-box; width: 24%; float: left; white-space: nowrap; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none; } .basic-controllers .inner-wrapper { display: -webkit-inline-flex; display: inline-flex; -webkit-flex-wrap: no-wrap; flex-wrap: no-wrap; width: 76%; float: left; } .basic-controllers.small { height: 48px; } .basic-controllers.small:not(.align-small) { height: auto; } .basic-controllers.small:not(.align-small) .label { width: 100%; float: none; text-align: left; line-height: 40px; } .basic-controllers.small:not(.align-small) .inner-wrapper { width: 100%; float: none; } .basic-controllers.small.align-small .label { display: block; margin-right: 20px; text-align: left; line-height: 40px; } .basic-controllers.small.align-small .inner-wrapper { display: inline-block; width: auto; } .basic-controllers .arrow-right, .basic-controllers .arrow-left { border-radius: 2px; width: 14px; height: 26px; cursor: pointer; background-color: #464646; } .basic-controllers .arrow-right line, .basic-controllers .arrow-left line { stroke-width: 3px; stroke: #ffffff; } .basic-controllers .arrow-right:hover, .basic-controllers .arrow-left:hover { background-color: #686868; } .basic-controllers .arrow-right:active, .basic-controllers .arrow-left:active { background-color: #909090; } .basic-controllers .small-arrow-right, .basic-controllers .small-arrow-bottom { width: 26px; height: 26px; cursor: pointer; } .basic-controllers .small-arrow-right path, .basic-controllers .small-arrow-bottom path { fill: #909090; } .basic-controllers .small-arrow-right:hover path, .basic-controllers .small-arrow-bottom:hover path { fill: #686868; } .basic-controllers .toggle-element { width: 26px; height: 26px; border-radius: 2px; background-color: #464646; cursor: pointer; } .basic-controllers .toggle-element:hover { background-color: #686868; } .basic-controllers .toggle-element line { stroke-width: 3px; } .basic-controllers .toggle-element .x { display: none; } .basic-controllers .toggle-element.active .x { display: block; } .basic-controllers .btn { display: block; text-align: center; font: normal normal 12px arial; text-decoration: none; height: 26px; line-height: 26px; background-color: #464646; border: none; color: #ffffff; margin: 0 4px 0 0; padding: 0; box-sizing: border-box; border-radius: 2px; cursor: pointer; -webkit-flex-grow: 1; flex-grow: 1; } .basic-controllers .btn:last-child { margin: 0; } .basic-controllers .btn:hover { background-color: #686868; } .basic-controllers .btn:active, .basic-controllers .btn.active { background-color: #909090; } .basic-controllers .btn:focus { outline: none; } .basic-controllers .number { height: 26px; display: inline-block; position: relative; font: normal normal 1.2em Quicksand, arial, sans-serif; vertical-align: top; border: none; background: none; color: #464646; padding: 0 4px; margin: 0; background-color: #f9f9f9; border-radius: 2px; box-sizing: border-box; } .basic-controllers .number:focus { outline: none; } .basic-controllers select { height: 26px; line-height: 26px; background-color: #f9f9f9; border-radius: 2px; border: none; vertical-align: top; padding: 0; margin: 0; } .basic-controllers select:focus { outline: none; } .basic-controllers input[type=text] { width: 100%; height: 26px; line-height: 26px; border: 0; padding: 0 4px; background-color: #f9f9f9; border-radius: 2px; color: #565656; } .basic-controllers.small .arrow-right, .basic-controllers.small .arrow-left { width: 24px; height: 40px; } .basic-controllers.small .toggle-element { width: 40px; height: 40px; } .basic-controllers.small .btn { height: 40px; line-height: 40px; } .basic-controllers.small .number { height: 40px; } .basic-controllers.small select { height: 40px; line-height: 40px; } .basic-controllers.small input[type=text] { height: 40px; line-height: 40px; } .basic-controllers.title { border: none !important; margin-bottom: 0; margin-top: 8px; padding-top: 8px; padding-bottom: 0; background-color: transparent !important; height: 25px; } .basic-controllers.title .label { font: normal bold 1.3em Quicksand, arial, sans-serif; height: 100%; overflow: hidden; text-align: left; padding: 0; width: 100%; box-sizing: border-box; -webkit-flex-grow: 1; flex-grow: 1; } .basic-controllers.group { height: auto; background-color: white; } .basic-controllers.group .group-header .label { font: normal bold 1.3em Quicksand, arial, sans-serif; height: 26px; line-height: 26px; overflow: hidden; text-align: left; padding: 0 0 0 36px; width: 100%; box-sizing: border-box; -webkit-flex-grow: 1; flex-grow: 1; float: none; cursor: pointer; } .basic-controllers.group .group-header .small-arrow-right { width: 26px; height: 26px; position: absolute; } .basic-controllers.group .group-header .small-arrow-bottom { width: 26px; height: 26px; position: absolute; } .basic-controllers.group .group-content { overflow: hidden; } .basic-controllers.group .group-content > div { margin: 4px auto; } .basic-controllers.group .group-content > div:last-child { margin-bottom: 0; } .basic-controllers.group.opened .group-header .small-arrow-right { display: none; } .basic-controllers.group.opened .group-header .small-arrow-bottom { display: block; } .basic-controllers.group.opened .group-content { display: block; } .basic-controllers.group.closed .group-header .small-arrow-right { display: block; } .basic-controllers.group.closed .group-header .small-arrow-bottom { display: none; } .basic-controllers.group.closed .group-content { display: none; } .basic-controllers.slider .range { height: 26px; display: inline-block; margin: 0; -webkit-flex-grow: 4; flex-grow: 4; position: relative; } .basic-controllers.slider .range canvas { position: absolute; top: 0; left: 0; } .basic-controllers.slider .number-wrapper { display: inline; height: 26px; text-align: right; -webkit-flex-grow: 3; flex-grow: 3; } .basic-controllers.slider .number-wrapper .number { left: 5px; width: 54px; text-align: right; } .basic-controllers.slider .number-wrapper .unit { font: italic normal 1em Quicksand, arial, sans-serif; line-height: 26px; height: 26px; width: 30px; display: inline-block; position: relative; padding-left: 5px; padding-right: 5px; color: #565656; } .basic-controllers.slider .number-wrapper .unit sup { line-height: 7px; } .basic-controllers.slider.slider-large .range { -webkit-flex-grow: 50; flex-grow: 50; } .basic-controllers.slider.slider-large .number-wrapper { -webkit-flex-grow: 1; flex-grow: 1; } .basic-controllers.slider.slider-small .range { -webkit-flex-grow: 2; flex-grow: 2; } .basic-controllers.slider.slider-small .number-wrapper { -webkit-flex-grow: 4; flex-grow: 4; } .basic-controllers.small.slider .range { height: 40px; } .basic-controllers.small.slider .number-wrapper { height: 40px; } .basic-controllers.small.slider .number-wrapper .unit { line-height: 40px; height: 40px; } .basic-controllers.number-box .number { width: 120px; margin: 0 10px; vertical-align: top; } .basic-controllers.select-list select { margin: 0 10px; width: 120px; font: normal normal 1.2em Quicksand, arial, sans-serif; color: #464646; } .basic-controllers.select-buttons .btn:first-of-type { margin-left: 4px; } .basic-controllers.text input[type=text] { font: normal normal 1.2em Quicksand, arial, sans-serif; color: #464646; } .basic-controllers.drag-and-drop { width: 100%; text-align: center; font-weight: bold; height: 100px; } .basic-controllers.drag-and-drop .drop-zone { border: 1px dotted #c4c4c4; border-radius: 2px; transition: background 200ms; height: 90px; } .basic-controllers.drag-and-drop .drop-zone.drag { background-color: #c4c4c4; } .basic-controllers.drag-and-drop .label { display: block; width: 100%; height: 90px; line-height: 90px; margin: 0; padding: 0; text-align: center; } .basic-controllers.drag-and-drop.process .label { display: none; } .basic-controllers.small.drag-and-drop { height: 120px; } .basic-controllers.small.drag-and-drop .drop-zone { height: 110px; } .basic-controllers.small.drag-and-drop .label { display: block; width: 100%; height: 110px; line-height: 110px; margin: 0; padding: 0; text-align: center; } .basic-controllers.grey { background-color: #363636; border: 1px solid #585858; color: rgba(255, 255, 255, 0.95); } .basic-controllers.grey .toggle-element { background-color: #efefef; } .basic-controllers.grey .toggle-element line { stroke: #363636; } .basic-controllers.grey .toggle-element:hover { background-color: #cdcdcd; } .basic-controllers.grey .arrow-right, .basic-controllers.grey .arrow-left { background-color: #efefef; } .basic-controllers.grey .arrow-right line, .basic-controllers.grey .arrow-left line { stroke: #363636; } .basic-controllers.grey .arrow-right:hover, .basic-controllers.grey .arrow-left:hover { background-color: #cdcdcd; } .basic-controllers.grey .arrow-right:active, .basic-controllers.grey .arrow-left:active { background-color: #ababab; } .basic-controllers.grey .small-arrow-right path, .basic-controllers.grey .small-arrow-bottom path { fill: #ababab; } .basic-controllers.grey .small-arrow-right:hover path, .basic-controllers.grey .small-arrow-bottom:hover path { fill: #cdcdcd; } .basic-controllers.grey .number, .basic-controllers.grey select, .basic-controllers.grey input[type=text] { color: rgba(255, 255, 255, 0.95); background-color: #454545; } .basic-controllers.grey .btn { background-color: #efefef; color: #363636; } .basic-controllers.grey .btn:hover { background-color: #cdcdcd; } .basic-controllers.grey .btn:active, .basic-controllers.grey .btn.active { background-color: #ababab; } .basic-controllers.grey.slider .inner-wrapper .number-wrapper .unit { color: #bcbcbc; } .basic-controllers.grey.group { background-color: #505050; } .basic-controllers.grey.drag-and-drop .drop-zone { border: 1px dotted #727272; } .basic-controllers.grey.drag-and-drop .drop-zone.drag { background-color: #727272; } .basic-controllers.dark { background-color: #242424; border: 1px solid #282828; color: #ffffff; } .basic-controllers.dark .toggle-element { background-color: #464646; } .basic-controllers.dark .toggle-element line { stroke: #ffffff; } .basic-controllers.dark .toggle-element:hover { background-color: #686868; } .basic-controllers.dark .arrow-right, .basic-controllers.dark .arrow-left { background-color: #464646; } .basic-controllers.dark .arrow-right line, .basic-controllers.dark .arrow-left line { stroke: #ffffff; } .basic-controllers.dark .arrow-right:hover, .basic-controllers.dark .arrow-left:hover { background-color: #686868; } .basic-controllers.dark .arrow-right:active, .basic-controllers.dark .arrow-left:active { background-color: #909090; } .basic-controllers.dark .small-arrow-right path, .basic-controllers.dark .small-arrow-bottom path { fill: #909090; } .basic-controllers.dark .small-arrow-right:hover path, .basic-controllers.dark .small-arrow-bottom:hover path { fill: #686868; } .basic-controllers.dark .number, .basic-controllers.dark select, .basic-controllers.dark input[type=text] { color: #ffffff; background-color: #333333; } .basic-controllers.dark .btn { background-color: #464646; color: #ffffff; } .basic-controllers.dark .btn:hover { background-color: #686868; } .basic-controllers.dark .btn:active, .basic-controllers.dark .btn.active { background-color: #909090; } .basic-controllers.dark.slider .inner-wrapper .number-wrapper .unit { color: #cdcdcd; } .basic-controllers.dark.group { background-color: #3e3e3e; } .basic-controllers.dark.drag-and-drop .drop-zone { border: 1px dotted #424242; } .basic-controllers.dark.drag-and-drop .drop-zone.drag { background-color: #424242; } ";
},{}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ns = undefined;
exports.disable = disable;
exports.insertStyleSheet = insertStyleSheet;

var _package = require('../../package.json');

var _stylesDeclarations = require('./styles-declarations.js');

var _stylesDeclarations2 = _interopRequireDefault(_stylesDeclarations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ns = exports.ns = _package.name.replace('@ircam/', '');

var nsClass = '.' + ns;
var _disabled = false;

function disable() {
  _disabled = true;
}

function insertStyleSheet() {
  if (_disabled) return;

  var $css = document.createElement('style');
  $css.setAttribute('data-namespace', ns);
  $css.type = 'text/css';

  if ($css.styleSheet) $css.styleSheet.cssText = _stylesDeclarations2.default;else $css.appendChild(document.createTextNode(_stylesDeclarations2.default));

  // insert before link or styles if exists
  var $link = document.head.querySelector('link');
  var $style = document.head.querySelector('style');

  if ($link) document.head.insertBefore($css, $link);else if ($style) document.head.insertBefore($css, $style);else document.head.appendChild($css);
}

},{"../../package.json":28,"./styles-declarations.js":26}],28:[function(require,module,exports){
module.exports={
  "_from": "@ircam/basic-controllers",
  "_id": "@ircam/basic-controllers@1.0.4",
  "_inBundle": false,
  "_integrity": "sha512-3cSAtxfpXtg1a3hvyVJN5gNmfqwf5mSbxuxq2g9I6/roUswtxOgGwYwWV18UJFWR75Mqot5SSVvbLdPPgv1noA==",
  "_location": "/@ircam/basic-controllers",
  "_phantomChildren": {},
  "_requested": {
    "type": "tag",
    "registry": true,
    "raw": "@ircam/basic-controllers",
    "name": "@ircam/basic-controllers",
    "escapedName": "@ircam%2fbasic-controllers",
    "scope": "@ircam",
    "rawSpec": "",
    "saveSpec": null,
    "fetchSpec": "latest"
  },
  "_requiredBy": [
    "#USER",
    "/"
  ],
  "_resolved": "https://registry.npmjs.org/@ircam/basic-controllers/-/basic-controllers-1.0.4.tgz",
  "_shasum": "2e2152c618bae946126b8ebf41baeb95cb3c40f8",
  "_spec": "@ircam/basic-controllers",
  "_where": "/Users/matuszewski/dev/js/wavesjs/lib/waves-masters/examples/transport",
  "bugs": {
    "url": "https://github.com/ircam-jstools/basic-controllers/issues"
  },
  "bundleDependencies": false,
  "dependencies": {
    "@ircam/gui-components": "^1.0.3"
  },
  "deprecated": false,
  "description": "Set of simple controllers for rapid prototyping",
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-plugin-transform-es2015-modules-commonjs": "^6.26.0",
    "babel-preset-env": "^1.6.1",
    "browserify": "^14.5.0",
    "chalk": "^2.3.0",
    "fs-extra": "^4.0.3",
    "jsdoc-to-markdown": "^3.0.0",
    "klaw": "^2.1.1",
    "node-sass": "^4.7.2",
    "np": "^2.18.2",
    "tape": "^4.8.0",
    "uglify-js": "^3.2.2",
    "watch": "^1.0.2"
  },
  "homepage": "https://github.com/ircam-jstools/basic-controllers#readme",
  "license": "BSD-3-Clause",
  "main": "dist/index.js",
  "name": "@ircam/basic-controllers",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ircam-jstools/basic-controllers.git"
  },
  "scripts": {
    "bundle": "node ./bin/runner --bundle",
    "deploy": "np --yolo",
    "doc": "jsdoc2md -t tmpl/README.hbs src/**/*.js > README.md",
    "prewatch": "npm run transpile",
    "transpile": "node ./bin/runner --transpile",
    "version": "npm run transpile && npm run doc && git add README.md",
    "watch": "node ./bin/runner --watch"
  },
  "standalone": "basicControllers",
  "version": "1.0.4"
}

},{}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Breakpoint = function () {
  function Breakpoint(options) {
    _classCallCheck(this, Breakpoint);

    var defaults = {
      callback: function callback(value) {},
      width: 300,
      height: 150,
      container: 'body',
      default: [],
      radius: 4
    };

    this.params = Object.assign({}, defaults, options);

    this._values = {
      norm: [],
      logical: [],
      displayed: []
    };

    this._createElement();

    // initialize
    this._resizeElement();

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);

    this._onResize = this._onResize.bind(this);

    this._onResize();
    this._bindEvents();

    window.addEventListener('resize', this._onResize);
  }

  _createClass(Breakpoint, [{
    key: '_createElement',


    /** @note - same as Slider */
    value: function _createElement() {
      var container = this.params.container;

      this.$canvas = document.createElement('canvas');
      this.ctx = this.$canvas.getContext('2d');

      if (container instanceof Element) this.$container = container;else this.$container = document.querySelector(container);

      this.$container.appendChild(this.$canvas);
    }

    /** @note - same as Slider */

  }, {
    key: '_resizeElement',
    value: function _resizeElement() {
      var _params = this.params,
          width = _params.width,
          height = _params.height;

      // logical and pixel size of the canvas

      this._pixelRatio = function (ctx) {
        var dPR = window.devicePixelRatio || 1;
        var bPR = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;

        return dPR / bPR;
      }(this.ctx);

      this._canvasWidth = width * this._pixelRatio;
      this._canvasHeight = height * this._pixelRatio;

      this.ctx.canvas.width = this._canvasWidth;
      this.ctx.canvas.height = this._canvasHeight;
      this.ctx.canvas.style.width = width + 'px';
      this.ctx.canvas.style.height = height + 'px';
    }
  }, {
    key: 'resize',
    value: function resize(width, height) {}

    // update this.dots.displayed according to new width and height


    /** @note - same as Slider */

  }, {
    key: '_onResize',
    value: function _onResize() {
      this._boundingClientRect = this.$canvas.getBoundingClientRect();
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      this.$canvas.addEventListener('mousedown', this._onMouseDown);
    }
  }, {
    key: '_onMouseDown',
    value: function _onMouseDown(e) {
      var pageX = e.pageX;
      var pageY = e.pageY;
      var x = pageX - this._boundingClientRect.left;
      var y = pageY - this._boundingClientRect.top;

      if (this._testHit(x, y)) {
        // bind mousemove and mouseup
        console.log('hit');
      } else {
        // create a new point
        console.log('create dot');
        this._createDot(x, y);
      }
    }
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove() {}
  }, {
    key: '_onMouseUp',
    value: function _onMouseUp() {}

    // test if given x, y (in pixels) match some already displayed values

  }, {
    key: '_testHit',
    value: function _testHit(x, y) {
      var displayedValues = this._values.displayed;
      var radius = this.params.radius;

      for (var i = 0; i < displayedValues.length; i++) {
        var dot = displayedValues[i];
        var dx = dot[0] - x;
        var dy = dot[1] - y;
        var mag = Math.sqrt(dx * dx + dy * dy);

        if (mag <= radius) return true;
      }

      return false;
    }
  }, {
    key: '_createDot',
    value: function _createDot(x, y) {
      var normX = x / this.params.width;
      var normY = y / this.p$arams.height;
    }
  }, {
    key: 'values',
    get: function get() {},
    set: function set(values) {}
  }]);

  return Breakpoint;
}();

exports.default = Breakpoint;

},{}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getScale(domain, range) {
  var slope = (range[1] - range[0]) / (domain[1] - domain[0]);
  var intercept = range[0] - slope * domain[0];

  function scale(val) {
    return slope * val + intercept;
  }

  scale.invert = function (val) {
    return (val - intercept) / slope;
  };

  return scale;
}

function getClipper(min, max, step) {
  return function (val) {
    var clippedValue = Math.round(val / step) * step;
    var fixed = Math.max(Math.log10(1 / step), 0);
    var fixedValue = clippedValue.toFixed(fixed); // fix floating point errors
    return Math.min(max, Math.max(min, parseFloat(fixedValue)));
  };
}

/**
 * @module gui-components
 */

/**
 * Versatile canvas based slider.
 *
 * @param {Object} options - Override default parameters.
 * @param {'jump'|'proportionnal'|'handle'} [options.mode='jump'] - Mode of the slider:
 *  - in 'jump' mode, the value is changed on 'touchstart' or 'mousedown', and
 *    on move.
 *  - in 'proportionnal' mode, the value is updated relatively to move.
 *  - in 'handle' mode, the slider can be grabbed only around its value.
 * @param {Function} [options.callback] - Callback to be executed when the value
 *  of the slider changes.
 * @param {Number} [options.width=200] - Width of the slider.
 * @param {Number} [options.height=30] - Height of the slider.
 * @param {Number} [options.min=0] - Minimum value.
 * @param {Number} [options.max=1] - Maximum value.
 * @param {Number} [options.step=0.01] - Step between each consecutive values.
 * @param {Number} [options.default=0] - Default value.
 * @param {String|Element} [options.container='body'] - CSS Selector or DOM
 *  element in which inserting the slider.
 * @param {String} [options.backgroundColor='#464646'] - Background color of the
 *  slider.
 * @param {String} [options.foregroundColor='steelblue'] - Foreground color of
 *  the slider.
 * @param {'horizontal'|'vertical'} [options.orientation='horizontal'] -
 *  Orientation of the slider.
 * @param {Array} [options.markers=[]] - List of values where markers should
 *  be displayed on the slider.
 * @param {Boolean} [options.showHandle=true] - In 'handle' mode, define if the
 *  draggable should be show or not.
 * @param {Number} [options.handleSize=20] - Size of the draggable zone.
 * @param {String} [options.handleColor='rgba(255, 255, 255, 0.7)'] - Color of the
 *  draggable zone (when `showHandle` is `true`).
 *
 * @example
 * import { Slider} from 'gui-components';
 *
 * const slider = new Slider({
 *   mode: 'jump',
 *   container: '#container',
 *   default: 0.6,
 *   markers: [0.5],
 *   callback: (value) => console.log(value),
 * });
 */

var Slider = function () {
  function Slider(options) {
    _classCallCheck(this, Slider);

    var defaults = {
      mode: 'jump',
      callback: function callback(value) {},
      width: 200,
      height: 30,
      min: 0,
      max: 1,
      step: 0.01,
      default: 0,
      container: 'body',
      backgroundColor: '#464646',
      foregroundColor: 'steelblue',
      orientation: 'horizontal',
      markers: [],

      // handle specific options
      showHandle: true,
      handleSize: 20,
      handleColor: 'rgba(255, 255, 255, 0.7)'
    };

    this.params = Object.assign({}, defaults, options);
    this._listeners = [];
    this._boundingClientRect = null;
    this._touchId = null;
    this._value = null;
    this._canvasWidth = null;
    this._canvasHeight = null;
    // for proportionnal mode
    this._currentMousePosition = { x: null, y: null };
    this._currentSliderPosition = null;

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);

    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);

    this._onResize = this._onResize.bind(this);

    this._createElement();

    // initialize
    this._resizeElement();
    this._setScales();
    this._bindEvents();
    this._onResize();
    this._updateValue(this.params.default, true, true);

    window.addEventListener('resize', this._onResize);
  }

  /**
   * Current value of the slider.
   *
   * @type {Number}
   */


  _createClass(Slider, [{
    key: 'reset',


    /**
     * Reset the slider to its default value.
     */
    value: function reset() {
      this._updateValue(this.params.default);
    }

    /**
     * Resize the slider.
     *
     * @param {Number} width - New width of the slider.
     * @param {Number} height - New height of the slider.
     */

  }, {
    key: 'resize',
    value: function resize(width, height) {
      this.params.width = width;
      this.params.height = height;

      this._resizeElement();
      this._setScales();
      this._onResize();
      this._updateValue(this._value, true, true);
    }
  }, {
    key: '_updateValue',
    value: function _updateValue(value) {
      var _this = this;

      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var forceRender = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var callback = this.params.callback;

      var clippedValue = this.clipper(value);

      // resize render but don't trigger callback
      if (clippedValue === this._value && forceRender === true) requestAnimationFrame(function () {
        return _this._render(clippedValue);
      });

      // trigger callback
      if (clippedValue !== this._value) {
        this._value = clippedValue;

        if (!silent) callback(clippedValue);

        requestAnimationFrame(function () {
          return _this._render(clippedValue);
        });
      }
    }
  }, {
    key: '_createElement',
    value: function _createElement() {
      var container = this.params.container;

      this.$canvas = document.createElement('canvas');
      this.ctx = this.$canvas.getContext('2d');

      if (container instanceof Element) this.$container = container;else this.$container = document.querySelector(container);

      this.$container.appendChild(this.$canvas);
    }
  }, {
    key: '_resizeElement',
    value: function _resizeElement() {
      var _params = this.params,
          width = _params.width,
          height = _params.height;

      // logical and pixel size of the canvas

      this._pixelRatio = function (ctx) {
        var dPR = window.devicePixelRatio || 1;
        var bPR = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;

        return dPR / bPR;
      }(this.ctx);

      this._canvasWidth = width * this._pixelRatio;
      this._canvasHeight = height * this._pixelRatio;

      this.ctx.canvas.width = this._canvasWidth;
      this.ctx.canvas.height = this._canvasHeight;
      this.ctx.canvas.style.width = width + 'px';
      this.ctx.canvas.style.height = height + 'px';
    }
  }, {
    key: '_onResize',
    value: function _onResize() {
      this._boundingClientRect = this.$canvas.getBoundingClientRect();
    }
  }, {
    key: '_setScales',
    value: function _setScales() {
      var _params2 = this.params,
          orientation = _params2.orientation,
          width = _params2.width,
          height = _params2.height,
          min = _params2.min,
          max = _params2.max,
          step = _params2.step;
      // define transfert functions

      var screenSize = orientation === 'horizontal' ? width : height;

      var canvasSize = orientation === 'horizontal' ? this._canvasWidth : this._canvasHeight;

      var domain = orientation === 'horizontal' ? [min, max] : [max, min];
      var screenRange = [0, screenSize];
      var canvasRange = [0, canvasSize];

      this.screenScale = getScale(domain, screenRange);
      this.canvasScale = getScale(domain, canvasRange);
      this.clipper = getClipper(min, max, step);
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      this.$canvas.addEventListener('mousedown', this._onMouseDown);
      this.$canvas.addEventListener('touchstart', this._onTouchStart);
    }
  }, {
    key: '_onStart',
    value: function _onStart(x, y) {
      var started = null;

      switch (this.params.mode) {
        case 'jump':
          this._updatePosition(x, y);
          started = true;
          break;
        case 'proportionnal':
          this._currentMousePosition.x = x;
          this._currentMousePosition.y = y;
          started = true;
          break;
        case 'handle':
          var orientation = this.params.orientation;
          var position = this.screenScale(this._value);
          var compare = orientation === 'horizontal' ? x : y;
          var delta = this.params.handleSize / 2;

          if (compare < position + delta && compare > position - delta) {
            this._currentMousePosition.x = x;
            this._currentMousePosition.y = y;
            started = true;
          } else {
            started = false;
          }
          break;
      }

      return started;
    }
  }, {
    key: '_onMove',
    value: function _onMove(x, y) {
      switch (this.params.mode) {
        case 'jump':
          break;
        case 'proportionnal':
        case 'handle':
          var deltaX = x - this._currentMousePosition.x;
          var deltaY = y - this._currentMousePosition.y;
          this._currentMousePosition.x = x;
          this._currentMousePosition.y = y;

          x = this.screenScale(this._value) + deltaX;
          y = this.screenScale(this._value) + deltaY;
          break;
      }

      this._updatePosition(x, y);
    }
  }, {
    key: '_onEnd',
    value: function _onEnd() {
      switch (this.params.mode) {
        case 'jump':
          break;
        case 'proportionnal':
        case 'handle':
          this._currentMousePosition.x = null;
          this._currentMousePosition.y = null;
          break;
      }
    }

    // mouse events

  }, {
    key: '_onMouseDown',
    value: function _onMouseDown(e) {
      var pageX = e.pageX;
      var pageY = e.pageY;
      var x = pageX - this._boundingClientRect.left;
      var y = pageY - this._boundingClientRect.top;

      if (this._onStart(x, y) === true) {
        window.addEventListener('mousemove', this._onMouseMove);
        window.addEventListener('mouseup', this._onMouseUp);
      }
    }
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(e) {
      e.preventDefault(); // prevent text selection

      var pageX = e.pageX;
      var pageY = e.pageY;
      var x = pageX - this._boundingClientRect.left;;
      var y = pageY - this._boundingClientRect.top;;

      this._onMove(x, y);
    }
  }, {
    key: '_onMouseUp',
    value: function _onMouseUp(e) {
      this._onEnd();

      window.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('mouseup', this._onMouseUp);
    }

    // touch events

  }, {
    key: '_onTouchStart',
    value: function _onTouchStart(e) {
      if (this._touchId !== null) return;

      var touch = e.touches[0];
      this._touchId = touch.identifier;

      var pageX = touch.pageX;
      var pageY = touch.pageY;
      var x = pageX - this._boundingClientRect.left;
      var y = pageY - this._boundingClientRect.top;

      if (this._onStart(x, y) === true) {
        window.addEventListener('touchmove', this._onTouchMove);
        window.addEventListener('touchend', this._onTouchEnd);
        window.addEventListener('touchcancel', this._onTouchEnd);
      }
    }
  }, {
    key: '_onTouchMove',
    value: function _onTouchMove(e) {
      var _this2 = this;

      e.preventDefault(); // prevent text selection

      var touches = Array.from(e.touches);
      var touch = touches.filter(function (t) {
        return t.identifier === _this2._touchId;
      })[0];

      if (touch) {
        var pageX = touch.pageX;
        var pageY = touch.pageY;
        var x = pageX - this._boundingClientRect.left;
        var y = pageY - this._boundingClientRect.top;

        this._onMove(x, y);
      }
    }
  }, {
    key: '_onTouchEnd',
    value: function _onTouchEnd(e) {
      var _this3 = this;

      var touches = Array.from(e.touches);
      var touch = touches.filter(function (t) {
        return t.identifier === _this3._touchId;
      })[0];

      if (touch === undefined) {
        this._onEnd();
        this._touchId = null;

        window.removeEventListener('touchmove', this._onTouchMove);
        window.removeEventListener('touchend', this._onTouchEnd);
        window.removeEventListener('touchcancel', this._onTouchEnd);
      }
    }
  }, {
    key: '_updatePosition',
    value: function _updatePosition(x, y) {
      var _params3 = this.params,
          orientation = _params3.orientation,
          height = _params3.height;

      var position = orientation === 'horizontal' ? x : y;
      var value = this.screenScale.invert(position);

      this._updateValue(value, false, true);
    }
  }, {
    key: '_render',
    value: function _render(clippedValue) {
      var _params4 = this.params,
          backgroundColor = _params4.backgroundColor,
          foregroundColor = _params4.foregroundColor,
          orientation = _params4.orientation;

      var canvasPosition = Math.round(this.canvasScale(clippedValue));
      var width = this._canvasWidth;
      var height = this._canvasHeight;
      var ctx = this.ctx;

      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // foreground
      ctx.fillStyle = foregroundColor;

      if (orientation === 'horizontal') ctx.fillRect(0, 0, canvasPosition, height);else ctx.fillRect(0, canvasPosition, width, height);

      // markers
      var markers = this.params.markers;

      for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        var position = this.canvasScale(marker);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();

        if (orientation === 'horizontal') {
          ctx.moveTo(position - 0.5, 1);
          ctx.lineTo(position - 0.5, height - 1);
        } else {
          ctx.moveTo(1, height - position + 0.5);
          ctx.lineTo(width - 1, height - position + 0.5);
        }

        ctx.closePath();
        ctx.stroke();
      }

      // handle mode
      if (this.params.mode === 'handle' && this.params.showHandle) {
        var delta = this.params.handleSize * this._pixelRatio / 2;
        var start = canvasPosition - delta;
        var end = canvasPosition + delta;

        ctx.globalAlpha = 1;
        ctx.fillStyle = this.params.handleColor;

        if (orientation === 'horizontal') {
          ctx.fillRect(start, 0, end - start, height);
        } else {
          ctx.fillRect(0, start, width, end - start);
        }
      }

      ctx.restore();
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    },
    set: function set(val) {
      // don't trigger the callback when value is set from outside
      this._updateValue(val, true, false);
    }
  }]);

  return Slider;
}();

exports.default = Slider;

},{}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Slider = require('./Slider');

Object.defineProperty(exports, 'Slider', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Slider).default;
  }
});

var _Breakpoint = require('./Breakpoint');

Object.defineProperty(exports, 'Breakpoint', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Breakpoint).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./Breakpoint":29,"./Slider":30}],32:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":43}],33:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":44}],34:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/get-prototype-of":45}],35:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":46}],36:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":47}],37:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":48}],38:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],39:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
},{"../core-js/object/define-property":33}],40:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _setPrototypeOf = require("../core-js/object/set-prototype-of");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require("../core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};
},{"../core-js/object/create":32,"../core-js/object/set-prototype-of":35,"../helpers/typeof":42}],41:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};
},{"../helpers/typeof":42}],42:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _iterator = require("../core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require("../core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
},{"../core-js/symbol":36,"../core-js/symbol/iterator":37}],43:[function(require,module,exports){
require('../../modules/es6.object.create');
var $Object = require('../../modules/_core').Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};

},{"../../modules/_core":54,"../../modules/es6.object.create":107}],44:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

},{"../../modules/_core":54,"../../modules/es6.object.define-property":108}],45:[function(require,module,exports){
require('../../modules/es6.object.get-prototype-of');
module.exports = require('../../modules/_core').Object.getPrototypeOf;

},{"../../modules/_core":54,"../../modules/es6.object.get-prototype-of":109}],46:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/_core').Object.setPrototypeOf;

},{"../../modules/_core":54,"../../modules/es6.object.set-prototype-of":110}],47:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
require('../../modules/es7.symbol.async-iterator');
require('../../modules/es7.symbol.observable');
module.exports = require('../../modules/_core').Symbol;

},{"../../modules/_core":54,"../../modules/es6.object.to-string":111,"../../modules/es6.symbol":113,"../../modules/es7.symbol.async-iterator":114,"../../modules/es7.symbol.observable":115}],48:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks-ext').f('iterator');

},{"../../modules/_wks-ext":104,"../../modules/es6.string.iterator":112,"../../modules/web.dom.iterable":116}],49:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],50:[function(require,module,exports){
module.exports = function () { /* empty */ };

},{}],51:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":70}],52:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":96,"./_to-iobject":98,"./_to-length":99}],53:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],54:[function(require,module,exports){
var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],55:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":49}],56:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],57:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":62}],58:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":63,"./_is-object":70}],59:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],60:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-gops":83,"./_object-keys":86,"./_object-pie":87}],61:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var has = require('./_has');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":54,"./_ctx":55,"./_global":63,"./_has":64,"./_hide":65}],62:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],63:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],64:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],65:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":57,"./_object-dp":78,"./_property-desc":89}],66:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":63}],67:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":57,"./_dom-create":58,"./_fails":62}],68:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":53}],69:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":53}],70:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],71:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":65,"./_object-create":77,"./_property-desc":89,"./_set-to-string-tag":92,"./_wks":105}],72:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":61,"./_hide":65,"./_iter-create":71,"./_iterators":74,"./_library":75,"./_object-gpo":84,"./_redefine":90,"./_set-to-string-tag":92,"./_wks":105}],73:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],74:[function(require,module,exports){
module.exports = {};

},{}],75:[function(require,module,exports){
module.exports = true;

},{}],76:[function(require,module,exports){
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":62,"./_has":64,"./_is-object":70,"./_object-dp":78,"./_uid":102}],77:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":51,"./_dom-create":58,"./_enum-bug-keys":59,"./_html":66,"./_object-dps":79,"./_shared-key":93}],78:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":51,"./_descriptors":57,"./_ie8-dom-define":67,"./_to-primitive":101}],79:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":51,"./_descriptors":57,"./_object-dp":78,"./_object-keys":86}],80:[function(require,module,exports){
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":57,"./_has":64,"./_ie8-dom-define":67,"./_object-pie":87,"./_property-desc":89,"./_to-iobject":98,"./_to-primitive":101}],81:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":82,"./_to-iobject":98}],82:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":59,"./_object-keys-internal":85}],83:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],84:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":64,"./_shared-key":93,"./_to-object":100}],85:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":52,"./_has":64,"./_shared-key":93,"./_to-iobject":98}],86:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":59,"./_object-keys-internal":85}],87:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],88:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_core":54,"./_export":61,"./_fails":62}],89:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],90:[function(require,module,exports){
module.exports = require('./_hide');

},{"./_hide":65}],91:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object');
var anObject = require('./_an-object');
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

},{"./_an-object":51,"./_ctx":55,"./_is-object":70,"./_object-gopd":80}],92:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":64,"./_object-dp":78,"./_wks":105}],93:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":94,"./_uid":102}],94:[function(require,module,exports){
var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":54,"./_global":63,"./_library":75}],95:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":56,"./_to-integer":97}],96:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":97}],97:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],98:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":56,"./_iobject":68}],99:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":97}],100:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":56}],101:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":70}],102:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],103:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":54,"./_global":63,"./_library":75,"./_object-dp":78,"./_wks-ext":104}],104:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":105}],105:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":63,"./_shared":94,"./_uid":102}],106:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":50,"./_iter-define":72,"./_iter-step":73,"./_iterators":74,"./_to-iobject":98}],107:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":61,"./_object-create":77}],108:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":57,"./_export":61,"./_object-dp":78}],109:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./_to-object');
var $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

},{"./_object-gpo":84,"./_object-sap":88,"./_to-object":100}],110:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":61,"./_set-proto":91}],111:[function(require,module,exports){

},{}],112:[function(require,module,exports){
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":72,"./_string-at":95}],113:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":51,"./_descriptors":57,"./_enum-keys":60,"./_export":61,"./_fails":62,"./_global":63,"./_has":64,"./_hide":65,"./_is-array":69,"./_is-object":70,"./_library":75,"./_meta":76,"./_object-create":77,"./_object-dp":78,"./_object-gopd":80,"./_object-gopn":82,"./_object-gopn-ext":81,"./_object-gops":83,"./_object-keys":86,"./_object-pie":87,"./_property-desc":89,"./_redefine":90,"./_set-to-string-tag":92,"./_shared":94,"./_to-iobject":98,"./_to-primitive":101,"./_uid":102,"./_wks":105,"./_wks-define":103,"./_wks-ext":104}],114:[function(require,module,exports){
require('./_wks-define')('asyncIterator');

},{"./_wks-define":103}],115:[function(require,module,exports){
require('./_wks-define')('observable');

},{"./_wks-define":103}],116:[function(require,module,exports){
require('./es6.array.iterator');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var TO_STRING_TAG = require('./_wks')('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./_global":63,"./_hide":65,"./_iterators":74,"./_wks":105,"./es6.array.iterator":106}],117:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],118:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":133}],119:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"core-js/library/fn/object/create":134,"dup":32}],120:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"core-js/library/fn/object/define-property":135,"dup":33}],121:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":136}],122:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"core-js/library/fn/object/get-prototype-of":137,"dup":34}],123:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"core-js/library/fn/object/set-prototype-of":138,"dup":35}],124:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/set"), __esModule: true };
},{"core-js/library/fn/set":139}],125:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"core-js/library/fn/symbol":140,"dup":36}],126:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"core-js/library/fn/symbol/iterator":141,"dup":37}],127:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"dup":38}],128:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"../core-js/object/define-property":120,"dup":39}],129:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _getPrototypeOf = require("../core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _getOwnPropertyDescriptor = require("../core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

  if (desc === undefined) {
    var parent = (0, _getPrototypeOf2.default)(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};
},{"../core-js/object/get-own-property-descriptor":121,"../core-js/object/get-prototype-of":122}],130:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"../core-js/object/create":119,"../core-js/object/set-prototype-of":123,"../helpers/typeof":132,"dup":40}],131:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"../helpers/typeof":132,"dup":41}],132:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"../core-js/symbol":125,"../core-js/symbol/iterator":126,"dup":42}],133:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');

},{"../modules/core.get-iterator":217,"../modules/es6.string.iterator":226,"../modules/web.dom.iterable":233}],134:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"../../modules/_core":156,"../../modules/es6.object.create":219,"dup":43}],135:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"../../modules/_core":156,"../../modules/es6.object.define-property":220,"dup":44}],136:[function(require,module,exports){
require('../../modules/es6.object.get-own-property-descriptor');
var $Object = require('../../modules/_core').Object;
module.exports = function getOwnPropertyDescriptor(it, key) {
  return $Object.getOwnPropertyDescriptor(it, key);
};

},{"../../modules/_core":156,"../../modules/es6.object.get-own-property-descriptor":221}],137:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"../../modules/_core":156,"../../modules/es6.object.get-prototype-of":222,"dup":45}],138:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"../../modules/_core":156,"../../modules/es6.object.set-prototype-of":223,"dup":46}],139:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.set');
require('../modules/es7.set.to-json');
require('../modules/es7.set.of');
require('../modules/es7.set.from');
module.exports = require('../modules/_core').Set;

},{"../modules/_core":156,"../modules/es6.object.to-string":224,"../modules/es6.set":225,"../modules/es6.string.iterator":226,"../modules/es7.set.from":228,"../modules/es7.set.of":229,"../modules/es7.set.to-json":230,"../modules/web.dom.iterable":233}],140:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"../../modules/_core":156,"../../modules/es6.object.to-string":224,"../../modules/es6.symbol":227,"../../modules/es7.symbol.async-iterator":231,"../../modules/es7.symbol.observable":232,"dup":47}],141:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"../../modules/_wks-ext":214,"../../modules/es6.string.iterator":226,"../../modules/web.dom.iterable":233,"dup":48}],142:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"dup":49}],143:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"dup":50}],144:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],145:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"./_is-object":174,"dup":51}],146:[function(require,module,exports){
var forOf = require('./_for-of');

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":165}],147:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"./_to-absolute-index":205,"./_to-iobject":207,"./_to-length":208,"dup":52}],148:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx');
var IObject = require('./_iobject');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":150,"./_ctx":157,"./_iobject":171,"./_to-length":208,"./_to-object":209}],149:[function(require,module,exports){
var isObject = require('./_is-object');
var isArray = require('./_is-array');
var SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-array":173,"./_is-object":174,"./_wks":215}],150:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":149}],151:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":152,"./_wks":215}],152:[function(require,module,exports){
arguments[4][53][0].apply(exports,arguments)
},{"dup":53}],153:[function(require,module,exports){
'use strict';
var dP = require('./_object-dp').f;
var create = require('./_object-create');
var redefineAll = require('./_redefine-all');
var ctx = require('./_ctx');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var $iterDefine = require('./_iter-define');
var step = require('./_iter-step');
var setSpecies = require('./_set-species');
var DESCRIPTORS = require('./_descriptors');
var fastKey = require('./_meta').fastKey;
var validate = require('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":144,"./_ctx":157,"./_descriptors":159,"./_for-of":165,"./_iter-define":177,"./_iter-step":178,"./_meta":181,"./_object-create":182,"./_object-dp":183,"./_redefine-all":195,"./_set-species":200,"./_validate-collection":212}],154:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof');
var from = require('./_array-from-iterable');
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

},{"./_array-from-iterable":146,"./_classof":151}],155:[function(require,module,exports){
'use strict';
var global = require('./_global');
var $export = require('./_export');
var meta = require('./_meta');
var fails = require('./_fails');
var hide = require('./_hide');
var redefineAll = require('./_redefine-all');
var forOf = require('./_for-of');
var anInstance = require('./_an-instance');
var isObject = require('./_is-object');
var setToStringTag = require('./_set-to-string-tag');
var dP = require('./_object-dp').f;
var each = require('./_array-methods')(0);
var DESCRIPTORS = require('./_descriptors');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  if (!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function (target, iterable) {
      anInstance(target, C, NAME, '_c');
      target._c = new Base();
      if (iterable != undefined) forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','), function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) hide(C.prototype, KEY, function (a, b) {
        anInstance(this, C, KEY);
        if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    IS_WEAK || dP(C.prototype, 'size', {
      get: function () {
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":144,"./_array-methods":148,"./_descriptors":159,"./_export":163,"./_fails":164,"./_for-of":165,"./_global":166,"./_hide":168,"./_is-object":174,"./_meta":181,"./_object-dp":183,"./_redefine-all":195,"./_set-to-string-tag":201}],156:[function(require,module,exports){
arguments[4][54][0].apply(exports,arguments)
},{"dup":54}],157:[function(require,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"./_a-function":142,"dup":55}],158:[function(require,module,exports){
arguments[4][56][0].apply(exports,arguments)
},{"dup":56}],159:[function(require,module,exports){
arguments[4][57][0].apply(exports,arguments)
},{"./_fails":164,"dup":57}],160:[function(require,module,exports){
arguments[4][58][0].apply(exports,arguments)
},{"./_global":166,"./_is-object":174,"dup":58}],161:[function(require,module,exports){
arguments[4][59][0].apply(exports,arguments)
},{"dup":59}],162:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"./_object-gops":188,"./_object-keys":191,"./_object-pie":192,"dup":60}],163:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"./_core":156,"./_ctx":157,"./_global":166,"./_has":167,"./_hide":168,"dup":61}],164:[function(require,module,exports){
arguments[4][62][0].apply(exports,arguments)
},{"dup":62}],165:[function(require,module,exports){
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":145,"./_ctx":157,"./_is-array-iter":172,"./_iter-call":175,"./_to-length":208,"./core.get-iterator-method":216}],166:[function(require,module,exports){
arguments[4][63][0].apply(exports,arguments)
},{"dup":63}],167:[function(require,module,exports){
arguments[4][64][0].apply(exports,arguments)
},{"dup":64}],168:[function(require,module,exports){
arguments[4][65][0].apply(exports,arguments)
},{"./_descriptors":159,"./_object-dp":183,"./_property-desc":194,"dup":65}],169:[function(require,module,exports){
arguments[4][66][0].apply(exports,arguments)
},{"./_global":166,"dup":66}],170:[function(require,module,exports){
arguments[4][67][0].apply(exports,arguments)
},{"./_descriptors":159,"./_dom-create":160,"./_fails":164,"dup":67}],171:[function(require,module,exports){
arguments[4][68][0].apply(exports,arguments)
},{"./_cof":152,"dup":68}],172:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":179,"./_wks":215}],173:[function(require,module,exports){
arguments[4][69][0].apply(exports,arguments)
},{"./_cof":152,"dup":69}],174:[function(require,module,exports){
arguments[4][70][0].apply(exports,arguments)
},{"dup":70}],175:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":145}],176:[function(require,module,exports){
arguments[4][71][0].apply(exports,arguments)
},{"./_hide":168,"./_object-create":182,"./_property-desc":194,"./_set-to-string-tag":201,"./_wks":215,"dup":71}],177:[function(require,module,exports){
arguments[4][72][0].apply(exports,arguments)
},{"./_export":163,"./_hide":168,"./_iter-create":176,"./_iterators":179,"./_library":180,"./_object-gpo":189,"./_redefine":196,"./_set-to-string-tag":201,"./_wks":215,"dup":72}],178:[function(require,module,exports){
arguments[4][73][0].apply(exports,arguments)
},{"dup":73}],179:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"dup":74}],180:[function(require,module,exports){
arguments[4][75][0].apply(exports,arguments)
},{"dup":75}],181:[function(require,module,exports){
arguments[4][76][0].apply(exports,arguments)
},{"./_fails":164,"./_has":167,"./_is-object":174,"./_object-dp":183,"./_uid":211,"dup":76}],182:[function(require,module,exports){
arguments[4][77][0].apply(exports,arguments)
},{"./_an-object":145,"./_dom-create":160,"./_enum-bug-keys":161,"./_html":169,"./_object-dps":184,"./_shared-key":202,"dup":77}],183:[function(require,module,exports){
arguments[4][78][0].apply(exports,arguments)
},{"./_an-object":145,"./_descriptors":159,"./_ie8-dom-define":170,"./_to-primitive":210,"dup":78}],184:[function(require,module,exports){
arguments[4][79][0].apply(exports,arguments)
},{"./_an-object":145,"./_descriptors":159,"./_object-dp":183,"./_object-keys":191,"dup":79}],185:[function(require,module,exports){
arguments[4][80][0].apply(exports,arguments)
},{"./_descriptors":159,"./_has":167,"./_ie8-dom-define":170,"./_object-pie":192,"./_property-desc":194,"./_to-iobject":207,"./_to-primitive":210,"dup":80}],186:[function(require,module,exports){
arguments[4][81][0].apply(exports,arguments)
},{"./_object-gopn":187,"./_to-iobject":207,"dup":81}],187:[function(require,module,exports){
arguments[4][82][0].apply(exports,arguments)
},{"./_enum-bug-keys":161,"./_object-keys-internal":190,"dup":82}],188:[function(require,module,exports){
arguments[4][83][0].apply(exports,arguments)
},{"dup":83}],189:[function(require,module,exports){
arguments[4][84][0].apply(exports,arguments)
},{"./_has":167,"./_shared-key":202,"./_to-object":209,"dup":84}],190:[function(require,module,exports){
arguments[4][85][0].apply(exports,arguments)
},{"./_array-includes":147,"./_has":167,"./_shared-key":202,"./_to-iobject":207,"dup":85}],191:[function(require,module,exports){
arguments[4][86][0].apply(exports,arguments)
},{"./_enum-bug-keys":161,"./_object-keys-internal":190,"dup":86}],192:[function(require,module,exports){
arguments[4][87][0].apply(exports,arguments)
},{"dup":87}],193:[function(require,module,exports){
arguments[4][88][0].apply(exports,arguments)
},{"./_core":156,"./_export":163,"./_fails":164,"dup":88}],194:[function(require,module,exports){
arguments[4][89][0].apply(exports,arguments)
},{"dup":89}],195:[function(require,module,exports){
var hide = require('./_hide');
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

},{"./_hide":168}],196:[function(require,module,exports){
arguments[4][90][0].apply(exports,arguments)
},{"./_hide":168,"dup":90}],197:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = require('./_export');
var aFunction = require('./_a-function');
var ctx = require('./_ctx');
var forOf = require('./_for-of');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};

},{"./_a-function":142,"./_ctx":157,"./_export":163,"./_for-of":165}],198:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = require('./_export');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = new Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};

},{"./_export":163}],199:[function(require,module,exports){
arguments[4][91][0].apply(exports,arguments)
},{"./_an-object":145,"./_ctx":157,"./_is-object":174,"./_object-gopd":185,"dup":91}],200:[function(require,module,exports){
'use strict';
var global = require('./_global');
var core = require('./_core');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_core":156,"./_descriptors":159,"./_global":166,"./_object-dp":183,"./_wks":215}],201:[function(require,module,exports){
arguments[4][92][0].apply(exports,arguments)
},{"./_has":167,"./_object-dp":183,"./_wks":215,"dup":92}],202:[function(require,module,exports){
arguments[4][93][0].apply(exports,arguments)
},{"./_shared":203,"./_uid":211,"dup":93}],203:[function(require,module,exports){
arguments[4][94][0].apply(exports,arguments)
},{"./_core":156,"./_global":166,"./_library":180,"dup":94}],204:[function(require,module,exports){
arguments[4][95][0].apply(exports,arguments)
},{"./_defined":158,"./_to-integer":206,"dup":95}],205:[function(require,module,exports){
arguments[4][96][0].apply(exports,arguments)
},{"./_to-integer":206,"dup":96}],206:[function(require,module,exports){
arguments[4][97][0].apply(exports,arguments)
},{"dup":97}],207:[function(require,module,exports){
arguments[4][98][0].apply(exports,arguments)
},{"./_defined":158,"./_iobject":171,"dup":98}],208:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"./_to-integer":206,"dup":99}],209:[function(require,module,exports){
arguments[4][100][0].apply(exports,arguments)
},{"./_defined":158,"dup":100}],210:[function(require,module,exports){
arguments[4][101][0].apply(exports,arguments)
},{"./_is-object":174,"dup":101}],211:[function(require,module,exports){
arguments[4][102][0].apply(exports,arguments)
},{"dup":102}],212:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":174}],213:[function(require,module,exports){
arguments[4][103][0].apply(exports,arguments)
},{"./_core":156,"./_global":166,"./_library":180,"./_object-dp":183,"./_wks-ext":214,"dup":103}],214:[function(require,module,exports){
arguments[4][104][0].apply(exports,arguments)
},{"./_wks":215,"dup":104}],215:[function(require,module,exports){
arguments[4][105][0].apply(exports,arguments)
},{"./_global":166,"./_shared":203,"./_uid":211,"dup":105}],216:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":151,"./_core":156,"./_iterators":179,"./_wks":215}],217:[function(require,module,exports){
var anObject = require('./_an-object');
var get = require('./core.get-iterator-method');
module.exports = require('./_core').getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

},{"./_an-object":145,"./_core":156,"./core.get-iterator-method":216}],218:[function(require,module,exports){
arguments[4][106][0].apply(exports,arguments)
},{"./_add-to-unscopables":143,"./_iter-define":177,"./_iter-step":178,"./_iterators":179,"./_to-iobject":207,"dup":106}],219:[function(require,module,exports){
arguments[4][107][0].apply(exports,arguments)
},{"./_export":163,"./_object-create":182,"dup":107}],220:[function(require,module,exports){
arguments[4][108][0].apply(exports,arguments)
},{"./_descriptors":159,"./_export":163,"./_object-dp":183,"dup":108}],221:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./_to-iobject');
var $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

},{"./_object-gopd":185,"./_object-sap":193,"./_to-iobject":207}],222:[function(require,module,exports){
arguments[4][109][0].apply(exports,arguments)
},{"./_object-gpo":189,"./_object-sap":193,"./_to-object":209,"dup":109}],223:[function(require,module,exports){
arguments[4][110][0].apply(exports,arguments)
},{"./_export":163,"./_set-proto":199,"dup":110}],224:[function(require,module,exports){
arguments[4][111][0].apply(exports,arguments)
},{"dup":111}],225:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var SET = 'Set';

// 23.2 Set Objects
module.exports = require('./_collection')(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":155,"./_collection-strong":153,"./_validate-collection":212}],226:[function(require,module,exports){
arguments[4][112][0].apply(exports,arguments)
},{"./_iter-define":177,"./_string-at":204,"dup":112}],227:[function(require,module,exports){
arguments[4][113][0].apply(exports,arguments)
},{"./_an-object":145,"./_descriptors":159,"./_enum-keys":162,"./_export":163,"./_fails":164,"./_global":166,"./_has":167,"./_hide":168,"./_is-array":173,"./_is-object":174,"./_library":180,"./_meta":181,"./_object-create":182,"./_object-dp":183,"./_object-gopd":185,"./_object-gopn":187,"./_object-gopn-ext":186,"./_object-gops":188,"./_object-keys":191,"./_object-pie":192,"./_property-desc":194,"./_redefine":196,"./_set-to-string-tag":201,"./_shared":203,"./_to-iobject":207,"./_to-primitive":210,"./_uid":211,"./_wks":215,"./_wks-define":213,"./_wks-ext":214,"dup":113}],228:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
require('./_set-collection-from')('Set');

},{"./_set-collection-from":197}],229:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
require('./_set-collection-of')('Set');

},{"./_set-collection-of":198}],230:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Set', { toJSON: require('./_collection-to-json')('Set') });

},{"./_collection-to-json":154,"./_export":163}],231:[function(require,module,exports){
arguments[4][114][0].apply(exports,arguments)
},{"./_wks-define":213,"dup":114}],232:[function(require,module,exports){
arguments[4][115][0].apply(exports,arguments)
},{"./_wks-define":213,"dup":115}],233:[function(require,module,exports){
arguments[4][116][0].apply(exports,arguments)
},{"./_global":166,"./_hide":168,"./_iterators":179,"./_wks":215,"./es6.array.iterator":218,"dup":116}],234:[function(require,module,exports){
(function (process){
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

}).call(this,require('_process'))

},{"./debug":235,"_process":117}],235:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":236}],236:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9kaXN0L2NvcmUvUHJpb3JpdHlRdWV1ZS5qcyIsIi4uLy4uL2Rpc3QvY29yZS9TY2hlZHVsaW5nUXVldWUuanMiLCIuLi8uLi9kaXN0L2NvcmUvVGltZUVuZ2luZS5qcyIsIi4uLy4uL2Rpc3QvaW5kZXguanMiLCIuLi8uLi9kaXN0L21hc3RlcnMvUGxheUNvbnRyb2wuanMiLCIuLi8uLi9kaXN0L21hc3RlcnMvU2NoZWR1bGVyLmpzIiwiLi4vLi4vZGlzdC9tYXN0ZXJzL1NpbXBsZVNjaGVkdWxlci5qcyIsIi4uLy4uL2Rpc3QvbWFzdGVycy9UcmFuc3BvcnQuanMiLCJkaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL0BpcmNhbS9iYXNpYy1jb250cm9sbGVycy9kaXN0L2NvbXBvbmVudHMvQmFzZUNvbXBvbmVudC5qcyIsIm5vZGVfbW9kdWxlcy9AaXJjYW0vYmFzaWMtY29udHJvbGxlcnMvZGlzdC9jb21wb25lbnRzL0RyYWdBbmREcm9wLmpzIiwibm9kZV9tb2R1bGVzL0BpcmNhbS9iYXNpYy1jb250cm9sbGVycy9kaXN0L2NvbXBvbmVudHMvR3JvdXAuanMiLCJub2RlX21vZHVsZXMvQGlyY2FtL2Jhc2ljLWNvbnRyb2xsZXJzL2Rpc3QvY29tcG9uZW50cy9OdW1iZXJCb3guanMiLCJub2RlX21vZHVsZXMvQGlyY2FtL2Jhc2ljLWNvbnRyb2xsZXJzL2Rpc3QvY29tcG9uZW50cy9TZWxlY3RCdXR0b25zLmpzIiwibm9kZV9tb2R1bGVzL0BpcmNhbS9iYXNpYy1jb250cm9sbGVycy9kaXN0L2NvbXBvbmVudHMvU2VsZWN0TGlzdC5qcyIsIm5vZGVfbW9kdWxlcy9AaXJjYW0vYmFzaWMtY29udHJvbGxlcnMvZGlzdC9jb21wb25lbnRzL1NsaWRlci5qcyIsIm5vZGVfbW9kdWxlcy9AaXJjYW0vYmFzaWMtY29udHJvbGxlcnMvZGlzdC9jb21wb25lbnRzL1RleHQuanMiLCJub2RlX21vZHVsZXMvQGlyY2FtL2Jhc2ljLWNvbnRyb2xsZXJzL2Rpc3QvY29tcG9uZW50cy9UaXRsZS5qcyIsIm5vZGVfbW9kdWxlcy9AaXJjYW0vYmFzaWMtY29udHJvbGxlcnMvZGlzdC9jb21wb25lbnRzL1RvZ2dsZS5qcyIsIm5vZGVfbW9kdWxlcy9AaXJjYW0vYmFzaWMtY29udHJvbGxlcnMvZGlzdC9jb21wb25lbnRzL1RyaWdnZXJCdXR0b25zLmpzIiwibm9kZV9tb2R1bGVzL0BpcmNhbS9iYXNpYy1jb250cm9sbGVycy9kaXN0L2ZhY3RvcnkuanMiLCJub2RlX21vZHVsZXMvQGlyY2FtL2Jhc2ljLWNvbnRyb2xsZXJzL2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvQGlyY2FtL2Jhc2ljLWNvbnRyb2xsZXJzL2Rpc3QvbWl4aW5zL2NvbnRhaW5lci5qcyIsIm5vZGVfbW9kdWxlcy9AaXJjYW0vYmFzaWMtY29udHJvbGxlcnMvZGlzdC9taXhpbnMvZGlzcGxheS5qcyIsIm5vZGVfbW9kdWxlcy9AaXJjYW0vYmFzaWMtY29udHJvbGxlcnMvZGlzdC91dGlscy9lbGVtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9AaXJjYW0vYmFzaWMtY29udHJvbGxlcnMvZGlzdC91dGlscy9zdHlsZXMtZGVjbGFyYXRpb25zLmpzIiwibm9kZV9tb2R1bGVzL0BpcmNhbS9iYXNpYy1jb250cm9sbGVycy9kaXN0L3V0aWxzL3N0eWxlcy5qcyIsIm5vZGVfbW9kdWxlcy9AaXJjYW0vYmFzaWMtY29udHJvbGxlcnMvcGFja2FnZS5qc29uIiwibm9kZV9tb2R1bGVzL0BpcmNhbS9ndWktY29tcG9uZW50cy9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L3NldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvc3ltYm9sL2l0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy90eXBlb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2EtZnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FkZC10by11bnNjb3BhYmxlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLXN0ZXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbWV0YS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcG4tZXh0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLWludGVybmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LXBpZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LXNhcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC1wcm90by5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXRvLXN0cmluZy10YWcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MtZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MtZXh0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZGVmaW5lLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnNldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zeW1ib2wuYXN5bmMtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnN5bWJvbC5vYnNlcnZhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9nZXQtaXRlcmF0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3NldC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvZ2V0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9nZXQtaXRlcmF0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL3NldC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4taW5zdGFuY2UuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWZyb20taXRlcmFibGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LW1ldGhvZHMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY3JlYXRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jbGFzc29mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb2xsZWN0aW9uLXN0cm9uZy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29sbGVjdGlvbi10by1qc29uLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb2xsZWN0aW9uLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mb3Itb2YuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUtYWxsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtY29sbGVjdGlvbi1mcm9tLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtY29sbGVjdGlvbi1vZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3ZhbGlkYXRlLWNvbGxlY3Rpb24uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zZXQuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnNldC5mcm9tLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zZXQub2YuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnNldC50by1qc29uLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9icm93c2VyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9kZWJ1Zy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBLFNBQVMsSUFBVCxDQUFjLEdBQWQsRUFBbUIsRUFBbkIsRUFBdUIsRUFBdkIsRUFBMkI7QUFDekIsTUFBTSxNQUFNLElBQUksRUFBSixDQUFaO0FBQ0EsTUFBSSxFQUFKLElBQVUsSUFBSSxFQUFKLENBQVY7QUFDQSxNQUFJLEVBQUosSUFBVSxHQUFWO0FBQ0Q7O0FBRUQ7QUFDQSxTQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0IsRUFBdEIsRUFBMEI7QUFDeEIsTUFBTSxJQUFJLElBQUksTUFBZDtBQUNBO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLENBQXBCLEVBQXVCLEdBQXZCLEVBQTRCO0FBQzFCLFFBQUksSUFBSSxDQUFKLE1BQVcsRUFBZixFQUFtQjtBQUNqQixhQUFPLENBQVA7QUFDRDtBQUNGOztBQUVELFNBQU8sQ0FBQyxDQUFSO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztBQVNBLElBQU0sa0JBQWtCLFNBQWxCLGVBQWtCLENBQVMsS0FBVCxFQUFnQixLQUFoQixFQUF1QjtBQUM3QyxTQUFPLFFBQVEsS0FBZjtBQUNELENB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFPQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNkQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyB3b3JrcyBieSByZWZlcmVuY2VcbmZ1bmN0aW9uIHN3YXAoYXJyLCBpMSwgaTIpIHtcbiAgY29uc3QgdG1wID0gYXJyW2kxXTtcbiAgYXJyW2kxXSA9IGFycltpMl07XG4gIGFycltpMl0gPSB0bXA7XG59XG5cbi8vIGh0dHBzOi8vanNwZXJmLmNvbS9qcy1mb3ItbG9vcC12cy1hcnJheS1pbmRleG9mLzM0NlxuZnVuY3Rpb24gaW5kZXhPZihhcnIsIGVsKSB7XG4gIGNvbnN0IGwgPSBhcnIubGVuZ3RoO1xuICAvLyBpZ25vcmUgZmlyc3QgZWxlbWVudCBhcyBpdCBjYW4ndCBiZSBhIGVudHJ5XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKGFycltpXSA9PT0gZWwpIHtcbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBEZWZpbmUgaWYgYHRpbWUxYCBzaG91bGQgYmUgbG93ZXIgaW4gdGhlIHRvcG9ncmFwaHkgdGhhbiBgdGltZTJgLlxuICogSXMgZHluYW1pY2FsbHkgYWZmZWN0ZWQgdG8gdGhlIHByaW9yaXR5IHF1ZXVlIGFjY29yZGluZyB0byBoYW5kbGUgYG1pbmAgYW5kIGBtYXhgIGhlYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lMVxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5jb25zdCBfaXNMb3dlck1heEhlYXAgPSBmdW5jdGlvbih0aW1lMSwgdGltZTIpIHtcbiAgcmV0dXJuIHRpbWUxIDwgdGltZTI7XG59O1xuXG5jb25zdCBfaXNMb3dlck1pbkhlYXAgPSBmdW5jdGlvbih0aW1lMSwgdGltZTIpIHtcbiAgcmV0dXJuIHRpbWUxID4gdGltZTI7XG59O1xuXG4vKipcbiAqIERlZmluZSBpZiBgdGltZTFgIHNob3VsZCBiZSBoaWdoZXIgaW4gdGhlIHRvcG9ncmFwaHkgdGhhbiBgdGltZTJgLlxuICogSXMgZHluYW1pY2FsbHkgYWZmZWN0ZWQgdG8gdGhlIHByaW9yaXR5IHF1ZXVlIGFjY29yZGluZyB0byBoYW5kbGUgYG1pbmAgYW5kIGBtYXhgIGhlYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lMVxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5jb25zdCBfaXNIaWdoZXJNYXhIZWFwID0gZnVuY3Rpb24odGltZTEsIHRpbWUyKSB7XG4gIHJldHVybiB0aW1lMSA+IHRpbWUyO1xufTtcblxuY29uc3QgX2lzSGlnaGVyTWluSGVhcCA9IGZ1bmN0aW9uKHRpbWUxLCB0aW1lMikge1xuICByZXR1cm4gdGltZTEgPCB0aW1lMjtcbn07XG5cbmNvbnN0IFBPU0lUSVZFX0lORklOSVRZID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuXG4vKipcbiAqIFByaW9yaXR5IHF1ZXVlIGltcGxlbWVudGluZyBhIGJpbmFyeSBoZWFwLlxuICogQWN0cyBhcyBhIG1pbiBoZWFwIGJ5IGRlZmF1bHQsIGNhbiBiZSBkeW5hbWljYWxseSBjaGFuZ2VkIHRvIGEgbWF4IGhlYXBcbiAqIGJ5IHNldHRpbmcgYHJldmVyc2VgIHRvIHRydWUuXG4gKlxuICogX25vdGVfOiB0aGUgcXVldWUgY3JlYXRlcyBhbmQgbWFpbnRhaW5zIGEgbmV3IHByb3BlcnR5IChpLmUuIGBxdWV1ZVRpbWVgKVxuICogdG8gZWFjaCBvYmplY3QgYWRkZWQuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IFtoZWFwTGVuZ3RoPTEwMF0gLSBEZWZhdWx0IHNpemUgb2YgdGhlIGFycmF5IHVzZWQgdG8gY3JlYXRlIHRoZSBoZWFwLlxuICovXG5jbGFzcyBQcmlvcml0eVF1ZXVlIHtcbiAgY29uc3RydWN0b3IoaGVhcExlbmd0aCA9IDEwMCkge1xuICAgIC8qKlxuICAgICAqIFBvaW50ZXIgdG8gdGhlIGZpcnN0IGVtcHR5IGluZGV4IG9mIHRoZSBoZWFwLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG1lbWJlcm9mIFByaW9yaXR5UXVldWVcbiAgICAgKiBAbmFtZSBfY3VycmVudExlbmd0aFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fY3VycmVudExlbmd0aCA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiB0aGUgc29ydGVkIGluZGV4ZXMgb2YgdGhlIGVudHJpZXMsIHRoZSBhY3R1YWwgaGVhcC4gSWdub3JlIHRoZSBpbmRleCAwLlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKiBAbWVtYmVyb2YgUHJpb3JpdHlRdWV1ZVxuICAgICAqIEBuYW1lIF9oZWFwXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9oZWFwID0gbmV3IEFycmF5KGhlYXBMZW5ndGggKyAxKTtcblxuICAgIC8qKlxuICAgICAqIFR5cGUgb2YgdGhlIHF1ZXVlOiBgbWluYCBoZWFwIGlmIGBmYWxzZWAsIGBtYXhgIGhlYXAgaWYgYHRydWVgXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG1lbWJlcm9mIFByaW9yaXR5UXVldWVcbiAgICAgKiBAbmFtZSBfcmV2ZXJzZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fcmV2ZXJzZSA9IG51bGw7XG5cbiAgICAvLyBpbml0aWFsaXplIGNvbXBhcmUgZnVuY3Rpb25zXG4gICAgdGhpcy5yZXZlcnNlID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogVGltZSBvZiB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgYmluYXJ5IGhlYXAuXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdGltZSgpIHtcbiAgICBpZiAodGhpcy5fY3VycmVudExlbmd0aCA+IDEpXG4gICAgICByZXR1cm4gdGhpcy5faGVhcFsxXS5xdWV1ZVRpbWU7XG5cbiAgICByZXR1cm4gSW5maW5pdHk7XG4gIH1cblxuICAvKipcbiAgICogRmlyc3QgZWxlbWVudCBpbiB0aGUgYmluYXJ5IGhlYXAuXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IGhlYWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYXBbMV07XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlIHRoZSBvcmRlciBvZiB0aGUgcXVldWUgKG1heCBoZWFwIGlmIHRydWUsIG1pbiBoZWFwIGlmIGZhbHNlKSxcbiAgICogcmVidWlsZCB0aGUgaGVhcCB3aXRoIHRoZSBleGlzdGluZyBlbnRyaWVzLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHNldCByZXZlcnNlKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9yZXZlcnNlKSB7XG4gICAgICB0aGlzLl9yZXZlcnNlID0gdmFsdWU7XG5cbiAgICAgIGlmICh0aGlzLl9yZXZlcnNlID09PSB0cnVlKSB7XG4gICAgICAgIHRoaXMuX2lzTG93ZXIgPSBfaXNMb3dlck1heEhlYXA7XG4gICAgICAgIHRoaXMuX2lzSGlnaGVyID0gX2lzSGlnaGVyTWF4SGVhcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2lzTG93ZXIgPSBfaXNMb3dlck1pbkhlYXA7XG4gICAgICAgIHRoaXMuX2lzSGlnaGVyID0gX2lzSGlnaGVyTWluSGVhcDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5idWlsZEhlYXAoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgcmV2ZXJzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmV2ZXJzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXggdGhlIGhlYXAgYnkgbW92aW5nIGFuIGVudHJ5IHRvIGEgbmV3IHVwcGVyIHBvc2l0aW9uLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnRJbmRleCAtIFRoZSBpbmRleCBvZiB0aGUgZW50cnkgdG8gbW92ZS5cbiAgICovXG4gIF9idWJibGVVcChzdGFydEluZGV4KSB7XG4gICAgbGV0IGVudHJ5ID0gdGhpcy5faGVhcFtzdGFydEluZGV4XTtcblxuICAgIGxldCBpbmRleCA9IHN0YXJ0SW5kZXg7XG4gICAgbGV0IHBhcmVudEluZGV4ID0gTWF0aC5mbG9vcihpbmRleCAvIDIpO1xuICAgIGxldCBwYXJlbnQgPSB0aGlzLl9oZWFwW3BhcmVudEluZGV4XTtcblxuICAgIHdoaWxlIChwYXJlbnQgJiYgdGhpcy5faXNIaWdoZXIoZW50cnkucXVldWVUaW1lLCBwYXJlbnQucXVldWVUaW1lKSkge1xuICAgICAgc3dhcCh0aGlzLl9oZWFwLCBpbmRleCwgcGFyZW50SW5kZXgpO1xuXG4gICAgICBpbmRleCA9IHBhcmVudEluZGV4O1xuICAgICAgcGFyZW50SW5kZXggPSBNYXRoLmZsb29yKGluZGV4IC8gMik7XG4gICAgICBwYXJlbnQgPSB0aGlzLl9oZWFwW3BhcmVudEluZGV4XTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRml4IHRoZSBoZWFwIGJ5IG1vdmluZyBhbiBlbnRyeSB0byBhIG5ldyBsb3dlciBwb3NpdGlvbi5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0SW5kZXggLSBUaGUgaW5kZXggb2YgdGhlIGVudHJ5IHRvIG1vdmUuXG4gICAqL1xuICBfYnViYmxlRG93bihzdGFydEluZGV4KSB7XG4gICAgbGV0IGVudHJ5ID0gdGhpcy5faGVhcFtzdGFydEluZGV4XTtcblxuICAgIGxldCBpbmRleCA9IHN0YXJ0SW5kZXg7XG4gICAgbGV0IGMxaW5kZXggPSBpbmRleCAqIDI7XG4gICAgbGV0IGMyaW5kZXggPSBjMWluZGV4ICsgMTtcbiAgICBsZXQgY2hpbGQxID0gdGhpcy5faGVhcFtjMWluZGV4XTtcbiAgICBsZXQgY2hpbGQyID0gdGhpcy5faGVhcFtjMmluZGV4XTtcblxuICAgIHdoaWxlICgoY2hpbGQxICYmIHRoaXMuX2lzTG93ZXIoZW50cnkucXVldWVUaW1lLCBjaGlsZDEucXVldWVUaW1lKSnCoHx8XG4gICAgICAgICAgIChjaGlsZDIgJiYgdGhpcy5faXNMb3dlcihlbnRyeS5xdWV1ZVRpbWUsIGNoaWxkMi5xdWV1ZVRpbWUpKSlcbiAgICB7XG4gICAgICAvLyBzd2FwIHdpdGggdGhlIG1pbmltdW0gY2hpbGRcbiAgICAgIGxldCB0YXJnZXRJbmRleDtcblxuICAgICAgaWYgKGNoaWxkMilcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLl9pc0hpZ2hlcihjaGlsZDEucXVldWVUaW1lLCBjaGlsZDIucXVldWVUaW1lKSA/IGMxaW5kZXggOiBjMmluZGV4O1xuICAgICAgZWxzZVxuICAgICAgICB0YXJnZXRJbmRleCA9IGMxaW5kZXg7XG5cbiAgICAgIHN3YXAodGhpcy5faGVhcCwgaW5kZXgsIHRhcmdldEluZGV4KTtcblxuICAgICAgLy8gdXBkYXRlIHRvIGZpbmQgbmV4dCBjaGlsZHJlblxuICAgICAgaW5kZXggPSB0YXJnZXRJbmRleDtcbiAgICAgIGMxaW5kZXggPSBpbmRleCAqIDI7XG4gICAgICBjMmluZGV4ID0gYzFpbmRleCArIDE7XG4gICAgICBjaGlsZDEgPSB0aGlzLl9oZWFwW2MxaW5kZXhdO1xuICAgICAgY2hpbGQyID0gdGhpcy5faGVhcFtjMmluZGV4XTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQnVpbGQgdGhlIGhlYXAgKGZyb20gYm90dG9tIHVwKS5cbiAgICovXG4gIGJ1aWxkSGVhcCgpIHtcbiAgICAvLyBmaW5kIHRoZSBpbmRleCBvZiB0aGUgbGFzdCBpbnRlcm5hbCBub2RlXG4gICAgLy8gQHRvZG8gLSBtYWtlIHN1cmUgdGhhdCdzIHRoZSByaWdodCB3YXkgdG8gZG8uXG4gICAgbGV0IG1heEluZGV4ID0gTWF0aC5mbG9vcigodGhpcy5fY3VycmVudExlbmd0aCAtIDEpIC8gMik7XG5cbiAgICBmb3IgKGxldCBpID0gbWF4SW5kZXg7IGkgPiAwOyBpLS0pXG4gICAgICB0aGlzLl9idWJibGVEb3duKGkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCBhIG5ldyBvYmplY3QgaW4gdGhlIGJpbmFyeSBoZWFwIGFuZCBzb3J0IGl0LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZW50cnkgLSBFbnRyeSB0byBpbnNlcnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIC0gVGltZSBhdCB3aGljaCB0aGUgZW50cnkgc2hvdWxkIGJlIG9yZGVyZXIuXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IC0gVGltZSBvZiB0aGUgZmlyc3QgZW50cnkgaW4gdGhlIGhlYXAuXG4gICAqL1xuICBpbnNlcnQoZW50cnksIHRpbWUpIHtcbiAgICBpZiAoTWF0aC5hYnModGltZSkgIT09IFBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgICBlbnRyeS5xdWV1ZVRpbWUgPSB0aW1lO1xuICAgICAgLy8gYWRkIHRoZSBuZXcgZW50cnkgYXQgdGhlIGVuZCBvZiB0aGUgaGVhcFxuICAgICAgdGhpcy5faGVhcFt0aGlzLl9jdXJyZW50TGVuZ3RoXSA9IGVudHJ5O1xuICAgICAgLy8gYnViYmxlIGl0IHVwXG4gICAgICB0aGlzLl9idWJibGVVcCh0aGlzLl9jdXJyZW50TGVuZ3RoKTtcbiAgICAgIHRoaXMuX2N1cnJlbnRMZW5ndGggKz0gMTtcblxuICAgICAgcmV0dXJuIHRoaXMudGltZTtcbiAgICB9XG5cbiAgICBlbnRyeS5xdWV1ZVRpbWUgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHRoaXMucmVtb3ZlKGVudHJ5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlIGEgZ2l2ZW4gZW50cnkgdG8gYSBuZXcgcG9zaXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbnRyeSAtIEVudHJ5IHRvIG1vdmUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIC0gVGltZSBhdCB3aGljaCB0aGUgZW50cnkgc2hvdWxkIGJlIG9yZGVyZXIuXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBUaW1lIG9mIGZpcnN0IGVudHJ5IGluIHRoZSBoZWFwLlxuICAgKi9cbiAgbW92ZShlbnRyeSwgdGltZSkge1xuICAgIGlmIChNYXRoLmFicyh0aW1lKSAhPT0gUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gaW5kZXhPZih0aGlzLl9oZWFwLCBlbnRyeSk7XG5cbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgZW50cnkucXVldWVUaW1lID0gdGltZTtcbiAgICAgICAgLy8gZGVmaW5lIGlmIHRoZSBlbnRyeSBzaG91bGQgYmUgYnViYmxlZCB1cCBvciBkb3duXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX2hlYXBbTWF0aC5mbG9vcihpbmRleCAvIDIpXTtcblxuICAgICAgICBpZiAocGFyZW50ICYmIHRoaXMuX2lzSGlnaGVyKHRpbWUsIHBhcmVudC5xdWV1ZVRpbWUpKVxuICAgICAgICAgIHRoaXMuX2J1YmJsZVVwKGluZGV4KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRoaXMuX2J1YmJsZURvd24oaW5kZXgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy50aW1lO1xuICAgIH1cblxuICAgIGVudHJ5LnF1ZXVlVGltZSA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gdGhpcy5yZW1vdmUoZW50cnkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBlbnRyeSBmcm9tIHRoZSBoZWFwIGFuZCBmaXggdGhlIGhlYXAuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbnRyeSAtIEVudHJ5IHRvIHJlbW92ZS5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIFRpbWUgb2YgZmlyc3QgZW50cnkgaW4gdGhlIGhlYXAuXG4gICAqL1xuICByZW1vdmUoZW50cnkpIHtcbiAgICAvLyBmaW5kIHRoZSBpbmRleCBvZiB0aGUgZW50cnlcbiAgICBjb25zdCBpbmRleCA9IGluZGV4T2YodGhpcy5faGVhcCwgZW50cnkpO1xuXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgY29uc3QgbGFzdEluZGV4ID0gdGhpcy5fY3VycmVudExlbmd0aCAtIDE7XG5cbiAgICAgIC8vIGlmIHRoZSBlbnRyeSBpcyB0aGUgbGFzdCBvbmVcbiAgICAgIGlmIChpbmRleCA9PT0gbGFzdEluZGV4KSB7XG4gICAgICAgIC8vIHJlbW92ZSB0aGUgZWxlbWVudCBmcm9tIGhlYXBcbiAgICAgICAgdGhpcy5faGVhcFtsYXN0SW5kZXhdID0gdW5kZWZpbmVkO1xuICAgICAgICAvLyB1cGRhdGUgY3VycmVudCBsZW5ndGhcbiAgICAgICAgdGhpcy5fY3VycmVudExlbmd0aCA9IGxhc3RJbmRleDtcblxuICAgICAgICByZXR1cm4gdGhpcy50aW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc3dhcCB3aXRoIHRoZSBsYXN0IGVsZW1lbnQgb2YgdGhlIGhlYXBcbiAgICAgICAgc3dhcCh0aGlzLl9oZWFwLCBpbmRleCwgbGFzdEluZGV4KTtcbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBlbGVtZW50IGZyb20gaGVhcFxuICAgICAgICB0aGlzLl9oZWFwW2xhc3RJbmRleF0gPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSAxKSB7XG4gICAgICAgICAgdGhpcy5fYnViYmxlRG93bigxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBidWJibGUgdGhlIChleCBsYXN0KSBlbGVtZW50IHVwIG9yIGRvd24gYWNjb3JkaW5nIHRvIGl0cyBuZXcgY29udGV4dFxuICAgICAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5faGVhcFtpbmRleF07XG4gICAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5faGVhcFtNYXRoLmZsb29yKGluZGV4IC8gMildO1xuXG4gICAgICAgICAgaWYgKHBhcmVudCAmJiB0aGlzLl9pc0hpZ2hlcihlbnRyeS5xdWV1ZVRpbWUsIHBhcmVudC5xdWV1ZVRpbWUpKVxuICAgICAgICAgICAgdGhpcy5fYnViYmxlVXAoaW5kZXgpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuX2J1YmJsZURvd24oaW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHVwZGF0ZSBjdXJyZW50IGxlbmd0aFxuICAgICAgdGhpcy5fY3VycmVudExlbmd0aCA9IGxhc3RJbmRleDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy50aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIHRoZSBxdWV1ZS5cbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX2N1cnJlbnRMZW5ndGggPSAxO1xuICAgIHRoaXMuX2hlYXAgPSBuZXcgQXJyYXkodGhpcy5faGVhcC5sZW5ndGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgaWYgdGhlIHF1ZXVlIGNvbnRhaW5zIHRoZSBnaXZlbiBgZW50cnlgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZW50cnkgLSBFbnRyeSB0byBiZSBjaGVja2VkXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBoYXMoZW50cnkpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhcC5pbmRleE9mKGVudHJ5KSAhPT0gLTE7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJpb3JpdHlRdWV1ZTtcbiIsIi8qKlxuICogU2NoZWR1bGluZ1F1ZXVlIGJhc2UgY2xhc3NcbiAqIGh0dHA6Ly93YXZlc2pzLmdpdGh1Yi5pby9hdWRpby8jYXVkaW8tc2NoZWR1bGluZy1xdWV1ZVxuICpcbiAqIE5vcmJlcnQuU2NobmVsbEBpcmNhbS5mclxuICogQ29weXJpZ2h0IDIwMTQsIDIwMTUgSVJDQU0g4oCTwqBDZW50cmUgUG9tcGlkb3VcbiAqL1xuXG5pbXBvcnQgUHJpb3JpdHlRdWV1ZSBmcm9tICcuL1ByaW9yaXR5UXVldWUnO1xuaW1wb3J0IFRpbWVFbmdpbmUgZnJvbSAnLi9UaW1lRW5naW5lJztcblxuLyoqXG4gKiBAY2xhc3MgU2NoZWR1bGluZ1F1ZXVlXG4gKiBAZXh0ZW5kcyBUaW1lRW5naW5lXG4gKi9cbmNsYXNzIFNjaGVkdWxpbmdRdWV1ZSBleHRlbmRzIFRpbWVFbmdpbmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fX3F1ZXVlID0gbmV3IFByaW9yaXR5UXVldWUoKTtcbiAgICB0aGlzLl9fZW5naW5lcyA9IG5ldyBTZXQoKTtcbiAgfVxuXG4gIC8vIFRpbWVFbmdpbmUgJ3NjaGVkdWxlZCcgaW50ZXJmYWNlXG4gIGFkdmFuY2VUaW1lKHRpbWUpIHtcbiAgICBjb25zdCBlbmdpbmUgPSB0aGlzLl9fcXVldWUuaGVhZDtcbiAgICBjb25zdCBuZXh0RW5naW5lVGltZSA9IGVuZ2luZS5hZHZhbmNlVGltZSh0aW1lKTtcblxuICAgIGlmICghbmV4dEVuZ2luZVRpbWUpIHtcbiAgICAgIGVuZ2luZS5tYXN0ZXIgPSBudWxsO1xuICAgICAgdGhpcy5fX2VuZ2luZXMuZGVsZXRlKGVuZ2luZSk7XG4gICAgICB0aGlzLl9fcXVldWUucmVtb3ZlKGVuZ2luZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX19xdWV1ZS5tb3ZlKGVuZ2luZSwgbmV4dEVuZ2luZVRpbWUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9fcXVldWUudGltZTtcbiAgfVxuXG4gIC8vIFRpbWVFbmdpbmUgbWFzdGVyIG1ldGhvZCB0byBiZSBpbXBsZW1lbnRlZCBieSBkZXJpdmVkIGNsYXNzXG4gIGdldCBjdXJyZW50VGltZSgpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8vIGNhbGwgYSBmdW5jdGlvbiBhdCBhIGdpdmVuIHRpbWVcbiAgZGVmZXIoZnVuLCB0aW1lID0gdGhpcy5jdXJyZW50VGltZSkge1xuICAgIGlmICghKGZ1biBpbnN0YW5jZW9mIEZ1bmN0aW9uKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIm9iamVjdCBjYW5ub3QgYmUgZGVmZXJlZCBieSBzY2hlZHVsZXJcIik7XG5cbiAgICB0aGlzLmFkZCh7XG4gICAgICBhZHZhbmNlVGltZTogZnVuY3Rpb24odGltZSkgeyBmdW4odGltZSk7IH0sIC8vIG1ha2Ugc3VyZSB0aGF0IHRoZSBhZHZhbmNlVGltZSBtZXRob2QgZG9lcyBub3QgcmV0dXJtIGFueXRoaW5nXG4gICAgfSwgdGltZSk7XG4gIH1cblxuICAvLyBhZGQgYSB0aW1lIGVuZ2luZSB0byB0aGUgc2NoZWR1bGVyXG4gIGFkZChlbmdpbmUsIHRpbWUgPSB0aGlzLmN1cnJlbnRUaW1lKSB7XG4gICAgaWYgKCFUaW1lRW5naW5lLmltcGxlbWVudHNTY2hlZHVsZWQoZW5naW5lKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIm9iamVjdCBjYW5ub3QgYmUgYWRkZWQgdG8gc2NoZWR1bGVyXCIpO1xuXG4gICAgaWYgKGVuZ2luZS5tYXN0ZXIpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJvYmplY3QgaGFzIGFscmVhZHkgYmVlbiBhZGRlZCB0byBhIG1hc3RlclwiKTtcblxuICAgIGVuZ2luZS5tYXN0ZXIgPSB0aGlzO1xuXG4gICAgLy8gYWRkIHRvIGVuZ2luZXMgYW5kIHF1ZXVlXG4gICAgdGhpcy5fX2VuZ2luZXMuYWRkKGVuZ2luZSk7XG4gICAgY29uc3QgbmV4dFRpbWUgPSB0aGlzLl9fcXVldWUuaW5zZXJ0KGVuZ2luZSwgdGltZSk7XG5cbiAgICAvLyByZXNjaGVkdWxlIHF1ZXVlXG4gICAgdGhpcy5yZXNldFRpbWUobmV4dFRpbWUpO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGEgdGltZSBlbmdpbmUgZnJvbSB0aGUgcXVldWVcbiAgcmVtb3ZlKGVuZ2luZSkge1xuICAgIGlmIChlbmdpbmUubWFzdGVyICE9PSB0aGlzKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwib2JqZWN0IGhhcyBub3QgYmVlbiBhZGRlZCB0byB0aGlzIHNjaGVkdWxlclwiKTtcblxuICAgIGVuZ2luZS5tYXN0ZXIgPSBudWxsO1xuXG4gICAgLy8gcmVtb3ZlIGZyb20gYXJyYXkgYW5kIHF1ZXVlXG4gICAgdGhpcy5fX2VuZ2luZXMuZGVsZXRlKGVuZ2luZSk7XG4gICAgY29uc3QgbmV4dFRpbWUgPSB0aGlzLl9fcXVldWUucmVtb3ZlKGVuZ2luZSk7XG5cbiAgICAvLyByZXNjaGVkdWxlIHF1ZXVlXG4gICAgdGhpcy5yZXNldFRpbWUobmV4dFRpbWUpO1xuICB9XG5cbiAgLy8gcmVzZXQgbmV4dCBlbmdpbmUgdGltZVxuICByZXNldEVuZ2luZVRpbWUoZW5naW5lLCB0aW1lID0gdGhpcy5jdXJyZW50VGltZSkge1xuICAgIGlmIChlbmdpbmUubWFzdGVyICE9PSB0aGlzKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwib2JqZWN0IGhhcyBub3QgYmVlbiBhZGRlZCB0byB0aGlzIHNjaGVkdWxlclwiKTtcblxuICAgIGxldCBuZXh0VGltZTtcblxuICAgIGlmICh0aGlzLl9fcXVldWUuaGFzKGVuZ2luZSkpXG4gICAgICBuZXh0VGltZSA9IHRoaXMuX19xdWV1ZS5tb3ZlKGVuZ2luZSwgdGltZSk7XG4gICAgZWxzZVxuICAgICAgbmV4dFRpbWUgPSB0aGlzLl9fcXVldWUuaW5zZXJ0KGVuZ2luZSwgdGltZSk7XG5cbiAgICB0aGlzLnJlc2V0VGltZShuZXh0VGltZSk7XG4gIH1cblxuICAvLyBjaGVjayB3aGV0aGVyIGEgZ2l2ZW4gZW5naW5lIGlzIHNjaGVkdWxlZFxuICBoYXMoZW5naW5lKSB7XG4gICAgcmV0dXJuIHRoaXMuX19lbmdpbmVzLmhhcyhlbmdpbmUpO1xuICB9XG5cbiAgLy8gY2xlYXIgcXVldWVcbiAgY2xlYXIoKSB7XG4gICAgZm9yKGxldCBlbmdpbmUgb2YgdGhpcy5fX2VuZ2luZXMpXG4gICAgICBlbmdpbmUubWFzdGVyID0gbnVsbDtcblxuICAgIHRoaXMuX19xdWV1ZS5jbGVhcigpO1xuICAgIHRoaXMuX19lbmdpbmVzLmNsZWFyKCk7XG4gICAgdGhpcy5yZXNldFRpbWUoSW5maW5pdHkpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjaGVkdWxpbmdRdWV1ZVxuIiwiLyoqXG4gKiBCYXNlIGNsYXNzIGZvciB0aW1lIGVuZ2luZXNcbiAqXG4gKiBBIHRpbWUgZW5naW5lIGdlbmVyYXRlcyBtb3JlIG9yIGxlc3MgcmVndWxhciBldmVudHMgYW5kL29yIHBsYXlzIGJhY2sgYVxuICogbWVkaWEgc3RyZWFtLiBJdCBpbXBsZW1lbnRzIG9uZSBvciBtdWx0aXBsZSBpbnRlcmZhY2VzIHRvIGJlIGRyaXZlbiBieSBhXG4gKiBtYXN0ZXIgKGkuZS4gYSBTY2hlZHVsZXIsIGEgVHJhbnNwb3J0IG9yIGEgUGxheUNvbnRyb2wpIGluIHN5bmNocm9uaXphdGlvblxuICogd2l0aCBvdGhlciBlbmdpbmVzLiBUaGUgcHJvdmlkZWQgaW50ZXJmYWNlcyBhcmUgc2NoZWR1bGVkLCB0cmFuc3BvcnRlZCxcbiAqIGFuZCBwbGF5LWNvbnRyb2xsZWQuXG4gKlxuICpcbiAqICMjIyMgVGhlIGBzY2hlZHVsZWRgIGludGVyZmFjZVxuICpcbiAqIFRoZSBzY2hlZHVsZWQgaW50ZXJmYWNlIGFsbG93cyBmb3Igc3luY2hyb25pemluZyBhbiBlbmdpbmUgdG8gYSBtb25vdG9ub3VzIHRpbWVcbiAqIGFzIGl0IGlzIHByb3ZpZGVkIGJ5IHRoZSBTY2hlZHVsZXIgbWFzdGVyLlxuICpcbiAqICMjIyMjIyBgYWR2YW5jZVRpbWUodGltZSA6TnVtYmVyKSAtPiB7TnVtYmVyfWBcbiAqXG4gKiBUaGUgYGFkdmFuY2VUaW1lYCBtZXRob2QgaGFzIHRvIGJlIGltcGxlbWVudGVkIGJ5IGFuIGBUaW1lRW5naW5lYCBhcyBwYXJ0IG9mIHRoZVxuICogc2NoZWR1bGVkIGludGVyZmFjZS4gVGhlIG1ldGhvZCBpcyBjYWxsZWQgYnkgdGhlIG1hc3RlciAoZS5nLiB0aGUgc2NoZWR1bGVyKS5cbiAqIEl0IGdlbmVyYXRlcyBhbiBldmVudCBhbmQgdG8gcmV0dXJucyB0aGUgdGltZSBvZiB0aGUgbmV4dCBldmVudCAoaS5lLiB0aGUgbmV4dFxuICogY2FsbCBvZiBhZHZhbmNlVGltZSkuIFRoZSByZXR1cm5lZCB0aW1lIGhhcyB0byBiZSBncmVhdGVyIHRoYW4gdGhlIHRpbWVcbiAqIHJlY2VpdmVkIGFzIGFyZ3VtZW50IG9mIHRoZSBtZXRob2QuIEluIGNhc2UgdGhhdCBhIFRpbWVFbmdpbmUgaGFzIHRvIGdlbmVyYXRlXG4gKiBtdWx0aXBsZSBldmVudHMgYXQgdGhlIHNhbWUgdGltZSwgdGhlIGVuZ2luZSBoYXMgdG8gaW1wbGVtZW50IGl0cyBvd24gbG9vcFxuICogd2hpbGUoZXZlbnQudGltZSA8PSB0aW1lKSBhbmQgcmV0dXJuIHRoZSB0aW1lIG9mIHRoZSBuZXh0IGV2ZW50IChpZiBhbnkpLlxuICpcbiAqICMjIyMjIyBgcmVzZXRUaW1lKHRpbWU9dW5kZWZpbmVkIDpOdW1iZXIpYFxuICpcbiAqIFRoZSBgcmVzZXRUaW1lYCBtZXRob2QgaXMgcHJvdmlkZWQgYnkgdGhlIGBUaW1lRW5naW5lYCBiYXNlIGNsYXNzLiBBbiBlbmdpbmUgbWF5XG4gKiBjYWxsIHRoaXMgbWV0aG9kIHRvIHJlc2V0IGl0cyBuZXh0IGV2ZW50IHRpbWUgKGUuZy4gd2hlbiBhIHBhcmFtZXRlciBpc1xuICogY2hhbmdlZCB0aGF0IGluZmx1ZW5jZXMgdGhlIGVuZ2luZSdzIHRlbXBvcmFsIGJlaGF2aW9yKS4gV2hlbiBubyBhcmd1bWVudFxuICogaXMgZ2l2ZW4sIHRoZSB0aW1lIGlzIHJlc2V0IHRvIHRoZSBjdXJyZW50IG1hc3RlciB0aW1lLiBXaGVuIGNhbGxpbmcgdGhlXG4gKiBtZXRob2Qgd2l0aCBJbmZpbml0eSB0aGUgZW5naW5lIGlzIHN1c3BlbmRlZCB3aXRob3V0IGJlaW5nIHJlbW92ZWQgZnJvbSB0aGVcbiAqIG1hc3Rlci5cbiAqXG4gKlxuICogIyMjIyBUaGUgYHRyYW5zcG9ydGVkYCBpbnRlcmZhY2VcbiAqXG4gKiBUaGUgdHJhbnNwb3J0ZWQgaW50ZXJmYWNlIGFsbG93cyBmb3Igc3luY2hyb25pemluZyBhbiBlbmdpbmUgdG8gYSBwb3NpdGlvblxuICogKGkuZS4gbWVkaWEgcGxheWJhY2sgdGltZSkgdGhhdCBjYW4gcnVuIGZvcndhcmQgYW5kIGJhY2t3YXJkIGFuZCBqdW1wIGFzIGl0XG4gKiBpcyBwcm92aWRlZCBieSB0aGUgVHJhbnNwb3J0IG1hc3Rlci5cbiAqXG4gKiAjIyMjIyMgYHN5bmNQb3NpdGlvbih0aW1lIDpOdW1iZXIsIHBvc2l0aW9uIDpOdW1iZXIsIHNwZWVkIDpOdW1iZXIpIC0+IHtOdW1iZXJ9YFxuICpcbiAqIFRoZSBgc3luY1Bvc2l0b25gIG1ldGhvZCBoYXMgdG8gYmUgaW1wbGVtZW50ZWQgYnkgYSBgVGltZUVuZ2luZWAgYXMgcGFydCBvZiB0aGVcbiAqIHRyYW5zcG9ydGVkIGludGVyZmFjZS4gVGhlIG1ldGhvZCBzeW5jUG9zaXRvbiBpcyBjYWxsZWQgd2hlbmV2ZXIgdGhlIG1hc3RlclxuICogb2YgYSB0cmFuc3BvcnRlZCBlbmdpbmUgaGFzIHRvIChyZS0pc3luY2hyb25pemUgdGhlIGVuZ2luZSdzIHBvc2l0aW9uLiBUaGlzXG4gKiBpcyBmb3IgZXhhbXBsZSByZXF1aXJlZCB3aGVuIHRoZSBtYXN0ZXIgKHJlLSlzdGFydHMgcGxheWJhY2ssIGp1bXBzIHRvIGFuXG4gKiBhcmJpdHJhcnkgcG9zaXRpb24sIGFuZCB3aGVuIHJldmVyc2luZyBwbGF5YmFjayBkaXJlY3Rpb24uIFRoZSBtZXRob2QgcmV0dXJuc1xuICogdGhlIG5leHQgcG9zaXRpb24gb2YgdGhlIGVuZ2luZSBpbiB0aGUgZ2l2ZW4gcGxheWJhY2sgZGlyZWN0aW9uXG4gKiAoaS5lLiBgc3BlZWQgPCAwYCBvciBgc3BlZWQgPiAwYCkuXG4gKlxuICogIyMjIyMjIGBhZHZhbmNlUG9zaXRpb24odGltZSA6TnVtYmVyLCBwb3NpdGlvbiA6TnVtYmVyLCBzcGVlZCA6TnVtYmVyKSAtPiB7TnVtYmVyfWBcbiAqXG4gKiBUaGUgYGFkdmFuY2VQb3NpdGlvbmAgbWV0aG9kIGhhcyB0byBiZSBpbXBsZW1lbnRlZCBieSBhIGBUaW1lRW5naW5lYCBhcyBwYXJ0XG4gKiBvZiB0aGUgdHJhbnNwb3J0ZWQgaW50ZXJmYWNlLiBUaGUgbWFzdGVyIGNhbGxzIHRoZSBhZHZhbmNlUG9zaXRvbiBtZXRob2Qgd2hlblxuICogdGhlIGVuZ2luZSdzIGV2ZW50IHBvc2l0aW9uIGlzIHJlYWNoZWQuIFRoZSBtZXRob2QgZ2VuZXJhdGVzIGFuIGV2ZW50IGFuZFxuICogcmV0dXJucyB0aGUgbmV4dCBwb3NpdGlvbiBpbiB0aGUgZ2l2ZW4gcGxheWJhY2sgZGlyZWN0aW9uIChpLmUuIHNwZWVkIDwgMCBvclxuICogc3BlZWQgPiAwKS4gVGhlIHJldHVybmVkIHBvc2l0aW9uIGhhcyB0byBiZSBncmVhdGVyIChpLmUuIHdoZW4gc3BlZWQgPiAwKVxuICogb3IgbGVzcyAoaS5lLiB3aGVuIHNwZWVkIDwgMCkgdGhhbiB0aGUgcG9zaXRpb24gcmVjZWl2ZWQgYXMgYXJndW1lbnQgb2YgdGhlXG4gKiBtZXRob2QuXG4gKlxuICogIyMjIyMjIGByZXNldFBvc2l0aW9uKHBvc2l0aW9uPXVuZGVmaW5lZCA6TnVtYmVyKWBcbiAqXG4gKiBUaGUgcmVzZXRQb3NpdGlvbiBtZXRob2QgaXMgcHJvdmlkZWQgYnkgdGhlIFRpbWVFbmdpbmUgYmFzZSBjbGFzcy4gQW4gZW5naW5lXG4gKiBtYXkgY2FsbCB0aGlzIG1ldGhvZCB0byByZXNldCBpdHMgbmV4dCBldmVudCBwb3NpdGlvbi4gV2hlbiBubyBhcmd1bWVudFxuICogaXMgZ2l2ZW4sIHRoZSB0aW1lIGlzIHJlc2V0IHRvIHRoZSBjdXJyZW50IG1hc3RlciB0aW1lLiBXaGVuIGNhbGxpbmcgdGhlXG4gKiBtZXRob2Qgd2l0aCBJbmZpbml0eSB0aGUgZW5naW5lIGlzIHN1c3BlbmRlZCB3aXRob3V0IGJlaW5nIHJlbW92ZWQgZnJvbVxuICogdGhlIG1hc3Rlci5cbiAqXG4gKlxuICogIyMjIyBUaGUgc3BlZWQtY29udHJvbGxlZCBpbnRlcmZhY2VcbiAqXG4gKiBUaGUgXCJzcGVlZC1jb250cm9sbGVkXCIgaW50ZXJmYWNlIGFsbG93cyBmb3Igc3luY3Jvbml6aW5nIGFuIGVuZ2luZSB0aGF0IGlzXG4gKiBuZWl0aGVyIGRyaXZlbiB0aHJvdWdoIHRoZSBzY2hlZHVsZWQgbm9yIHRoZSB0cmFuc3BvcnRlZCBpbnRlcmZhY2UuIFRoZVxuICogaW50ZXJmYWNlIGFsbG93cyBpbiBwYXJ0aWN1bGFyIHRvIHN5bmNocm9uaXplIGVuZ2luZXMgdGhhdCBhc3N1cmUgdGhlaXIgb3duXG4gKiBzY2hlZHVsaW5nIChpLmUuIGF1ZGlvIHBsYXllciBvciBhbiBvc2NpbGxhdG9yKSB0byB0aGUgZXZlbnQtYmFzZWQgc2NoZWR1bGVkXG4gKiBhbmQgdHJhbnNwb3J0ZWQgZW5naW5lcy5cbiAqXG4gKiAjIyMjIyMgYHN5bmNTcGVlZCh0aW1lIDpOdW1iZXIsIHBvc2l0aW9uIDpOdW1iZXIsIHNwZWVkIDpOdW1iZXIsIHNlZWs9ZmFsc2UgOkJvb2xlYW4pYFxuICpcbiAqIFRoZSBzeW5jU3BlZWQgbWV0aG9kIGhhcyB0byBiZSBpbXBsZW1lbnRlZCBieSBhIFRpbWVFbmdpbmUgYXMgcGFydCBvZiB0aGVcbiAqIHNwZWVkLWNvbnRyb2xsZWQgaW50ZXJmYWNlLiBUaGUgbWV0aG9kIGlzIGNhbGxlZCBieSB0aGUgbWFzdGVyIHdoZW5ldmVyIHRoZVxuICogcGxheWJhY2sgc3BlZWQgY2hhbmdlcyBvciB0aGUgcG9zaXRpb24ganVtcHMgYXJiaXRhcmlseSAoaS5lLiBvbiBhIHNlZWspLlxuICpcbiAqXG4gKiA8aHIgLz5cbiAqXG4gKiBFeGFtcGxlIHRoYXQgc2hvd3MgYSBgVGltZUVuZ2luZWAgcnVubmluZyBpbiBhIGBTY2hlZHVsZXJgIHRoYXQgY291bnRzIHVwXG4gKiBhdCBhIGdpdmVuIGZyZXF1ZW5jeTpcbiAqIHtAbGluayBodHRwczovL3Jhd2dpdC5jb20vd2F2ZXNqcy93YXZlcy1hdWRpby9tYXN0ZXIvZXhhbXBsZXMvdGltZS1lbmdpbmUuaHRtbH1cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuICpcbiAqIGNsYXNzIE15RW5naW5lIGV4dGVuZHMgYXVkaW8uVGltZUVuZ2luZSB7XG4gKiAgIGNvbnN0cnVjdG9yKCkge1xuICogICAgIHN1cGVyKCk7XG4gKiAgICAgLy8gLi4uXG4gKiAgIH1cbiAqIH1cbiAqXG4gKi9cbmNsYXNzIFRpbWVFbmdpbmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvKipcbiAgICAgKiBUaGUgZW5naW5lJ3MgbWFzdGVyLlxuICAgICAqXG4gICAgICogQHR5cGUge01peGVkfVxuICAgICAqIEBuYW1lIG1hc3RlclxuICAgICAqIEBtZW1iZXJvZiBUaW1lRW5naW5lXG4gICAgICovXG4gICAgdGhpcy5tYXN0ZXIgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lIGVuZ2luZSdzIGN1cnJlbnQgKG1hc3RlcikgdGltZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQG1lbWJlcm9mIFRpbWVFbmdpbmVcbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgY3VycmVudFRpbWUoKSB7XG4gICAgaWYgKHRoaXMubWFzdGVyKVxuICAgICAgcmV0dXJuIHRoaXMubWFzdGVyLmN1cnJlbnRUaW1lO1xuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdGltZSBlbmdpbmUncyBjdXJyZW50IChtYXN0ZXIpIGF1ZGlvIHRpbWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBtZW1iZXJvZiBUaW1lRW5naW5lXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IGF1ZGlvVGltZSgpIHtcbiAgICBpZiAodGhpcy5tYXN0ZXIpXG4gICAgICByZXR1cm4gdGhpcy5tYXN0ZXIuYXVkaW9UaW1lO1xuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdGltZSBlbmdpbmUncyBjdXJyZW50IChtYXN0ZXIpIHBvc2l0aW9uLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAbWVtYmVyb2YgVGltZUVuZ2luZVxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBjdXJyZW50UG9zaXRpb24oKSB7XG4gICAgdmFyIG1hc3RlciA9IHRoaXMubWFzdGVyO1xuXG4gICAgaWYgKG1hc3RlciAmJiBtYXN0ZXIuY3VycmVudFBvc2l0aW9uICE9PSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4gbWFzdGVyLmN1cnJlbnRQb3NpdGlvbjtcblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2NoZWR1bGVkIGludGVyZmFjZVxuICAgKiAgIC0gYWR2YW5jZVRpbWUodGltZSksIGNhbGxlZCB0byBnZW5lcmF0ZSBuZXh0IGV2ZW50IGF0IGdpdmVuIHRpbWUsIHJldHVybnMgbmV4dCB0aW1lXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFRpbWVFbmdpbmVcbiAgICovXG4gIHN0YXRpYyBpbXBsZW1lbnRzU2NoZWR1bGVkKGVuZ2luZSkge1xuICAgIHJldHVybiAoZW5naW5lLmFkdmFuY2VUaW1lICYmIGVuZ2luZS5hZHZhbmNlVGltZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKTtcbiAgfVxuXG4gIHJlc2V0VGltZSh0aW1lID0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHRoaXMubWFzdGVyKVxuICAgICAgdGhpcy5tYXN0ZXIucmVzZXRFbmdpbmVUaW1lKHRoaXMsIHRpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zcG9ydGVkIGludGVyZmFjZVxuICAgKiAgIC0gc3luY1Bvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCksIGNhbGxlZCB0byByZXBvc2l0aW9uIFRpbWVFbmdpbmUsIHJldHVybnMgbmV4dCBwb3NpdGlvblxuICAgKiAgIC0gYWR2YW5jZVBvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCksIGNhbGxlZCB0byBnZW5lcmF0ZSBuZXh0IGV2ZW50IGF0IGdpdmVuIHRpbWUgYW5kIHBvc2l0aW9uLCByZXR1cm5zIG5leHQgcG9zaXRpb25cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgVGltZUVuZ2luZVxuICAgKi9cbiAgc3RhdGljIGltcGxlbWVudHNUcmFuc3BvcnRlZChlbmdpbmUpIHtcbiAgICByZXR1cm4gKFxuICAgICAgZW5naW5lLnN5bmNQb3NpdGlvbiAmJiBlbmdpbmUuc3luY1Bvc2l0aW9uIGluc3RhbmNlb2YgRnVuY3Rpb24gJiZcbiAgICAgIGVuZ2luZS5hZHZhbmNlUG9zaXRpb24gJiYgZW5naW5lLmFkdmFuY2VQb3NpdGlvbiBpbnN0YW5jZW9mIEZ1bmN0aW9uXG4gICAgKTtcbiAgfVxuXG4gIHJlc2V0UG9zaXRpb24ocG9zaXRpb24gPSB1bmRlZmluZWQpIHtcbiAgICBpZiAodGhpcy5tYXN0ZXIpXG4gICAgICB0aGlzLm1hc3Rlci5yZXNldEVuZ2luZVBvc2l0aW9uKHRoaXMsIHBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTcGVlZC1jb250cm9sbGVkIGludGVyZmFjZVxuICAgKiAgIC0gc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCwgKSwgY2FsbGVkIHRvXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFRpbWVFbmdpbmVcbiAgICovXG4gIHN0YXRpYyBpbXBsZW1lbnRzU3BlZWRDb250cm9sbGVkKGVuZ2luZSkge1xuICAgIHJldHVybiAoZW5naW5lLnN5bmNTcGVlZCAmJiBlbmdpbmUuc3luY1NwZWVkIGluc3RhbmNlb2YgRnVuY3Rpb24pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVFbmdpbmU7XG4iLCIvLyBjb3JlXG5leHBvcnQgeyBkZWZhdWx0IGFzIFRpbWVFbmdpbmUgfSBmcm9tICcuL2NvcmUvVGltZUVuZ2luZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFByaW9yaXR5UXVldWUgfSBmcm9tICcuL2NvcmUvUHJpb3JpdHlRdWV1ZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNjaGVkdWxpbmdRdWV1ZSB9IGZyb20gJy4vY29yZS9TY2hlZHVsaW5nUXVldWUnO1xuXG4vLyBtYXN0ZXJzXG5leHBvcnQgeyBkZWZhdWx0IGFzIFBsYXlDb250cm9sIH0gZnJvbSAnLi9tYXN0ZXJzL1BsYXlDb250cm9sJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgVHJhbnNwb3J0IH0gZnJvbSAnLi9tYXN0ZXJzL1RyYW5zcG9ydCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNjaGVkdWxlciB9IGZyb20gJy4vbWFzdGVycy9TY2hlZHVsZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTaW1wbGVTY2hlZHVsZXIgfSBmcm9tICcuL21hc3RlcnMvU2ltcGxlU2NoZWR1bGVyJztcbiIsImltcG9ydCBTY2hlZHVsaW5nUXVldWUgZnJvbSAnLi4vY29yZS9TY2hlZHVsaW5nUXVldWUnO1xuaW1wb3J0IFRpbWVFbmdpbmUgZnJvbSAnLi4vY29yZS9UaW1lRW5naW5lJztcblxuY29uc3QgRVBTSUxPTiA9IDFlLTg7XG5cbmNsYXNzIExvb3BDb250cm9sIGV4dGVuZHMgVGltZUVuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKHBsYXlDb250cm9sKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX19wbGF5Q29udHJvbCA9IHBsYXlDb250cm9sO1xuICAgIHRoaXMuc3BlZWQgPSAxO1xuICAgIHRoaXMubG93ZXIgPSAtSW5maW5pdHk7XG4gICAgdGhpcy51cHBlciA9IEluZmluaXR5O1xuICB9XG5cbiAgLy8gVGltZUVuZ2luZSBtZXRob2QgKHNjaGVkdWxlZCBpbnRlcmZhY2UpXG4gIGFkdmFuY2VUaW1lKHRpbWUpIHtcbiAgICBjb25zdCBwbGF5Q29udHJvbCA9IHRoaXMuX19wbGF5Q29udHJvbDtcbiAgICBjb25zdCBzcGVlZCA9IHRoaXMuc3BlZWQ7XG4gICAgY29uc3QgbG93ZXIgPSB0aGlzLmxvd2VyO1xuICAgIGNvbnN0IHVwcGVyID0gdGhpcy51cHBlcjtcblxuICAgIGlmIChzcGVlZCA+IDApXG4gICAgICB0aW1lICs9IEVQU0lMT047XG4gICAgZWxzZVxuICAgICAgdGltZSAtPSBFUFNJTE9OO1xuXG4gICAgaWYgKHNwZWVkID4gMCkge1xuICAgICAgcGxheUNvbnRyb2wuc3luY1NwZWVkKHRpbWUsIGxvd2VyLCBzcGVlZCwgdHJ1ZSk7XG4gICAgICByZXR1cm4gcGxheUNvbnRyb2wuX19nZXRUaW1lQXRQb3NpdGlvbih1cHBlcikgLSBFUFNJTE9OO1xuICAgIH0gZWxzZSBpZiAoc3BlZWQgPCAwKSB7XG4gICAgICBwbGF5Q29udHJvbC5zeW5jU3BlZWQodGltZSwgdXBwZXIsIHNwZWVkLCB0cnVlKTtcbiAgICAgIHJldHVybiBwbGF5Q29udHJvbC5fX2dldFRpbWVBdFBvc2l0aW9uKGxvd2VyKSArIEVQU0lMT047XG4gICAgfVxuXG4gICAgcmV0dXJuIEluZmluaXR5O1xuICB9XG5cbiAgcmVzY2hlZHVsZShzcGVlZCkge1xuICAgIGNvbnN0IHBsYXlDb250cm9sID0gdGhpcy5fX3BsYXlDb250cm9sO1xuICAgIGNvbnN0IGxvd2VyID0gTWF0aC5taW4ocGxheUNvbnRyb2wuX19sb29wU3RhcnQsIHBsYXlDb250cm9sLl9fbG9vcEVuZCk7XG4gICAgY29uc3QgdXBwZXIgPSBNYXRoLm1heChwbGF5Q29udHJvbC5fX2xvb3BTdGFydCwgcGxheUNvbnRyb2wuX19sb29wRW5kKTtcblxuICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcbiAgICB0aGlzLmxvd2VyID0gbG93ZXI7XG4gICAgdGhpcy51cHBlciA9IHVwcGVyO1xuXG4gICAgaWYgKGxvd2VyID09PSB1cHBlcilcbiAgICAgIHNwZWVkID0gMDtcblxuICAgIGlmIChzcGVlZCA+IDApXG4gICAgICB0aGlzLnJlc2V0VGltZShwbGF5Q29udHJvbC5fX2dldFRpbWVBdFBvc2l0aW9uKHVwcGVyKSAtIEVQU0lMT04pO1xuICAgIGVsc2UgaWYgKHNwZWVkIDwgMClcbiAgICAgIHRoaXMucmVzZXRUaW1lKHBsYXlDb250cm9sLl9fZ2V0VGltZUF0UG9zaXRpb24obG93ZXIpICsgRVBTSUxPTik7XG4gICAgZWxzZVxuICAgICAgdGhpcy5yZXNldFRpbWUoSW5maW5pdHkpO1xuICB9XG5cbiAgYXBwbHlMb29wQm91bmRhcmllcyhwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICBjb25zdCBsb3dlciA9IHRoaXMubG93ZXI7XG4gICAgY29uc3QgdXBwZXIgPSB0aGlzLnVwcGVyO1xuXG4gICAgaWYgKHNwZWVkID4gMCAmJiBwb3NpdGlvbiA+PSB1cHBlcilcbiAgICAgIHJldHVybiBsb3dlciArIChwb3NpdGlvbiAtIGxvd2VyKSAlICh1cHBlciAtIGxvd2VyKTtcbiAgICBlbHNlIGlmIChzcGVlZCA8IDAgJiYgcG9zaXRpb24gPCBsb3dlcilcbiAgICAgIHJldHVybiB1cHBlciAtICh1cHBlciAtIHBvc2l0aW9uKSAlICh1cHBlciAtIGxvd2VyKTtcblxuICAgIHJldHVybiBwb3NpdGlvbjtcbiAgfVxufVxuXG4vLyBwbGF5IGNvbnRyb2xsZWQgYmFzZSBjbGFzc1xuY2xhc3MgUGxheUNvbnRyb2xsZWQge1xuICBjb25zdHJ1Y3RvcihwbGF5Q29udHJvbCwgZW5naW5lKSB7XG4gICAgdGhpcy5fX3BsYXlDb250cm9sID0gcGxheUNvbnRyb2w7XG5cbiAgICBlbmdpbmUubWFzdGVyID0gdGhpcztcbiAgICB0aGlzLl9fZW5naW5lID0gZW5naW5lO1xuICB9XG5cbiAgc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCwgc2VlaywgbGFzdFNwZWVkKSB7XG4gICAgdGhpcy5fX2VuZ2luZS5zeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHNwZWVkLCBzZWVrKTtcbiAgfVxuXG4gIGdldCBjdXJyZW50VGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fX3BsYXlDb250cm9sLmN1cnJlbnRUaW1lO1xuICB9XG5cbiAgZ2V0IGF1ZGlvVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fX3BsYXlDb250cm9sLmF1ZGlvVGltZTtcbiAgfVxuXG4gIGdldCBjdXJyZW50UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX19wbGF5Q29udHJvbC5jdXJyZW50UG9zaXRpb247XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuX19wbGF5Q29udHJvbCA9IG51bGw7XG5cbiAgICB0aGlzLl9fZW5naW5lLm1hc3RlciA9IG51bGw7XG4gICAgdGhpcy5fX2VuZ2luZSA9IG51bGw7XG4gIH1cbn1cblxuLy8gcGxheSBjb250cm9sIGZvciBlbmdpbmVzIGltcGxlbWVudGluZyB0aGUgKnNwZWVkLWNvbnRyb2xsZWQqIGludGVyZmFjZVxuY2xhc3MgUGxheUNvbnRyb2xsZWRTcGVlZENvbnRyb2xsZWQgZXh0ZW5kcyBQbGF5Q29udHJvbGxlZCB7XG4gIGNvbnN0cnVjdG9yKHBsYXlDb250cm9sLCBlbmdpbmUpIHtcbiAgICBzdXBlcihwbGF5Q29udHJvbCwgZW5naW5lKTtcbiAgfVxufVxuXG4vLyBwbGF5IGNvbnRyb2wgZm9yIGVuZ2luZXMgaW1wbG1lbnRpbmcgdGhlICp0cmFuc3BvcnRlZCogaW50ZXJmYWNlXG5jbGFzcyBQbGF5Q29udHJvbGxlZFRyYW5zcG9ydGVkIGV4dGVuZHMgUGxheUNvbnRyb2xsZWQge1xuICBjb25zdHJ1Y3RvcihwbGF5Q29udHJvbCwgZW5naW5lKSB7XG4gICAgc3VwZXIocGxheUNvbnRyb2wsIGVuZ2luZSk7XG5cbiAgICB0aGlzLl9fc2NoZWR1bGVySG9vayA9IG5ldyBQbGF5Q29udHJvbGxlZFNjaGVkdWxlckhvb2socGxheUNvbnRyb2wsIGVuZ2luZSk7XG4gIH1cblxuICBzeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHNwZWVkLCBzZWVrLCBsYXN0U3BlZWQpIHtcbiAgICBpZiAoc3BlZWQgIT09IGxhc3RTcGVlZCB8fCBzZWVrKSB7XG4gICAgICB2YXIgbmV4dFBvc2l0aW9uO1xuXG4gICAgICAvLyByZXN5bmMgdHJhbnNwb3J0ZWQgZW5naW5lc1xuICAgICAgaWYgKHNlZWsgfHwgc3BlZWQgKiBsYXN0U3BlZWQgPCAwKSB7XG4gICAgICAgIC8vIHNlZWsgb3IgcmV2ZXJzZSBkaXJlY3Rpb25cbiAgICAgICAgbmV4dFBvc2l0aW9uID0gdGhpcy5fX2VuZ2luZS5zeW5jUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgICAgIH0gZWxzZSBpZiAobGFzdFNwZWVkID09PSAwKSB7XG4gICAgICAgIC8vIHN0YXJ0XG4gICAgICAgIG5leHRQb3NpdGlvbiA9IHRoaXMuX19lbmdpbmUuc3luY1Bvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCk7XG4gICAgICB9IGVsc2UgaWYgKHNwZWVkID09PSAwKSB7XG4gICAgICAgIC8vIHN0b3AgLyBwYXVzZVxuICAgICAgICB0aGlzLl9fZW5naW5lLnN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpO1xuICAgICAgICBuZXh0UG9zaXRpb24gPSBJbmZpbml0eTtcblxuICAgICAgICAvLyBpZiAodGhpcy5fX2VuZ2luZS5zeW5jU3BlZWQpXG4gICAgICAgIC8vICAgdGhpcy5fX2VuZ2luZS5zeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIDApO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9fZW5naW5lLnN5bmNTcGVlZCkge1xuICAgICAgICAvLyBjaGFuZ2Ugc3BlZWQgd2l0aG91dCByZXZlcnNpbmcgZGlyZWN0aW9uXG4gICAgICAgIHRoaXMuX19lbmdpbmUuc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX19zY2hlZHVsZXJIb29rLnJlc2V0UG9zaXRpb24obmV4dFBvc2l0aW9uKTtcbiAgICB9XG4gIH1cblxuICByZXNldEVuZ2luZVBvc2l0aW9uKGVuZ2luZSwgcG9zaXRpb24gPSB1bmRlZmluZWQpIHtcbiAgICBpZiAocG9zaXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHBsYXlDb250cm9sID0gdGhpcy5fX3BsYXlDb250cm9sO1xuICAgICAgdmFyIHRpbWUgPSBwbGF5Q29udHJvbC5fX3N5bmMoKTtcblxuICAgICAgcG9zaXRpb24gPSB0aGlzLl9fZW5naW5lLnN5bmNQb3NpdGlvbih0aW1lLCBwbGF5Q29udHJvbC5fX3Bvc2l0aW9uLCBwbGF5Q29udHJvbC5fX3NwZWVkKTtcbiAgICB9XG5cbiAgICB0aGlzLl9fc2NoZWR1bGVySG9vay5yZXNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5fX3NjaGVkdWxlckhvb2suZGVzdHJveSgpO1xuICAgIHRoaXMuX19zY2hlZHVsZXJIb29rID0gbnVsbDtcblxuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgfVxufVxuXG4vLyBwbGF5IGNvbnRyb2wgZm9yIHRpbWUgZW5naW5lcyBpbXBsZW1lbnRpbmcgdGhlICpzY2hlZHVsZWQqIGludGVyZmFjZVxuY2xhc3MgUGxheUNvbnRyb2xsZWRTY2hlZHVsZWQgZXh0ZW5kcyBQbGF5Q29udHJvbGxlZCB7XG4gIGNvbnN0cnVjdG9yKHBsYXlDb250cm9sLCBlbmdpbmUpIHtcbiAgICBzdXBlcihwbGF5Q29udHJvbCwgZW5naW5lKTtcblxuICAgIC8vIHNjaGVkdWxpbmcgcXVldWUgYmVjb21lcyBtYXN0ZXIgb2YgZW5naW5lXG4gICAgZW5naW5lLm1hc3RlciA9IG51bGw7XG4gICAgdGhpcy5fX3NjaGVkdWxpbmdRdWV1ZSA9IG5ldyBQbGF5Q29udHJvbGxlZFNjaGVkdWxpbmdRdWV1ZShwbGF5Q29udHJvbCwgZW5naW5lKTtcbiAgfVxuXG4gIHN5bmNTcGVlZCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQsIHNlZWssIGxhc3RTcGVlZCkge1xuICAgIGlmIChsYXN0U3BlZWQgPT09IDAgJiYgc3BlZWQgIT09IDApIC8vIHN0YXJ0IG9yIHNlZWtcbiAgICAgIHRoaXMuX19lbmdpbmUucmVzZXRUaW1lKCk7XG4gICAgZWxzZSBpZiAobGFzdFNwZWVkICE9PSAwICYmIHNwZWVkID09PSAwKSAvLyBzdG9wXG4gICAgICB0aGlzLl9fZW5naW5lLnJlc2V0VGltZShJbmZpbml0eSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuX19zY2hlZHVsaW5nUXVldWUuZGVzdHJveSgpO1xuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgfVxufVxuXG4vLyB0cmFuc2xhdGVzIHRyYW5zcG9ydGVkIGVuZ2luZSBhZHZhbmNlUG9zaXRpb24gaW50byBnbG9iYWwgc2NoZWR1bGVyIHRpbWVzXG5jbGFzcyBQbGF5Q29udHJvbGxlZFNjaGVkdWxlckhvb2sgZXh0ZW5kcyBUaW1lRW5naW5lIHtcbiAgY29uc3RydWN0b3IocGxheUNvbnRyb2wsIGVuZ2luZSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl9fcGxheUNvbnRyb2wgPSBwbGF5Q29udHJvbDtcbiAgICB0aGlzLl9fZW5naW5lID0gZW5naW5lO1xuXG4gICAgdGhpcy5fX25leHRQb3NpdGlvbiA9IEluZmluaXR5O1xuICAgIHBsYXlDb250cm9sLl9fc2NoZWR1bGVyLmFkZCh0aGlzLCBJbmZpbml0eSk7XG4gIH1cblxuICBhZHZhbmNlVGltZSh0aW1lKSB7XG4gICAgdmFyIHBsYXlDb250cm9sID0gdGhpcy5fX3BsYXlDb250cm9sO1xuICAgIHZhciBlbmdpbmUgPSB0aGlzLl9fZW5naW5lO1xuICAgIHZhciBwb3NpdGlvbiA9IHRoaXMuX19uZXh0UG9zaXRpb247XG4gICAgdmFyIG5leHRQb3NpdGlvbiA9IGVuZ2luZS5hZHZhbmNlUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHBsYXlDb250cm9sLl9fc3BlZWQpO1xuICAgIHZhciBuZXh0VGltZSA9IHBsYXlDb250cm9sLl9fZ2V0VGltZUF0UG9zaXRpb24obmV4dFBvc2l0aW9uKTtcblxuICAgIHRoaXMuX19uZXh0UG9zaXRpb24gPSBuZXh0UG9zaXRpb247XG4gICAgcmV0dXJuIG5leHRUaW1lO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9fcGxheUNvbnRyb2wuY3VycmVudFRpbWU7XG4gIH1cblxuICBnZXQgYXVkaW9UaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9fcGxheUNvbnRyb2wuYXVkaW9UaW1lO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fX3BsYXlDb250cm9sLmN1cnJlbnRQb3NpdGlvbjtcbiAgfVxuXG4gIHJlc2V0UG9zaXRpb24ocG9zaXRpb24gPSB0aGlzLl9fbmV4dFBvc2l0aW9uKSB7XG4gICAgdmFyIHRpbWUgPSB0aGlzLl9fcGxheUNvbnRyb2wuX19nZXRUaW1lQXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgdGhpcy5fX25leHRQb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIHRoaXMucmVzZXRUaW1lKHRpbWUpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl9fcGxheUNvbnRyb2wuX19zY2hlZHVsZXIucmVtb3ZlKHRoaXMpO1xuICAgIHRoaXMuX19wbGF5Q29udHJvbCA9IG51bGw7XG4gICAgdGhpcy5fX2VuZ2luZSA9IG51bGw7XG4gIH1cbn1cblxuLy8gaW50ZXJuYWwgc2NoZWR1bGluZyBxdWV1ZSB0aGF0IHJldHVybnMgdGhlIGN1cnJlbnQgcG9zaXRpb24gKGFuZCB0aW1lKSBvZiB0aGUgcGxheSBjb250cm9sXG5jbGFzcyBQbGF5Q29udHJvbGxlZFNjaGVkdWxpbmdRdWV1ZSBleHRlbmRzIFNjaGVkdWxpbmdRdWV1ZSB7XG4gIGNvbnN0cnVjdG9yKHBsYXlDb250cm9sLCBlbmdpbmUpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX19wbGF5Q29udHJvbCA9IHBsYXlDb250cm9sO1xuICAgIHRoaXMuX19lbmdpbmUgPSBlbmdpbmU7XG5cbiAgICB0aGlzLmFkZChlbmdpbmUsIEluZmluaXR5KTtcbiAgICBwbGF5Q29udHJvbC5fX3NjaGVkdWxlci5hZGQodGhpcywgSW5maW5pdHkpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9fcGxheUNvbnRyb2wuY3VycmVudFRpbWU7XG4gIH1cblxuICBnZXQgYXVkaW9UaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9fcGxheUNvbnRyb2wuYXVkaW9UaW1lO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fX3BsYXlDb250cm9sLmN1cnJlbnRQb3NpdGlvbjtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5fX3BsYXlDb250cm9sLl9fc2NoZWR1bGVyLnJlbW92ZSh0aGlzKTtcbiAgICB0aGlzLnJlbW92ZSh0aGlzLl9fZW5naW5lKTtcblxuICAgIHRoaXMuX19wbGF5Q29udHJvbCA9IG51bGw7XG4gICAgdGhpcy5fX2VuZ2luZSA9IG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBFeHRlbmRzIFRpbWUgRW5naW5lIHRvIHByb3ZpZGUgcGxheWJhY2sgY29udHJvbCBvZiBhIFRpbWUgRW5naW5lIGluc3RhbmNlLlxuICpcbiAqIFtleGFtcGxlXXtAbGluayBodHRwczovL3Jhd2dpdC5jb20vd2F2ZXNqcy93YXZlcy1tYXN0ZXJzL21hc3Rlci9leGFtcGxlcy90cmFuc3BvcnQvaW5kZXguaHRtbH1cbiAqXG4gKiBAZXh0ZW5kcyBUaW1lRW5naW5lXG4gKiBAcGFyYW0ge09iamVjdH0gc2NoZWR1bGVyIC0gaW5zdGFuY2Ugb2YgU2NoZWR1bGVyXG4gKiBAcGFyYW0ge1RpbWVFbmdpbmV9IGVuZ2luZSAtIGVuZ2luZSB0byBjb250cm9sXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIG1hc3RlcnMgZnJvbSAnd2F2ZXMtbWFzdGVycyc7XG4gKlxuICogY29uc3QgZ2V0VGltZUZ1bmN0aW9uID0gKCkgPT4ge1xuICogICBjb25zdCBub3cgPSBwcm9jZXNzLmhydGltZSgpO1xuICogICByZXR1cm4gbm93WzBdICsgbm93WzFdICogMWUtOTtcbiAqIH1cbiAqIGNvbnN0IHNjaGVkdWxlciA9IG5ldyBtYXN0ZXJzLlNjaGVkdWxlcihnZXRUaW1lRnVuY3Rpb24pO1xuICogY29uc3QgcGxheWVyRW5naW5lID0gbmV3IE15VGltZUVuZ2luZSgpO1xuICogY29uc3QgcGxheUNvbnRyb2wgPSBuZXcgbWFzdGVycy5QbGF5Q29udHJvbChzY2hlZHVsZXIsIHBsYXllckVuZ2luZSk7XG4gKlxuICogcGxheUNvbnRyb2wuc3RhcnQoKTtcbiAqL1xuY2xhc3MgUGxheUNvbnRyb2wgZXh0ZW5kcyBUaW1lRW5naW5lIHtcbiAgY29uc3RydWN0b3Ioc2NoZWR1bGVyLCBlbmdpbmUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl9fc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuXG4gICAgdGhpcy5fX3BsYXlDb250cm9sbGVkID0gbnVsbDtcbiAgICB0aGlzLl9fbG9vcENvbnRyb2wgPSBudWxsO1xuICAgIHRoaXMuX19sb29wU3RhcnQgPSAwO1xuICAgIHRoaXMuX19sb29wRW5kID0gMTtcblxuICAgIC8vIHN5bmNocm9uaXplZCB0aWUsIHBvc2l0aW9uLCBhbmQgc3BlZWRcbiAgICB0aGlzLl9fdGltZSA9IDA7XG4gICAgdGhpcy5fX3Bvc2l0aW9uID0gMDtcbiAgICB0aGlzLl9fc3BlZWQgPSAwO1xuXG4gICAgLy8gbm9uLXplcm8gXCJ1c2VyXCIgc3BlZWRcbiAgICB0aGlzLl9fcGxheWluZ1NwZWVkID0gMTtcblxuICAgIGlmIChlbmdpbmUpXG4gICAgICB0aGlzLl9fc2V0RW5naW5lKGVuZ2luZSk7XG4gIH1cblxuICBfX3NldEVuZ2luZShlbmdpbmUpIHtcbiAgICBpZiAoZW5naW5lLm1hc3RlcilcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIm9iamVjdCBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkIHRvIGEgbWFzdGVyXCIpO1xuXG4gICAgaWYgKFRpbWVFbmdpbmUuaW1wbGVtZW50c1NwZWVkQ29udHJvbGxlZChlbmdpbmUpKVxuICAgICAgdGhpcy5fX3BsYXlDb250cm9sbGVkID0gbmV3IFBsYXlDb250cm9sbGVkU3BlZWRDb250cm9sbGVkKHRoaXMsIGVuZ2luZSk7XG4gICAgZWxzZSBpZiAoVGltZUVuZ2luZS5pbXBsZW1lbnRzVHJhbnNwb3J0ZWQoZW5naW5lKSlcbiAgICAgIHRoaXMuX19wbGF5Q29udHJvbGxlZCA9IG5ldyBQbGF5Q29udHJvbGxlZFRyYW5zcG9ydGVkKHRoaXMsIGVuZ2luZSk7XG4gICAgZWxzZSBpZiAoVGltZUVuZ2luZS5pbXBsZW1lbnRzU2NoZWR1bGVkKGVuZ2luZSkpXG4gICAgICB0aGlzLl9fcGxheUNvbnRyb2xsZWQgPSBuZXcgUGxheUNvbnRyb2xsZWRTY2hlZHVsZWQodGhpcywgZW5naW5lKTtcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJvYmplY3QgY2Fubm90IGJlIGFkZGVkIHRvIHBsYXkgY29udHJvbFwiKTtcbiAgfVxuXG4gIF9fcmVzZXRFbmdpbmUoKSB7XG4gICAgdGhpcy5fX3BsYXlDb250cm9sbGVkLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9fcGxheUNvbnRyb2xsZWQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZS9leHRyYXBvbGF0ZSBwbGF5aW5nIHRpbWUgZm9yIGdpdmVuIHBvc2l0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiBwb3NpdGlvblxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGV4dHJhcG9sYXRlZCB0aW1lXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfX2dldFRpbWVBdFBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuX190aW1lICsgKHBvc2l0aW9uIC0gdGhpcy5fX3Bvc2l0aW9uKSAvIHRoaXMuX19zcGVlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUvZXh0cmFwb2xhdGUgcGxheWluZyBwb3NpdGlvbiBmb3IgZ2l2ZW4gdGltZVxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSB0aW1lXG4gICAqIEByZXR1cm4ge051bWJlcn0gZXh0cmFwb2xhdGVkIHBvc2l0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfX2dldFBvc2l0aW9uQXRUaW1lKHRpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fX3Bvc2l0aW9uICsgKHRpbWUgLSB0aGlzLl9fdGltZSkgKiB0aGlzLl9fc3BlZWQ7XG4gIH1cblxuICBfX3N5bmMoKSB7XG4gICAgY29uc3Qgbm93ID0gdGhpcy5jdXJyZW50VGltZTtcbiAgICB0aGlzLl9fcG9zaXRpb24gKz0gKG5vdyAtIHRoaXMuX190aW1lKSAqIHRoaXMuX19zcGVlZDtcbiAgICB0aGlzLl9fdGltZSA9IG5vdztcblxuICAgIHJldHVybiBub3c7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgbWFzdGVyIHRpbWUuXG4gICAqXG4gICAqIEBuYW1lIGN1cnJlbnRUaW1lXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBtZW1iZXJvZiBQbGF5Q29udHJvbFxuICAgKiBAaW5zdGFuY2VcbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgY3VycmVudFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19zY2hlZHVsZXIuY3VycmVudFRpbWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgbWFzdGVyIHRpbWUuXG4gICAqXG4gICAqIEBuYW1lIGF1ZGlvVGltZVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAbWVtYmVyb2YgUGxheUNvbnRyb2xcbiAgICogQGluc3RhbmNlXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IGF1ZGlvVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fX3NjaGVkdWxlci5hdWRpb1RpbWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgbWFzdGVyIHBvc2l0aW9uLlxuICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgcmVwbGFjZWQgd2hlbiB0aGUgcGxheS1jb250cm9sIGlzIGFkZGVkIHRvIGEgbWFzdGVyLlxuICAgKlxuICAgKiBAbmFtZSBjdXJyZW50UG9zaXRpb25cbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQG1lbWJlcm9mIFBsYXlDb250cm9sXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBjdXJyZW50UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX19wb3NpdGlvbiArICh0aGlzLl9fc2NoZWR1bGVyLmN1cnJlbnRUaW1lIC0gdGhpcy5fX3RpbWUpICogdGhpcy5fX3NwZWVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaWYgdGhlIHBsYXkgY29udHJvbCBpcyBydW5uaW5nLlxuICAgKlxuICAgKiBAbmFtZSBydW5uaW5nXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKiBAbWVtYmVyb2YgUGxheUNvbnRyb2xcbiAgICogQGluc3RhbmNlXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IHJ1bm5pbmcoKSB7XG4gICAgcmV0dXJuICEodGhpcy5fX3NwZWVkID09PSAwKTtcbiAgfVxuXG4gIHNldChlbmdpbmUgPSBudWxsKSB7XG4gICAgY29uc3QgdGltZSA9IHRoaXMuX19zeW5jKCk7XG4gICAgY29uc3Qgc3BlZWQgPSB0aGlzLl9fc3BlZWQ7XG5cbiAgICBpZiAodGhpcy5fX3BsYXlDb250cm9sbGVkICE9PSBudWxsICYmIHRoaXMuX19wbGF5Q29udHJvbGxlZC5fX2VuZ2luZSAhPT0gZW5naW5lKSB7XG5cbiAgICAgIHRoaXMuc3luY1NwZWVkKHRpbWUsIHRoaXMuX19wb3NpdGlvbiwgMCk7XG5cbiAgICAgIGlmICh0aGlzLl9fcGxheUNvbnRyb2xsZWQpXG4gICAgICAgIHRoaXMuX19yZXNldEVuZ2luZSgpO1xuXG5cbiAgICAgIGlmICh0aGlzLl9fcGxheUNvbnRyb2xsZWQgPT09IG51bGwgJiYgZW5naW5lICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX19zZXRFbmdpbmUoZW5naW5lKTtcblxuICAgICAgICBpZiAoc3BlZWQgIT09IDApXG4gICAgICAgICAgdGhpcy5zeW5jU3BlZWQodGltZSwgdGhpcy5fX3Bvc2l0aW9uLCBzcGVlZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHBsYXkgY29udHJvbCBsb29wIGJlaGF2aW9yLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQG5hbWUgbG9vcFxuICAgKiBAbWVtYmVyb2YgUGxheUNvbnRyb2xcbiAgICogQGluc3RhbmNlXG4gICAqL1xuICBzZXQgbG9vcChlbmFibGUpIHtcbiAgICBpZiAoZW5hYmxlICYmIHRoaXMuX19sb29wU3RhcnQgPiAtSW5maW5pdHkgJiYgdGhpcy5fX2xvb3BFbmQgPCBJbmZpbml0eSkge1xuICAgICAgaWYgKCF0aGlzLl9fbG9vcENvbnRyb2wpIHtcbiAgICAgICAgdGhpcy5fX2xvb3BDb250cm9sID0gbmV3IExvb3BDb250cm9sKHRoaXMpO1xuICAgICAgICB0aGlzLl9fc2NoZWR1bGVyLmFkZCh0aGlzLl9fbG9vcENvbnRyb2wsIEluZmluaXR5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX19zcGVlZCAhPT0gMCkge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY3VycmVudFBvc2l0aW9uO1xuICAgICAgICBjb25zdCBsb3dlciA9IE1hdGgubWluKHRoaXMuX19sb29wU3RhcnQsIHRoaXMuX19sb29wRW5kKTtcbiAgICAgICAgY29uc3QgdXBwZXIgPSBNYXRoLm1heCh0aGlzLl9fbG9vcFN0YXJ0LCB0aGlzLl9fbG9vcEVuZCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX19zcGVlZCA+IDAgJiYgcG9zaXRpb24gPiB1cHBlcilcbiAgICAgICAgICB0aGlzLnNlZWsodXBwZXIpO1xuICAgICAgICBlbHNlIGlmICh0aGlzLl9fc3BlZWQgPCAwICYmIHBvc2l0aW9uIDwgbG93ZXIpXG4gICAgICAgICAgdGhpcy5zZWVrKGxvd2VyKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRoaXMuX19sb29wQ29udHJvbC5yZXNjaGVkdWxlKHRoaXMuX19zcGVlZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLl9fbG9vcENvbnRyb2wpIHtcbiAgICAgIHRoaXMuX19zY2hlZHVsZXIucmVtb3ZlKHRoaXMuX19sb29wQ29udHJvbCk7XG4gICAgICB0aGlzLl9fbG9vcENvbnRyb2wgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGdldCBsb29wKCkge1xuICAgIHJldHVybiAoISF0aGlzLl9fbG9vcENvbnRyb2wpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgbG9vcCBzdGFydCBhbmQgZW5kIHRpbWUuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsb29wU3RhcnQgLSBsb29wIHN0YXJ0IHZhbHVlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbG9vcEVuZCAtIGxvb3AgZW5kIHZhbHVlLlxuICAgKi9cbiAgc2V0TG9vcEJvdW5kYXJpZXMobG9vcFN0YXJ0LCBsb29wRW5kKSB7XG4gICAgdGhpcy5fX2xvb3BTdGFydCA9IGxvb3BTdGFydDtcbiAgICB0aGlzLl9fbG9vcEVuZCA9IGxvb3BFbmQ7XG5cbiAgICB0aGlzLmxvb3AgPSB0aGlzLmxvb3A7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBsb29wIHN0YXJ0IHZhbHVlXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBuYW1lIGxvb3BTdGFydFxuICAgKiBAbWVtYmVyb2YgUGxheUNvbnRyb2xcbiAgICogQGluc3RhbmNlXG4gICAqL1xuICBzZXQgbG9vcFN0YXJ0KGxvb3BTdGFydCkge1xuICAgIHRoaXMuc2V0TG9vcEJvdW5kYXJpZXMobG9vcFN0YXJ0LCB0aGlzLl9fbG9vcEVuZCk7XG4gIH1cblxuICBnZXQgbG9vcFN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLl9fbG9vcFN0YXJ0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgbG9vcCBlbmQgdmFsdWVcbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQG5hbWUgbG9vcEVuZFxuICAgKiBAbWVtYmVyb2YgUGxheUNvbnRyb2xcbiAgICogQGluc3RhbmNlXG4gICAqL1xuICBzZXQgbG9vcEVuZChsb29wRW5kKSB7XG4gICAgdGhpcy5zZXRMb29wQm91bmRhcmllcyh0aGlzLl9fbG9vcFN0YXJ0LCBsb29wRW5kKTtcbiAgfVxuXG4gIGdldCBsb29wRW5kKCkge1xuICAgIHJldHVybiB0aGlzLl9fbG9vcEVuZDtcbiAgfVxuXG4gIC8vIFRpbWVFbmdpbmUgbWV0aG9kIChzcGVlZC1jb250cm9sbGVkIGludGVyZmFjZSlcbiAgc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCwgc2VlayA9IGZhbHNlKSB7XG4gICAgY29uc3QgbGFzdFNwZWVkID0gdGhpcy5fX3NwZWVkO1xuXG4gICAgaWYgKHNwZWVkICE9PSBsYXN0U3BlZWQgfHwgc2Vlaykge1xuICAgICAgaWYgKChzZWVrIHx8IGxhc3RTcGVlZCA9PT0gMCkgJiYgdGhpcy5fX2xvb3BDb250cm9sKVxuICAgICAgICBwb3NpdGlvbiA9IHRoaXMuX19sb29wQ29udHJvbC5hcHBseUxvb3BCb3VuZGFyaWVzKHBvc2l0aW9uLCBzcGVlZCk7XG5cbiAgICAgIHRoaXMuX190aW1lID0gdGltZTtcbiAgICAgIHRoaXMuX19wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgdGhpcy5fX3NwZWVkID0gc3BlZWQ7XG5cbiAgICAgIGlmICh0aGlzLl9fcGxheUNvbnRyb2xsZWQpXG4gICAgICAgIHRoaXMuX19wbGF5Q29udHJvbGxlZC5zeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHNwZWVkLCBzZWVrLCBsYXN0U3BlZWQpO1xuXG4gICAgICBpZiAodGhpcy5fX2xvb3BDb250cm9sKVxuICAgICAgICB0aGlzLl9fbG9vcENvbnRyb2wucmVzY2hlZHVsZShzcGVlZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyBwbGF5YmFja1xuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgY29uc3QgdGltZSA9IHRoaXMuX19zeW5jKCk7XG4gICAgdGhpcy5zeW5jU3BlZWQodGltZSwgdGhpcy5fX3Bvc2l0aW9uLCB0aGlzLl9fcGxheWluZ1NwZWVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXVzZXMgcGxheWJhY2sgYW5kIHN0YXlzIGF0IHRoZSBzYW1lIHBvc2l0aW9uLlxuICAgKi9cbiAgcGF1c2UoKSB7XG4gICAgY29uc3QgdGltZSA9IHRoaXMuX19zeW5jKCk7XG4gICAgdGhpcy5zeW5jU3BlZWQodGltZSwgdGhpcy5fX3Bvc2l0aW9uLCAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wcyBwbGF5YmFjayBhbmQgc2Vla3MgdG8gaW5pdGlhbCAoMCkgcG9zaXRpb24uXG4gICAqL1xuICBzdG9wKCkge1xuICAgIGNvbnN0IHRpbWUgPSB0aGlzLl9fc3luYygpO1xuICAgIHRoaXMuc3luY1NwZWVkKHRpbWUsIDAsIDAsIHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHNwZWVkIGlmIHByb3ZpZGVkLCBzZXRzIHRoZSBwbGF5YmFjayBzcGVlZC4gVGhlIHNwZWVkIHZhbHVlIHNob3VsZFxuICAgKiBiZSBub24temVybyBiZXR3ZWVuIC0xNiBhbmQgLTEvMTYgb3IgYmV0d2VlbiAxLzE2IGFuZCAxNi5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQG5hbWUgc3BlZWRcbiAgICogQG1lbWJlcm9mIFBsYXlDb250cm9sXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgc2V0IHNwZWVkKHNwZWVkKSB7XG4gICAgY29uc3QgdGltZSA9IHRoaXMuX19zeW5jKCk7XG5cbiAgICBpZiAoc3BlZWQgPj0gMCkge1xuICAgICAgaWYgKHNwZWVkIDwgMC4wMSlcbiAgICAgICAgc3BlZWQgPSAwLjAxO1xuICAgICAgZWxzZSBpZiAoc3BlZWQgPiAxMDApXG4gICAgICAgIHNwZWVkID0gMTAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3BlZWQgPCAtMTAwKVxuICAgICAgICBzcGVlZCA9IC0xMDA7XG4gICAgICBlbHNlIGlmIChzcGVlZCA+IC0wLjAxKVxuICAgICAgICBzcGVlZCA9IC0wLjAxO1xuICAgIH1cblxuICAgIHRoaXMuX19wbGF5aW5nU3BlZWQgPSBzcGVlZDtcblxuICAgIGlmICghdGhpcy5tYXN0ZXIgJiYgdGhpcy5fX3NwZWVkICE9PSAwKVxuICAgICAgdGhpcy5zeW5jU3BlZWQodGltZSwgdGhpcy5fX3Bvc2l0aW9uLCBzcGVlZCk7XG4gIH1cblxuICBnZXQgc3BlZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19wbGF5aW5nU3BlZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0IChqdW1wIHRvKSBwbGF5aW5nIHBvc2l0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gdGFyZ2V0IHBvc2l0aW9uXG4gICAqL1xuICBzZWVrKHBvc2l0aW9uKSB7XG4gICAgY29uc3QgdGltZSA9IHRoaXMuX19zeW5jKCk7XG4gICAgdGhpcy5fX3Bvc2l0aW9uID0gcG9zaXRpb247XG4gICAgdGhpcy5zeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHRoaXMuX19zcGVlZCwgdHJ1ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheUNvbnRyb2w7XG4iLCJpbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IFNjaGVkdWxpbmdRdWV1ZSBmcm9tICcuLi9jb3JlL1NjaGVkdWxpbmdRdWV1ZSc7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCd3YXZlc2pzOm1hc3RlcnMnKTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihmdW5jdGlvblRvQ2hlY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uVG9DaGVjayAmJiB7fS50b1N0cmluZy5jYWxsKGZ1bmN0aW9uVG9DaGVjaykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogVGhlIGBTY2hlZHVsZXJgIGNsYXNzIGltcGxlbWVudHMgYSBtYXN0ZXIgZm9yIGBUaW1lRW5naW5lYCBpbnN0YW5jZXNcbiAqIHRoYXQgaW1wbGVtZW50IHRoZSAqc2NoZWR1bGVkKiBpbnRlcmZhY2UgKHN1Y2ggYXMgdGhlIGBNZXRyb25vbWVgIGFuZFxuICogYEdyYW51bGFyRW5naW5lYCkuXG4gKlxuICogQSBgU2NoZWR1bGVyYCBjYW4gYWxzbyBzY2hlZHVsZSBzaW1wbGUgY2FsbGJhY2sgZnVuY3Rpb25zLlxuICogVGhlIGNsYXNzIGlzIGJhc2VkIG9uIHJlY3Vyc2l2ZSBjYWxscyB0byBgc2V0VGltZW91dGAgYW5kIHVzZXMgdGhlIHRpbWVcbiAqIHJldHVybmVkIGJ5IHRoZSBgZ2V0VGltZUZ1bmN0aW9uYCBwYXNzZWQgYXMgZmlyc3QgYXJndW1lbnQgYXMgYSBsb2dpY2FsIHRpbWVcbiAqIHBhc3NlZCB0byB0aGUgYGFkdmFuY2VUaW1lYCBtZXRob2RzIG9mIHRoZSBzY2hlZHVsZWQgZW5naW5lcyBvciB0byB0aGVcbiAqIHNjaGVkdWxlZCBjYWxsYmFjayBmdW5jdGlvbnMuXG4gKiBJdCBleHRlbmRzIHRoZSBgU2NoZWR1bGluZ1F1ZXVlYCBjbGFzcyB0aGF0IGl0c2VsZiBpbmNsdWRlcyBhIGBQcmlvcml0eVF1ZXVlYFxuICogdG8gYXNzdXJlIHRoZSBvcmRlciBvZiB0aGUgc2NoZWR1bGVkIGVuZ2luZXMgKHNlZSBgU2ltcGxlU2NoZWR1bGVyYCBmb3IgYVxuICogc2ltcGxpZmllZCBzY2hlZHVsZXIgaW1wbGVtZW50YXRpb24gd2l0aG91dCBgUHJpb3JpdHlRdWV1ZWApLlxuICpcbiAqIHtAbGluayBodHRwczovL3Jhd2dpdC5jb20vd2F2ZXNqcy93YXZlcy1tYXN0ZXJzL21hc3Rlci9leGFtcGxlcy9zY2hlZHVsZXIvaW5kZXguaHRtbH1cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBnZXRUaW1lRnVuY3Rpb24gLSBGdW5jdGlvbiB0aGF0IG11c3QgcmV0dXJuIGEgdGltZSBpbiBzZWNvbmQuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIC0gZGVmYXVsdCBvcHRpb25zLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnBlcmlvZD0wLjAyNV0gLSBwZXJpb2Qgb2YgdGhlIHNjaGVkdWxlci5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5sb29rYWhlYWQ9MC4xXSAtIGxvb2thaGVhZCBvZiB0aGUgc2NoZWR1bGVyLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmN1cnJlbnRUaW1lVG9BdWRpb1RpbWVGdW5jdGlvbl0gLSBmdW5jdGlvbiB0aGF0IGNvbnZlcnRcbiAqICBgY3VycmVudFRpbWVgIHRvIGBhdWRpb1RpbWVgLiBEZWZhdWx0cyB0byBuby1vcC5cbiAqXG4gKiBAc2VlIFRpbWVFbmdpbmVcbiAqIEBzZWUgU2ltcGxlU2NoZWR1bGVyXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIG1hc3RlcnMgZnJvbSAnd2F2ZXMtbWFzdGVycyc7XG4gKlxuICogY29uc3QgZ2V0VGltZUZ1bmN0aW9uID0gKCkgPT4gcHJlZm9ybWFuY2Uubm93KCkgLyAxMDAwO1xuICogY29uc3Qgc2NoZWR1bGVyID0gbmV3IG1hc3RlcnMuU2NoZWR1bGVyKGdldFRpbWVGdW5jdGlvbik7XG4gKlxuICogc2NoZWR1bGVyLmFkZChteUVuZ2luZSk7XG4gKi9cbmNsYXNzIFNjaGVkdWxlciBleHRlbmRzIFNjaGVkdWxpbmdRdWV1ZSB7XG4gIGNvbnN0cnVjdG9yKGdldFRpbWVGdW5jdGlvbiwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmICghaXNGdW5jdGlvbihnZXRUaW1lRnVuY3Rpb24pKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFyZ3VtZW50IGBnZXRUaW1lRnVuY3Rpb25gJyk7XG5cbiAgICB0aGlzLmdldFRpbWVGdW5jdGlvbiA9IGdldFRpbWVGdW5jdGlvbjtcblxuICAgIHRoaXMuX19jdXJyZW50VGltZSA9IG51bGw7XG4gICAgdGhpcy5fX25leHRUaW1lID0gSW5maW5pdHk7XG4gICAgdGhpcy5fX3RpbWVvdXQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogc2NoZWR1bGVyIChzZXRUaW1lb3V0KSBwZXJpb2RcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBuYW1lIHBlcmlvZFxuICAgICAqIEBtZW1iZXJvZiBTY2hlZHVsZXJcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICB0aGlzLnBlcmlvZCA9IG9wdGlvbnMucGVyaW9kIHx8IMKgMC4wMjU7XG5cbiAgICAvKipcbiAgICAgKiBzY2hlZHVsZXIgbG9va2FoZWFkIHRpbWUgKD4gcGVyaW9kKVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG5hbWUgbG9va2FoZWFkXG4gICAgICogQG1lbWJlcm9mIFNjaGVkdWxlclxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIHRoaXMubG9va2FoZWFkID0gb3B0aW9ucy5sb29rYWhlYWQgfHwgwqAwLjE7XG5cbiAgICB0aGlzLl9jdXJyZW50VGltZVRvQXVkaW9UaW1lRnVuY3Rpb24gPVxuICAgICAgb3B0aW9ucy5jdXJyZW50VGltZVRvQXVkaW9UaW1lRnVuY3Rpb24gfHzCoGZ1bmN0aW9uKGN1cnJlbnRUaW1lKSB7IHJldHVybiBjdXJyZW50VGltZSB9O1xuICB9XG5cbiAgLy8gc2V0VGltZW91dCBzY2hlZHVsaW5nIGxvb3BcbiAgX190aWNrKCkge1xuICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gdGhpcy5nZXRUaW1lRnVuY3Rpb24oKTtcbiAgICBsZXQgdGltZSA9IHRoaXMuX19uZXh0VGltZTtcblxuICAgIHRoaXMuX190aW1lb3V0ID0gbnVsbDtcblxuICAgIHdoaWxlICh0aW1lIDw9IGN1cnJlbnRUaW1lICsgdGhpcy5sb29rYWhlYWQpIHtcbiAgICAgIHRoaXMuX19jdXJyZW50VGltZSA9IHRpbWU7XG4gICAgICB0aW1lID0gdGhpcy5hZHZhbmNlVGltZSh0aW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLl9fY3VycmVudFRpbWUgPSBudWxsO1xuICAgIHRoaXMucmVzZXRUaW1lKHRpbWUpO1xuICB9XG5cbiAgcmVzZXRUaW1lKHRpbWUgPSB0aGlzLmN1cnJlbnRUaW1lKSB7XG4gICAgaWYgKHRoaXMubWFzdGVyKSB7XG4gICAgICB0aGlzLm1hc3Rlci5yZXNldCh0aGlzLCB0aW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuX190aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9fdGltZW91dCk7XG4gICAgICAgIHRoaXMuX190aW1lb3V0ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRpbWUgIT09IEluZmluaXR5KSB7XG4gICAgICAgIGlmICh0aGlzLl9fbmV4dFRpbWUgPT09IEluZmluaXR5KVxuICAgICAgICAgIGxvZygnU2NoZWR1bGVyIFN0YXJ0Jyk7XG5cbiAgICAgICAgY29uc3QgdGltZU91dERlbGF5ID0gTWF0aC5tYXgoKHRpbWUgLSB0aGlzLmxvb2thaGVhZCAtIHRoaXMuZ2V0VGltZUZ1bmN0aW9uKCkpLCB0aGlzLnBlcmlvZCk7XG5cbiAgICAgICAgdGhpcy5fX3RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9fdGljaygpO1xuICAgICAgICB9LCBNYXRoLmNlaWwodGltZU91dERlbGF5ICogMTAwMCkpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9fbmV4dFRpbWUgIT09IEluZmluaXR5KSB7XG4gICAgICAgIGxvZygnU2NoZWR1bGVyIFN0b3AnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fX25leHRUaW1lID0gdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2NoZWR1bGVyIGN1cnJlbnQgbG9naWNhbCB0aW1lLlxuICAgKlxuICAgKiBAbmFtZSBjdXJyZW50VGltZVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAbWVtYmVyb2YgU2NoZWR1bGVyXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgZ2V0IGN1cnJlbnRUaW1lKCkge1xuICAgIC8vIEBub3RlIC0gY2FuIHRoaXMgcmVhbGx5IGhhcHBlbiwgYW5kIGlmIHllcywgaW4gd2hpY2ggY2FzZT9cbiAgICBpZiAodGhpcy5tYXN0ZXIpXG4gICAgICByZXR1cm4gdGhpcy5tYXN0ZXIuY3VycmVudFRpbWU7XG5cbiAgICByZXR1cm4gdGhpcy5fX2N1cnJlbnRUaW1lIHx8IHRoaXMuZ2V0VGltZUZ1bmN0aW9uKCkgKyB0aGlzLmxvb2thaGVhZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTY2hlZHVsZXIgY3VycmVudCBhdWRpbyB0aW1lIGFjY29yZGluZyB0byBgY3VycmVudFRpbWVgXG4gICAqXG4gICAqIEBuYW1lIGF1ZGlvVGltZVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAbWVtYmVyaWYgU2NoZWR1bGVyXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgZ2V0IGF1ZGlvVGltZSgpIHtcbiAgICAvLyBAbm90ZSAtIGFkZCB0aGlzIGFzIGluXG4gICAgaWYgKHRoaXMubWFzdGVyKVxuICAgICAgcmV0dXJuIHRoaXMubWFzdGVyLmF1ZGlvVGltZTtcblxuICAgIHJldHVybiB0aGlzLl9jdXJyZW50VGltZVRvQXVkaW9UaW1lRnVuY3Rpb24odGhpcy5jdXJyZW50VGltZSk7XG4gIH1cblxuICBnZXQgY3VycmVudFBvc2l0aW9uKCkge1xuICAgIGNvbnN0IG1hc3RlciA9IHRoaXMubWFzdGVyO1xuXG4gICAgaWYgKG1hc3RlciAmJiBtYXN0ZXIuY3VycmVudFBvc2l0aW9uICE9PSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4gbWFzdGVyLmN1cnJlbnRQb3NpdGlvbjtcblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuXG5cbiAgLy8gaW5oZXJpdGVkIGZyb20gc2NoZWR1bGluZyBxdWV1ZVxuICAvKipcbiAgICogQWRkIGEgVGltZUVuZ2luZSBvciBhIHNpbXBsZSBjYWxsYmFjayBmdW5jdGlvbiB0byB0aGUgc2NoZWR1bGVyIGF0IGFuXG4gICAqIG9wdGlvbmFsbHkgZ2l2ZW4gdGltZS4gV2hldGhlciB0aGUgYWRkIG1ldGhvZCBpcyBjYWxsZWQgd2l0aCBhIFRpbWVFbmdpbmVcbiAgICogb3IgYSBjYWxsYmFjayBmdW5jdGlvbiBpdCByZXR1cm5zIGEgVGltZUVuZ2luZSB0aGF0IGNhbiBiZSB1c2VkIGFzIGFyZ3VtZW50XG4gICAqIG9mIHRoZSBtZXRob2RzIHJlbW92ZSBhbmQgcmVzZXRFbmdpbmVUaW1lLiBBIFRpbWVFbmdpbmUgYWRkZWQgdG8gYSBzY2hlZHVsZXJcbiAgICogaGFzIHRvIGltcGxlbWVudCB0aGUgc2NoZWR1bGVkIGludGVyZmFjZS4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGFkZGVkIHRvIGFcbiAgICogc2NoZWR1bGVyIHdpbGwgYmUgY2FsbGVkIGF0IHRoZSBnaXZlbiB0aW1lIGFuZCB3aXRoIHRoZSBnaXZlbiB0aW1lIGFzXG4gICAqIGFyZ3VtZW50LiBUaGUgY2FsbGJhY2sgY2FuIHJldHVybiBhIG5ldyBzY2hlZHVsaW5nIHRpbWUgKGkuZS4gdGhlIG5leHRcbiAgICogdGltZSB3aGVuIGl0IHdpbGwgYmUgY2FsbGVkKSBvciBpdCBjYW4gcmV0dXJuIEluZmluaXR5IHRvIHN1c3BlbmQgc2NoZWR1bGluZ1xuICAgKiB3aXRob3V0IHJlbW92aW5nIHRoZSBmdW5jdGlvbiBmcm9tIHRoZSBzY2hlZHVsZXIuIEEgZnVuY3Rpb24gdGhhdCBkb2VzXG4gICAqIG5vdCByZXR1cm4gYSB2YWx1ZSAob3IgcmV0dXJucyBudWxsIG9yIDApIGlzIHJlbW92ZWQgZnJvbSB0aGUgc2NoZWR1bGVyXG4gICAqIGFuZCBjYW5ub3QgYmUgdXNlZCBhcyBhcmd1bWVudCBvZiB0aGUgbWV0aG9kcyByZW1vdmUgYW5kIHJlc2V0RW5naW5lVGltZVxuICAgKiBhbnltb3JlLlxuICAgKlxuICAgKiBAbmFtZSBhZGRcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJvZiBTY2hlZHVsZXJcbiAgICogQGluc3RhbmNlXG4gICAqIEBwYXJhbSB7VGltZUVuZ2luZXxGdW5jdGlvbn0gZW5naW5lIC0gRW5naW5lIHRvIGFkZCB0byB0aGUgc2NoZWR1bGVyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbdGltZT10aGlzLmN1cnJlbnRUaW1lXSAtIFNjaGVkdWxlIHRpbWVcbiAgICovXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBUaW1lRW5naW5lIGZyb20gdGhlIHNjaGVkdWxlciB0aGF0IGhhcyBiZWVuIGFkZGVkIHRvIHRoZVxuICAgKiBzY2hlZHVsZXIgdXNpbmcgdGhlIGFkZCBtZXRob2QuXG4gICAqXG4gICAqIEBuYW1lIGFkZFxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlcm9mIFNjaGVkdWxlclxuICAgKiBAaW5zdGFuY2VcbiAgICogQHBhcmFtIHtUaW1lRW5naW5lfSBlbmdpbmUgLSBFbmdpbmUgdG8gcmVtb3ZlIGZyb20gdGhlIHNjaGVkdWxlclxuICAgKiBAcGFyYW0ge051bWJlcn0gW3RpbWU9dGhpcy5jdXJyZW50VGltZV0gLSBTY2hlZHVsZSB0aW1lXG4gICAqL1xuICAvKipcbiAgICogUmVzY2hlZHVsZSBhIHNjaGVkdWxlZCB0aW1lIGVuZ2luZSBhdCBhIGdpdmVuIHRpbWUuXG4gICAqXG4gICAqIEBuYW1lIHJlc2V0RW5naW5lVGltZVxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlcm9mIFNjaGVkdWxlclxuICAgKiBAaW5zdGFuY2VcbiAgICogQHBhcmFtIHtUaW1lRW5naW5lfSBlbmdpbmUgLSBFbmdpbmUgdG8gcmVzY2hlZHVsZVxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIFNjaGVkdWxlIHRpbWVcbiAgICovXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIHNjaGVkdWxlZCBjYWxsYmFja3MgYW5kIGVuZ2luZXMgZnJvbSB0aGUgc2NoZWR1bGVyLlxuICAgKlxuICAgKiBAbmFtZSBjbGVhclxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlcm9mIFNjaGVkdWxlclxuICAgKiBAaW5zdGFuY2VcbiAgICovXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjaGVkdWxlcjtcbiIsImltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgVGltZUVuZ2luZSBmcm9tICcuLi9jb3JlL1RpbWVFbmdpbmUnO1xuXG5jb25zdCBsb2cgPSBkZWJ1Zygnd2F2ZXNqczptYXN0ZXJzJyk7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oZnVuY3Rpb25Ub0NoZWNrKSB7XG4gIHJldHVybiBmdW5jdGlvblRvQ2hlY2sgJiYge30udG9TdHJpbmcuY2FsbChmdW5jdGlvblRvQ2hlY2spID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqXG4gKlxuICpcbiAqIFRoZSBTaW1wbGVTY2hlZHVsZXIgY2xhc3MgaW1wbGVtZW50cyBhIHNpbXBsaWZpZWQgbWFzdGVyIGZvciB0aW1lIGVuZ2luZXNcbiAqIChzZWUgVGltZUVuZ2luZSkgdGhhdCBpbXBsZW1lbnQgdGhlIHNjaGVkdWxlZCBpbnRlcmZhY2VcbiAqIHN1Y2ggYXMgdGhlIE1ldHJvbm9tZSBhbmQgdGhlIEdyYW51bGFyRW5naW5lLiBUaGUgQVBJIGFuZCBmdW50aW9uYWxpdGllcyBvZlxuICogdGhlIFNpbXBsZVNjaGVkdWxlciBjbGFzcyBhcmUgaWRlbnRpY2FsIHRvIHRoZSBTY2hlZHVsZXIgY2xhc3MuIEJ1dCwgb3RoZXJcbiAqIHRoYW4gdGhlIFNjaGVkdWxlciwgdGhlIFNpbXBsZVNjaGVkdWxlciBjbGFzcyBkb2VzIG5vdCBndWFyYW50ZWUgdGhlIG9yZGVyXG4gKiBvZiBldmVudHMgKGkuZS4gY2FsbHMgdG8gdGhlIGFkdmFuY2VUaW1lIG1ldGhvZCBvZiBzY2hlZHVsZWQgdGltZSBlbmdpbmVzXG4gKiBhbmQgdG8gc2NoZWR1bGVkIGNhbGxiYWNrIGZ1bmN0aW9ucykgd2l0aGluIGEgc2NoZWR1bGluZyBwZXJpb2QgKHNlZSBwZXJpb2RcbiAqIGF0dHJpYnV0ZSkuXG4gKlxuICoge0BsaW5rIGh0dHBzOi8vcmF3Z2l0LmNvbS93YXZlc2pzL3dhdmVzLW1hc3RlcnMvbWFzdGVyL2V4YW1wbGVzL3NjaGVkdWxlci9pbmRleC5odG1sfVxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGdldFRpbWVGdW5jdGlvbiAtIEZ1bmN0aW9uIHRoYXQgbXVzdCByZXR1cm4gYSB0aW1lIGluIHNlY29uZC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBkZWZhdWx0IG9wdGlvbnNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5wZXJpb2Q9MC4wMjVdIC0gcGVyaW9kIG9mIHRoZSBzY2hlZHVsZXIuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubG9va2FoZWFkPTAuMV0gLSBsb29rYWhlYWQgb2YgdGhlIHNjaGVkdWxlci5cbiAqXG4gKiBAc2VlIFRpbWVFbmdpbmVcbiAqIEBzZWUgU2NoZWR1bGVyXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIG1hc3RlcnMgZnJvbSAnd2F2ZXMtbWFzdGVycyc7XG4gKlxuICogY29uc3QgZ2V0VGltZUZ1bmN0aW9uID0gKCkgPT4gcHJlZm9ybWFuY2Uubm93KCkgLyAxMDAwO1xuICogY29uc3Qgc2NoZWR1bGVyID0gbmV3IG1hc3RlcnMuU2ltcGxlU2NoZWR1bGVyKGdldFRpbWVGdW5jdGlvbik7XG4gKlxuICogc2NoZWR1bGVyLmFkZChteUVuZ2luZSk7XG4gKi9cbmNsYXNzIFNpbXBsZVNjaGVkdWxlciB7XG4gIGNvbnN0cnVjdG9yKGdldFRpbWVGdW5jdGlvbiwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKCFpc0Z1bmN0aW9uKGdldFRpbWVGdW5jdGlvbikpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnQgYGdldFRpbWVGdW5jdGlvbmAnKTtcblxuICAgIHRoaXMuZ2V0VGltZUZ1bmN0aW9uID0gZ2V0VGltZUZ1bmN0aW9uO1xuXG4gICAgdGhpcy5fX2VuZ2luZXMgPSBuZXcgU2V0KCk7XG5cbiAgICB0aGlzLl9fc2NoZWRFbmdpbmVzID0gW107XG4gICAgdGhpcy5fX3NjaGVkVGltZXMgPSBbXTtcblxuICAgIHRoaXMuX19jdXJyZW50VGltZSA9IG51bGw7XG4gICAgdGhpcy5fX3RpbWVvdXQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogc2NoZWR1bGVyIChzZXRUaW1lb3V0KSBwZXJpb2RcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBuYW1lIHBlcmlvZFxuICAgICAqIEBtZW1iZXJvZiBTY2hlZHVsZXJcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICB0aGlzLnBlcmlvZCA9IG9wdGlvbnMucGVyaW9kIHx8IDAuMDI1O1xuXG4gICAgLyoqXG4gICAgICogc2NoZWR1bGVyIGxvb2thaGVhZCB0aW1lICg+IHBlcmlvZClcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBuYW1lIGxvb2thaGVhZFxuICAgICAqIEBtZW1iZXJvZiBTY2hlZHVsZXJcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICB0aGlzLmxvb2thaGVhZCA9IG9wdGlvbnMubG9va2FoZWFkIHx8IDAuMTtcblxuICAgIHRoaXMuX2N1cnJlbnRUaW1lVG9BdWRpb1RpbWVGdW5jdGlvbiA9XG4gICAgICBvcHRpb25zLmN1cnJlbnRUaW1lVG9BdWRpb1RpbWVGdW5jdGlvbiB8fMKgZnVuY3Rpb24oY3VycmVudFRpbWUpIHsgcmV0dXJuIGN1cnJlbnRUaW1lIH07XG4gIH1cblxuICBfX3NjaGVkdWxlRW5naW5lKGVuZ2luZSwgdGltZSkge1xuICAgIHRoaXMuX19zY2hlZEVuZ2luZXMucHVzaChlbmdpbmUpO1xuICAgIHRoaXMuX19zY2hlZFRpbWVzLnB1c2godGltZSk7XG4gIH1cblxuICBfX3Jlc2NoZWR1bGVFbmdpbmUoZW5naW5lLCB0aW1lKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9fc2NoZWRFbmdpbmVzLmluZGV4T2YoZW5naW5lKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBpZiAodGltZSAhPT0gSW5maW5pdHkpIHtcbiAgICAgICAgdGhpcy5fX3NjaGVkVGltZXNbaW5kZXhdID0gdGltZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX19zY2hlZEVuZ2luZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5fX3NjaGVkVGltZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRpbWUgPCBJbmZpbml0eSkge1xuICAgICAgdGhpcy5fX3NjaGVkRW5naW5lcy5wdXNoKGVuZ2luZSk7XG4gICAgICB0aGlzLl9fc2NoZWRUaW1lcy5wdXNoKHRpbWUpO1xuICAgIH1cbiAgfVxuXG4gIF9fdW5zY2hlZHVsZUVuZ2luZShlbmdpbmUpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX19zY2hlZEVuZ2luZXMuaW5kZXhPZihlbmdpbmUpO1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHRoaXMuX19zY2hlZEVuZ2luZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIHRoaXMuX19zY2hlZFRpbWVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG5cbiAgX19yZXNldFRpY2soKSB7XG4gICAgaWYgKHRoaXMuX19zY2hlZEVuZ2luZXMubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKCF0aGlzLl9fdGltZW91dCkge1xuICAgICAgICBsb2coJ1NpbXBsZVNjaGVkdWxlciBTdGFydCcpO1xuICAgICAgICB0aGlzLl9fdGljaygpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5fX3RpbWVvdXQpIHtcbiAgICAgIGxvZygnU2ltcGxlU2NoZWR1bGVyIFN0b3AnKTtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9fdGltZW91dCk7XG4gICAgICB0aGlzLl9fdGltZW91dCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgX190aWNrKCkge1xuICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gdGhpcy5nZXRUaW1lRnVuY3Rpb24oKTtcbiAgICBsZXQgaSA9IDA7XG5cbiAgICB3aGlsZSAoaSA8IHRoaXMuX19zY2hlZEVuZ2luZXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBlbmdpbmUgPSB0aGlzLl9fc2NoZWRFbmdpbmVzW2ldO1xuICAgICAgbGV0IHRpbWUgPSB0aGlzLl9fc2NoZWRUaW1lc1tpXTtcblxuICAgICAgd2hpbGUgKHRpbWUgJiYgdGltZSA8PSBjdXJyZW50VGltZSArIHRoaXMubG9va2FoZWFkKSB7XG4gICAgICAgIHRpbWUgPSBNYXRoLm1heCh0aW1lLCBjdXJyZW50VGltZSk7XG4gICAgICAgIHRoaXMuX19jdXJyZW50VGltZSA9IHRpbWU7XG4gICAgICAgIHRpbWUgPSBlbmdpbmUuYWR2YW5jZVRpbWUodGltZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aW1lICYmIHRpbWUgPCBJbmZpbml0eSkge1xuICAgICAgICB0aGlzLl9fc2NoZWRUaW1lc1tpKytdID0gdGltZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX191bnNjaGVkdWxlRW5naW5lKGVuZ2luZSk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGVuZ2luZSBmcm9tIHNjaGVkdWxlclxuICAgICAgICBpZiAoIXRpbWUpIHtcbiAgICAgICAgICBlbmdpbmUubWFzdGVyID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9fZW5naW5lcy5kZWxldGUoZW5naW5lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX19jdXJyZW50VGltZSA9IG51bGw7XG4gICAgdGhpcy5fX3RpbWVvdXQgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMuX19zY2hlZEVuZ2luZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fX3RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5fX3RpY2soKTtcbiAgICAgIH0sIHRoaXMucGVyaW9kICogMTAwMCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNjaGVkdWxlciBjdXJyZW50IGxvZ2ljYWwgdGltZS5cbiAgICpcbiAgICogQG5hbWUgY3VycmVudFRpbWVcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQG1lbWJlcm9mIFNjaGVkdWxlclxuICAgKiBAaW5zdGFuY2VcbiAgICovXG4gIGdldCBjdXJyZW50VGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fX2N1cnJlbnRUaW1lIHx8IHRoaXMuZ2V0VGltZUZ1bmN0aW9uKCkgKyB0aGlzLmxvb2thaGVhZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTY2hlZHVsZXIgY3VycmVudCBhdWRpbyB0aW1lIGFjY29yZGluZyB0byBgY3VycmVudFRpbWVgXG4gICAqXG4gICAqIEBuYW1lIGF1ZGlvVGltZVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAbWVtYmVyaWYgU2NoZWR1bGVyXG4gICAqIEBpbnN0YW5jZVxuICAgKi9cbiAgZ2V0IGF1ZGlvVGltZSgpIHtcbiAgICAvLyBAbm90ZSAtIGFkZCB0aGlzIGFzIGluXG4gICAgaWYgKHRoaXMubWFzdGVyKVxuICAgICAgcmV0dXJuIHRoaXMubWFzdGVyLmF1ZGlvVGltZTtcblxuICAgIHJldHVybiB0aGlzLl9jdXJyZW50VGltZVRvQXVkaW9UaW1lRnVuY3Rpb24odGhpcy5jdXJyZW50VGltZSk7XG4gIH1cblxuICBnZXQgY3VycmVudFBvc2l0aW9uKCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvLyBjYWxsIGEgZnVuY3Rpb24gYXQgYSBnaXZlbiB0aW1lXG4gIC8qKlxuICAgKiBEZWZlciB0aGUgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24gYXQgYSBnaXZlbiB0aW1lLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW4gLSBGdW5jdGlvbiB0byBkZWZlclxuICAgKiBAcGFyYW0ge051bWJlcn0gW3RpbWU9dGhpcy5jdXJyZW50VGltZV0gLSBTY2hlZHVsZSB0aW1lXG4gICAqL1xuICBkZWZlcihmdW4sIHRpbWUgPSB0aGlzLmN1cnJlbnRUaW1lKSB7XG4gICAgaWYgKCEoZnVuIGluc3RhbmNlb2YgRnVuY3Rpb24pKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwib2JqZWN0IGNhbm5vdCBiZSBkZWZlcmVkIGJ5IHNjaGVkdWxlclwiKTtcblxuICAgIHRoaXMuYWRkKHtcbiAgICAgIGFkdmFuY2VUaW1lOiBmdW5jdGlvbih0aW1lKSB7IGZ1bih0aW1lKTsgfSwgLy8gbWFrZSBzdXIgdGhhdCB0aGUgYWR2YW5jZVRpbWUgbWV0aG9kIGRvZXMgbm90IHJldHVybSBhbnl0aGluZ1xuICAgIH0sIHRpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIFRpbWVFbmdpbmUgZnVuY3Rpb24gdG8gdGhlIHNjaGVkdWxlciBhdCBhbiBvcHRpb25hbGx5IGdpdmVuIHRpbWUuXG4gICAqXG4gICAqIEBwYXJhbSB7VGltZUVuZ2luZX0gZW5naW5lIC0gRW5naW5lIHRvIGFkZCB0byB0aGUgc2NoZWR1bGVyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbdGltZT10aGlzLmN1cnJlbnRUaW1lXSAtIFNjaGVkdWxlIHRpbWVcbiAgICovXG4gIGFkZChlbmdpbmUsIHRpbWUgPSB0aGlzLmN1cnJlbnRUaW1lKSB7XG4gICAgaWYgKCFUaW1lRW5naW5lLmltcGxlbWVudHNTY2hlZHVsZWQoZW5naW5lKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIm9iamVjdCBjYW5ub3QgYmUgYWRkZWQgdG8gc2NoZWR1bGVyXCIpO1xuXG4gICAgaWYgKGVuZ2luZS5tYXN0ZXIpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJvYmplY3QgaGFzIGFscmVhZHkgYmVlbiBhZGRlZCB0byBhIG1hc3RlclwiKTtcblxuICAgIC8vIHNldCBtYXN0ZXIgYW5kIGFkZCB0byBhcnJheVxuICAgIGVuZ2luZS5tYXN0ZXIgPSB0aGlzO1xuICAgIHRoaXMuX19lbmdpbmVzLmFkZChlbmdpbmUpO1xuXG4gICAgLy8gc2NoZWR1bGUgZW5naW5lXG4gICAgdGhpcy5fX3NjaGVkdWxlRW5naW5lKGVuZ2luZSwgdGltZSk7XG4gICAgdGhpcy5fX3Jlc2V0VGljaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIFRpbWVFbmdpbmUgZnJvbSB0aGUgc2NoZWR1bGVyIHRoYXQgaGFzIGJlZW4gYWRkZWQgdG8gdGhlXG4gICAqIHNjaGVkdWxlciB1c2luZyB0aGUgYWRkIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHtUaW1lRW5naW5lfSBlbmdpbmUgLSBFbmdpbmUgdG8gcmVtb3ZlIGZyb20gdGhlIHNjaGVkdWxlclxuICAgKiBAcGFyYW0ge051bWJlcn0gW3RpbWU9dGhpcy5jdXJyZW50VGltZV0gLSBTY2hlZHVsZSB0aW1lXG4gICAqL1xuICByZW1vdmUoZW5naW5lKSB7XG4gICAgaWYgKCFlbmdpbmUubWFzdGVyIHx8IGVuZ2luZS5tYXN0ZXIgIT09IHRoaXMpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJlbmdpbmUgaGFzIG5vdCBiZWVuIGFkZGVkIHRvIHRoaXMgc2NoZWR1bGVyXCIpO1xuXG4gICAgLy8gcmVzZXQgbWFzdGVyIGFuZCByZW1vdmUgZnJvbSBhcnJheVxuICAgIGVuZ2luZS5tYXN0ZXIgPSBudWxsO1xuICAgIHRoaXMuX19lbmdpbmVzLmRlbGV0ZShlbmdpbmUpO1xuXG4gICAgLy8gdW5zY2hlZHVsZSBlbmdpbmVcbiAgICB0aGlzLl9fdW5zY2hlZHVsZUVuZ2luZShlbmdpbmUpO1xuICAgIHRoaXMuX19yZXNldFRpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNjaGVkdWxlIGEgc2NoZWR1bGVkIHRpbWUgZW5naW5lIGF0IGEgZ2l2ZW4gdGltZS5cbiAgICpcbiAgICogQHBhcmFtIHtUaW1lRW5naW5lfSBlbmdpbmUgLSBFbmdpbmUgdG8gcmVzY2hlZHVsZVxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIFNjaGVkdWxlIHRpbWVcbiAgICovXG4gIHJlc2V0RW5naW5lVGltZShlbmdpbmUsIHRpbWUgPSB0aGlzLmN1cnJlbnRUaW1lKSB7XG4gICAgdGhpcy5fX3Jlc2NoZWR1bGVFbmdpbmUoZW5naW5lLCB0aW1lKTtcbiAgICB0aGlzLl9fcmVzZXRUaWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciBhIGdpdmVuIGVuZ2luZSBpcyBzY2hlZHVsZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7VGltZUVuZ2luZX0gZW5naW5lIC0gRW5naW5lIHRvIGNoZWNrXG4gICAqL1xuICBoYXMoZW5naW5lKSB7XG4gICAgcmV0dXJuIHRoaXMuX19lbmdpbmVzLmhhcyhlbmdpbmUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgZW5naW5lcyBmcm9tIHRoZSBzY2hlZHVsZXIuXG4gICAqL1xuICBjbGVhcigpIHtcbiAgICBpZiAodGhpcy5fX3RpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9fdGltZW91dCk7XG4gICAgICB0aGlzLl9fdGltZW91dCA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5fX3NjaGVkRW5naW5lcy5sZW5ndGggPSAwO1xuICAgIHRoaXMuX19zY2hlZFRpbWVzLmxlbmd0aCA9IDA7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2ltcGxlU2NoZWR1bGVyO1xuIiwiaW1wb3J0IFByaW9yaXR5UXVldWUgZnJvbSAnLi4vY29yZS9Qcmlvcml0eVF1ZXVlJztcbmltcG9ydCBTY2hlZHVsaW5nUXVldWUgZnJvbSAnLi4vY29yZS9TY2hlZHVsaW5nUXVldWUnO1xuaW1wb3J0IFRpbWVFbmdpbmUgZnJvbSAnLi4vY29yZS9UaW1lRW5naW5lJztcblxuXG5mdW5jdGlvbiBhZGREdXBsZXQoZmlyc3RBcnJheSwgc2Vjb25kQXJyYXksIGZpcnN0RWxlbWVudCwgc2Vjb25kRWxlbWVudCkge1xuICBmaXJzdEFycmF5LnB1c2goZmlyc3RFbGVtZW50KTtcbiAgc2Vjb25kQXJyYXkucHVzaChzZWNvbmRFbGVtZW50KTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRHVwbGV0KGZpcnN0QXJyYXksIHNlY29uZEFycmF5LCBmaXJzdEVsZW1lbnQpIHtcbiAgY29uc3QgaW5kZXggPSBmaXJzdEFycmF5LmluZGV4T2YoZmlyc3RFbGVtZW50KTtcblxuICBpZiAoaW5kZXggPj0gMCkge1xuICAgIGNvbnN0IHNlY29uZEVsZW1lbnQgPSBzZWNvbmRBcnJheVtpbmRleF07XG5cbiAgICBmaXJzdEFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgc2Vjb25kQXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIHJldHVybiBzZWNvbmRFbGVtZW50O1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIFRoZSBUcmFuc3BvcnRlZCBjYWxsIGlzIHRoZSBiYXNlIGNsYXNzIG9mIHRoZSBhZGFwdGVycyBiZXR3ZWVuXG4vLyBkaWZmZXJlbnQgdHlwZXMgb2YgZW5naW5lcyAoaS5lLiB0cmFuc3BvcnRlZCwgc2NoZWR1bGVkLCBwbGF5LWNvbnRyb2xsZWQpXG4vLyBUaGUgYWRhcHRlcnMgYXJlIGF0IHRoZSBzYW1lIHRpbWUgbWFzdGVycyBmb3IgdGhlIGVuZ2luZXMgYWRkZWQgdG8gdGhlIHRyYW5zcG9ydFxuLy8gYW5kIHRyYW5zcG9ydGVkIFRpbWVFbmdpbmVzIGluc2VydGVkIGludG8gdGhlIHRyYW5zcG9ydCdzIHBvc2l0aW9uLWJhc2VkIHByaXRvcml0eSBxdWV1ZS5cbmNsYXNzIFRyYW5zcG9ydGVkIGV4dGVuZHMgVGltZUVuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKHRyYW5zcG9ydCwgZW5naW5lLCBzdGFydCwgZHVyYXRpb24sIG9mZnNldCwgc3RyZXRjaCA9IDEpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubWFzdGVyID0gdHJhbnNwb3J0O1xuXG4gICAgdGhpcy5fX2VuZ2luZSA9IGVuZ2luZTtcbiAgICBlbmdpbmUubWFzdGVyID0gdGhpcztcblxuICAgIHRoaXMuX19zdGFydFBvc2l0aW9uID0gc3RhcnQ7XG4gICAgdGhpcy5fX2VuZFBvc2l0aW9uID0gIWlzRmluaXRlKGR1cmF0aW9uKSA/IEluZmluaXR5IDogc3RhcnQgKyBkdXJhdGlvbjtcbiAgICB0aGlzLl9fb2Zmc2V0UG9zaXRpb24gPSBzdGFydCArIG9mZnNldDtcbiAgICB0aGlzLl9fc3RyZXRjaFBvc2l0aW9uID0gc3RyZXRjaDtcbiAgICB0aGlzLl9faXNSdW5uaW5nID0gZmFsc2U7XG4gIH1cblxuICBzZXRCb3VuZGFyaWVzKHN0YXJ0LCBkdXJhdGlvbiwgb2Zmc2V0ID0gMCwgc3RyZXRjaCA9IDEpIHtcbiAgICB0aGlzLl9fc3RhcnRQb3NpdGlvbiA9IHN0YXJ0O1xuICAgIHRoaXMuX19lbmRQb3NpdGlvbiA9IHN0YXJ0ICsgZHVyYXRpb247XG4gICAgdGhpcy5fX29mZnNldFBvc2l0aW9uID0gc3RhcnQgKyBvZmZzZXQ7XG4gICAgdGhpcy5fX3N0cmV0Y2hQb3NpdGlvbiA9IHN0cmV0Y2g7XG4gICAgdGhpcy5yZXNldFBvc2l0aW9uKCk7XG4gIH1cblxuICBzdGFydCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHt9XG4gIHN0b3AodGltZSwgcG9zaXRpb24pIHt9XG5cbiAgZ2V0IGN1cnJlbnRUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLm1hc3Rlci5jdXJyZW50VGltZTtcbiAgfVxuXG4gIGdldCBhdWRpb1RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFzdGVyLmF1ZGlvVGltZTtcbiAgfVxuXG4gIGdldCBjdXJyZW50UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWFzdGVyLmN1cnJlbnRQb3NpdGlvbiAtIHRoaXMuX19vZmZzZXRQb3NpdGlvbjtcbiAgfVxuXG4gIHJlc2V0UG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICBpZiAocG9zaXRpb24gIT09IHVuZGVmaW5lZClcbiAgICAgIHBvc2l0aW9uICs9IHRoaXMuX19vZmZzZXRQb3NpdGlvbjtcblxuICAgIHRoaXMubWFzdGVyLnJlc2V0RW5naW5lUG9zaXRpb24odGhpcywgcG9zaXRpb24pO1xuICB9XG5cbiAgc3luY1Bvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgIGlmIChzcGVlZCA+IDApIHtcbiAgICAgIGlmIChwb3NpdGlvbiA8IHRoaXMuX19zdGFydFBvc2l0aW9uKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX19pc1J1bm5pbmcpXG4gICAgICAgICAgdGhpcy5zdG9wKHRpbWUsIHBvc2l0aW9uIC0gdGhpcy5fX29mZnNldFBvc2l0aW9uKTtcblxuICAgICAgICB0aGlzLl9faXNSdW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHJldHVybiB0aGlzLl9fc3RhcnRQb3NpdGlvbjtcbiAgICAgIH0gZWxzZSBpZiAocG9zaXRpb24gPCB0aGlzLl9fZW5kUG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5zdGFydCh0aW1lLCBwb3NpdGlvbiAtIHRoaXMuX19vZmZzZXRQb3NpdGlvbiwgc3BlZWQpO1xuXG4gICAgICAgIHRoaXMuX19pc1J1bm5pbmcgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcy5fX2VuZFBvc2l0aW9uO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocG9zaXRpb24gPiB0aGlzLl9fZW5kUG9zaXRpb24pIHtcbiAgICAgICAgaWYgKHRoaXMuX19pc1J1bm5pbmcpIC8vIGlmIGVuZ2luZSBpcyBydW5uaW5nXG4gICAgICAgICAgdGhpcy5zdG9wKHRpbWUsIHBvc2l0aW9uIC0gdGhpcy5fX29mZnNldFBvc2l0aW9uKTtcblxuICAgICAgICB0aGlzLl9faXNSdW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHJldHVybiB0aGlzLl9fZW5kUG9zaXRpb247XG4gICAgICB9IGVsc2UgaWYgKHBvc2l0aW9uID4gdGhpcy5fX3N0YXJ0UG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5zdGFydCh0aW1lLCBwb3NpdGlvbiAtIHRoaXMuX19vZmZzZXRQb3NpdGlvbiwgc3BlZWQpO1xuXG4gICAgICAgIHRoaXMuX19pc1J1bm5pbmcgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcy5fX3N0YXJ0UG9zaXRpb247XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX19pc1J1bm5pbmcpIC8vIGlmIGVuZ2luZSBpcyBydW5uaW5nXG4gICAgICB0aGlzLnN0b3AodGltZSwgcG9zaXRpb24pO1xuXG4gICAgdGhpcy5fX2lzUnVubmluZyA9IGZhbHNlO1xuICAgIHJldHVybiBJbmZpbml0eSAqIHNwZWVkO1xuICB9XG5cbiAgYWR2YW5jZVBvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgIGlmICghdGhpcy5fX2lzUnVubmluZykge1xuICAgICAgdGhpcy5zdGFydCh0aW1lLCBwb3NpdGlvbiAtIHRoaXMuX19vZmZzZXRQb3NpdGlvbiwgc3BlZWQpO1xuICAgICAgdGhpcy5fX2lzUnVubmluZyA9IHRydWU7XG5cbiAgICAgIGlmIChzcGVlZCA+IDApXG4gICAgICAgIHJldHVybiB0aGlzLl9fZW5kUG9zaXRpb247XG5cbiAgICAgIHJldHVybiB0aGlzLl9fc3RhcnRQb3NpdGlvbjtcbiAgICB9XG5cbiAgICAvLyBzdG9wIGVuZ2luZVxuICAgIHRoaXMuc3RvcCh0aW1lLCBwb3NpdGlvbiAtIHRoaXMuX19vZmZzZXRQb3NpdGlvbik7XG5cbiAgICB0aGlzLl9faXNSdW5uaW5nID0gZmFsc2U7XG4gICAgcmV0dXJuIEluZmluaXR5ICogc3BlZWQ7XG4gIH1cblxuICBzeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHNwZWVkKSB7XG4gICAgaWYgKHNwZWVkID09PSAwKSAvLyBzdG9wXG4gICAgICB0aGlzLnN0b3AodGltZSwgcG9zaXRpb24gLSB0aGlzLl9fb2Zmc2V0UG9zaXRpb24pO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLm1hc3RlciA9IG51bGw7XG5cbiAgICB0aGlzLl9fZW5naW5lLm1hc3RlciA9IG51bGw7XG4gICAgdGhpcy5fX2VuZ2luZSA9IG51bGw7XG4gIH1cbn1cblxuLy8gVHJhbnNwb3J0ZWRUcmFuc3BvcnRlZFxuLy8gaGFzIHRvIHN3aXRjaCBvbiBhbmQgb2ZmIHRoZSBzY2hlZHVsZWQgZW5naW5lcyB3aGVuIHRoZSB0cmFuc3BvcnQgaGl0cyB0aGUgZW5naW5lJ3Mgc3RhcnQgYW5kIGVuZCBwb3NpdGlvblxuY2xhc3MgVHJhbnNwb3J0ZWRUcmFuc3BvcnRlZCBleHRlbmRzIFRyYW5zcG9ydGVkIHtcbiAgY29uc3RydWN0b3IodHJhbnNwb3J0LCBlbmdpbmUsIHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uLCBvZmZzZXRQb3NpdGlvbikge1xuICAgIHN1cGVyKHRyYW5zcG9ydCwgZW5naW5lLCBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgb2Zmc2V0UG9zaXRpb24pO1xuICB9XG5cbiAgc3luY1Bvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgIGlmIChzcGVlZCA+IDAgJiYgcG9zaXRpb24gPCB0aGlzLl9fZW5kUG9zaXRpb24pXG4gICAgICBwb3NpdGlvbiA9IE1hdGgubWF4KHBvc2l0aW9uLCB0aGlzLl9fc3RhcnRQb3NpdGlvbik7XG4gICAgZWxzZSBpZiAoc3BlZWQgPCAwICYmIHBvc2l0aW9uID49IHRoaXMuX19zdGFydFBvc2l0aW9uKVxuICAgICAgcG9zaXRpb24gPSBNYXRoLm1pbihwb3NpdGlvbiwgdGhpcy5fX2VuZFBvc2l0aW9uKTtcblxuICAgIHJldHVybiB0aGlzLl9fb2Zmc2V0UG9zaXRpb24gKyB0aGlzLl9fZW5naW5lLnN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiAtIHRoaXMuX19vZmZzZXRQb3NpdGlvbiwgc3BlZWQpO1xuICB9XG5cbiAgYWR2YW5jZVBvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgIHBvc2l0aW9uID0gdGhpcy5fX29mZnNldFBvc2l0aW9uICsgdGhpcy5fX2VuZ2luZS5hZHZhbmNlUG9zaXRpb24odGltZSwgcG9zaXRpb24gLSB0aGlzLl9fb2Zmc2V0UG9zaXRpb24sIHNwZWVkKTtcblxuICAgIGlmIChzcGVlZCA+IDAgJiYgcG9zaXRpb24gPCB0aGlzLl9fZW5kUG9zaXRpb24gfHwgc3BlZWQgPCAwICYmIHBvc2l0aW9uID49IHRoaXMuX19zdGFydFBvc2l0aW9uKVxuICAgICAgcmV0dXJuIHBvc2l0aW9uO1xuXG4gICAgcmV0dXJuIEluZmluaXR5ICogc3BlZWQ7XG4gIH1cblxuICBzeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHNwZWVkKSB7XG4gICAgaWYgKHRoaXMuX19lbmdpbmUuc3luY1NwZWVkKVxuICAgICAgdGhpcy5fX2VuZ2luZS5zeW5jU3BlZWQodGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgfVxuXG4gIHJlc2V0RW5naW5lUG9zaXRpb24oZW5naW5lLCBwb3NpdGlvbiA9IHVuZGVmaW5lZCkge1xuICAgIGlmIChwb3NpdGlvbiAhPT0gdW5kZWZpbmVkKVxuICAgICAgcG9zaXRpb24gKz0gdGhpcy5fX29mZnNldFBvc2l0aW9uO1xuXG4gICAgdGhpcy5yZXNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgfVxufVxuXG4vLyBUcmFuc3BvcnRlZFNwZWVkQ29udHJvbGxlZFxuLy8gaGFzIHRvIHN0YXJ0IGFuZCBzdG9wIHRoZSBzcGVlZC1jb250cm9sbGVkIGVuZ2luZXMgd2hlbiB0aGUgdHJhbnNwb3J0IGhpdHMgdGhlIGVuZ2luZSdzIHN0YXJ0IGFuZCBlbmQgcG9zaXRpb25cbmNsYXNzIFRyYW5zcG9ydGVkU3BlZWRDb250cm9sbGVkIGV4dGVuZHMgVHJhbnNwb3J0ZWQge1xuICBjb25zdHJ1Y3Rvcih0cmFuc3BvcnQsIGVuZ2luZSwgc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24sIG9mZnNldFBvc2l0aW9uKSB7XG4gICAgc3VwZXIodHJhbnNwb3J0LCBlbmdpbmUsIHN0YXJ0UG9zaXRpb24sIGVuZFBvc2l0aW9uLCBvZmZzZXRQb3NpdGlvbik7XG4gIH1cblxuICBzdGFydCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICB0aGlzLl9fZW5naW5lLnN5bmNTcGVlZCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQsIHRydWUpO1xuICB9XG5cbiAgc3RvcCh0aW1lLCBwb3NpdGlvbikge1xuICAgIHRoaXMuX19lbmdpbmUuc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCAwKTtcbiAgfVxuXG4gIHN5bmNTcGVlZCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICBpZiAodGhpcy5fX2lzUnVubmluZylcbiAgICAgIHRoaXMuX19lbmdpbmUuc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuX19lbmdpbmUuc3luY1NwZWVkKHRoaXMubWFzdGVyLmN1cnJlbnRUaW1lLCB0aGlzLm1hc3Rlci5jdXJyZW50UG9zaXRpb24gLSB0aGlzLl9fb2Zmc2V0UG9zaXRpb24sIDApO1xuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgfVxufVxuXG4vLyBUcmFuc3BvcnRlZFNjaGVkdWxlZFxuLy8gaGFzIHRvIHN3aXRjaCBvbiBhbmQgb2ZmIHRoZSBzY2hlZHVsZWQgZW5naW5lcyB3aGVuIHRoZSB0cmFuc3BvcnQgaGl0cyB0aGUgZW5naW5lJ3Mgc3RhcnQgYW5kIGVuZCBwb3NpdGlvblxuY2xhc3MgVHJhbnNwb3J0ZWRTY2hlZHVsZWQgZXh0ZW5kcyBUcmFuc3BvcnRlZCB7XG4gIGNvbnN0cnVjdG9yKHRyYW5zcG9ydCwgZW5naW5lLCBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgb2Zmc2V0UG9zaXRpb24pIHtcbiAgICBzdXBlcih0cmFuc3BvcnQsIGVuZ2luZSwgc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24sIG9mZnNldFBvc2l0aW9uKTtcblxuICAgIC8vIHNjaGVkdWxpbmcgcXVldWUgYmVjb21lcyBtYXN0ZXIgb2YgZW5naW5lXG4gICAgZW5naW5lLm1hc3RlciA9IG51bGw7XG4gICAgdHJhbnNwb3J0Ll9fc2NoZWR1bGluZ1F1ZXVlLmFkZChlbmdpbmUsIEluZmluaXR5KTtcbiAgfVxuXG4gIHN0YXJ0KHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgIHRoaXMubWFzdGVyLl9fc2NoZWR1bGluZ1F1ZXVlLnJlc2V0RW5naW5lVGltZSh0aGlzLl9fZW5naW5lLCB0aW1lKTtcbiAgfVxuXG4gIHN0b3AodGltZSwgcG9zaXRpb24pIHtcbiAgICB0aGlzLm1hc3Rlci5fX3NjaGVkdWxpbmdRdWV1ZS5yZXNldEVuZ2luZVRpbWUodGhpcy5fX2VuZ2luZSwgSW5maW5pdHkpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLm1hc3Rlci5fX3NjaGVkdWxpbmdRdWV1ZS5yZW1vdmUodGhpcy5fX2VuZ2luZSk7XG4gICAgc3VwZXIuZGVzdHJveSgpO1xuICB9XG59XG5cbi8vIHRyYW5zbGF0ZXMgYWR2YW5jZVBvc2l0aW9uIG9mICp0cmFuc3BvcnRlZCogZW5naW5lcyBpbnRvIGdsb2JhbCBzY2hlZHVsZXIgdGltZXNcbmNsYXNzIFRyYW5zcG9ydFNjaGVkdWxlckhvb2sgZXh0ZW5kcyBUaW1lRW5naW5lIHtcbiAgY29uc3RydWN0b3IodHJhbnNwb3J0KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX190cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG5cbiAgICB0aGlzLl9fbmV4dFBvc2l0aW9uID0gSW5maW5pdHk7XG4gICAgdGhpcy5fX25leHRUaW1lID0gSW5maW5pdHk7XG4gICAgdHJhbnNwb3J0Ll9fc2NoZWR1bGVyLmFkZCh0aGlzLCBJbmZpbml0eSk7XG4gIH1cblxuICAvLyBUaW1lRW5naW5lIG1ldGhvZCAoc2NoZWR1bGVkIGludGVyZmFjZSlcbiAgYWR2YW5jZVRpbWUodGltZSkge1xuICAgIGNvbnN0IHRyYW5zcG9ydCA9IHRoaXMuX190cmFuc3BvcnQ7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLl9fbmV4dFBvc2l0aW9uO1xuICAgIGNvbnN0IHNwZWVkID0gdHJhbnNwb3J0Ll9fc3BlZWQ7XG4gICAgY29uc3QgbmV4dFBvc2l0aW9uID0gdHJhbnNwb3J0LmFkdmFuY2VQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpO1xuICAgIGNvbnN0IG5leHRUaW1lID0gdHJhbnNwb3J0Ll9fZ2V0VGltZUF0UG9zaXRpb24obmV4dFBvc2l0aW9uKTtcblxuICAgIHRoaXMuX19uZXh0UG9zaXRpb24gPSBuZXh0UG9zaXRpb247XG4gICAgdGhpcy5fX25leHRUaW1lID0gbmV4dFRpbWU7XG5cbiAgICByZXR1cm4gbmV4dFRpbWU7XG4gIH1cblxuICByZXNldFBvc2l0aW9uKHBvc2l0aW9uID0gdGhpcy5fX25leHRQb3NpdGlvbikge1xuICAgIGNvbnN0IHRyYW5zcG9ydCA9IHRoaXMuX190cmFuc3BvcnQ7XG4gICAgY29uc3QgdGltZSA9IHRyYW5zcG9ydC5fX2dldFRpbWVBdFBvc2l0aW9uKHBvc2l0aW9uKTtcblxuICAgIHRoaXMuX19uZXh0UG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICB0aGlzLl9fbmV4dFRpbWUgPSB0aW1lO1xuXG4gICAgdGhpcy5yZXNldFRpbWUodGltZSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuX190cmFuc3BvcnQuX19zY2hlZHVsZXIucmVtb3ZlKHRoaXMpO1xuICAgIHRoaXMuX190cmFuc3BvcnQgPSBudWxsO1xuICB9XG59XG5cbi8vIGludGVybmFsIHNjaGVkdWxpbmcgcXVldWUgdGhhdCByZXR1cm5zIHRoZSBjdXJyZW50IHBvc2l0aW9uIChhbmQgdGltZSkgb2YgdGhlIHRyYW5zcG9ydFxuY2xhc3MgVHJhbnNwb3J0U2NoZWR1bGluZ1F1ZXVlIGV4dGVuZHMgU2NoZWR1bGluZ1F1ZXVlIHtcbiAgY29uc3RydWN0b3IodHJhbnNwb3J0KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX190cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG4gICAgdHJhbnNwb3J0Ll9fc2NoZWR1bGVyLmFkZCh0aGlzLCBJbmZpbml0eSk7XG4gIH1cblxuICBnZXQgY3VycmVudFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX190cmFuc3BvcnQuY3VycmVudFRpbWU7XG4gIH1cblxuICBnZXQgYXVkaW9UaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9fdHJhbnNwb3J0LmF1ZGlvVGltZTtcbiAgfVxuXG4gIGdldCBjdXJyZW50UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX190cmFuc3BvcnQuY3VycmVudFBvc2l0aW9uO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl9fdHJhbnNwb3J0Ll9fc2NoZWR1bGVyLnJlbW92ZSh0aGlzKTtcbiAgICB0aGlzLl9fdHJhbnNwb3J0ID0gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIFByb3ZpZGVzIHBvc2l0aW9uLWJhc2VkIHNjaGVkdWxpbmcgb2YgVGltZUVuZ2luZSBpbnN0YW5jZXMuXG4gKlxuICogW2V4YW1wbGVde0BsaW5rIGh0dHBzOi8vcmF3Z2l0LmNvbS93YXZlc2pzL3dhdmVzLW1hc3RlcnMvbWFzdGVyL2V4YW1wbGVzL3RyYW5zcG9ydC9pbmRleC5odG1sfVxuICpcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gc2NoZWR1bGVyIC0gaW5zdGFuY2Ugb2YgU2NoZWR1bGVyXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIG1hc3RlcnMgZnJvbSAnd2F2ZXMtbWFzdGVycyc7XG4gKlxuICogY29uc3QgZ2V0VGltZUZ1bmN0aW9uID0gKCkgPT4ge1xuICogICBjb25zdCBub3cgPSBwcm9jZXNzLmhydGltZSgpO1xuICogICByZXR1cm4gbm93WzBdICsgbm93WzFdICogMWUtOTtcbiAqIH1cbiAqIGNvbnN0IHNjaGVkdWxlciA9IG5ldyBtYXN0ZXJzLlNjaGVkdWxlcihnZXRUaW1lRnVuY3Rpb24pO1xuICogY29uc3QgdHJhbnNwb3J0ID0gbmV3IG1hc3RlcnMuVHJhbnNwb3J0KHNjaGVkdWxlcik7XG4gKiBjb25zdCBwbGF5Q29udHJvbCA9IG5ldyBtYXN0ZXJzLlBsYXlDb250cm9sKHNjaGVkdWxlciwgdHJhbnNwb3J0KTtcbiAqIGNvbnN0IG15RW5naW5lID0gbmV3IE15RW5naW5lKCk7XG4gKiBjb25zdCB5b3VyRW5naW5lID0gbmV3IHlvdXJFbmdpbmUoKTtcbiAqXG4gKiB0cmFuc3BvcnQuYWRkKG15RW5naW5lKTtcbiAqIHRyYW5zcG9ydC5hZGQoeW91ckVuZ2luZSk7XG4gKlxuICogcGxheUNvbnRyb2wuc3RhcnQoKTtcbiAqL1xuY2xhc3MgVHJhbnNwb3J0IGV4dGVuZHMgVGltZUVuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKHNjaGVkdWxlciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmICghc2NoZWR1bGVyKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFyZ3VtZW50IGBzY2hlZHVsZXJgLCBzaG91bGQgYmUgYW4gaW5zdGFuY2Ugb2YgYFNjaGVkdWxlcmAnKTtcblxuICAgIHRoaXMuX19lbmdpbmVzID0gW107XG4gICAgdGhpcy5fX3RyYW5zcG9ydGVkID0gW107XG5cbiAgICB0aGlzLl9fc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgIHRoaXMuX19zY2hlZHVsZXJIb29rID0gbmV3IFRyYW5zcG9ydFNjaGVkdWxlckhvb2sodGhpcyk7XG4gICAgdGhpcy5fX3RyYW5zcG9ydGVkUXVldWUgPSBuZXcgUHJpb3JpdHlRdWV1ZSgpO1xuICAgIHRoaXMuX19zY2hlZHVsaW5nUXVldWUgPSBuZXcgVHJhbnNwb3J0U2NoZWR1bGluZ1F1ZXVlKHRoaXMpO1xuXG4gICAgLy8gc3luY3Jvbml6ZWQgdGltZSwgcG9zaXRpb24sIGFuZCBzcGVlZFxuICAgIHRoaXMuX190aW1lID0gMDtcbiAgICB0aGlzLl9fcG9zaXRpb24gPSAwO1xuICAgIHRoaXMuX19zcGVlZCA9IDA7XG4gIH1cblxuICBfX2dldFRpbWVBdFBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgaWYgKHRoaXMuX19zcGVlZCA9PT0gMClcbiAgICAgIHJldHVybiArSW5maW5pdHk7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXMuX190aW1lICsgKHBvc2l0aW9uIC0gdGhpcy5fX3Bvc2l0aW9uKSAvIHRoaXMuX19zcGVlZDtcbiAgfVxuXG4gIF9fZ2V0UG9zaXRpb25BdFRpbWUodGltZSkge1xuICAgIHJldHVybiB0aGlzLl9fcG9zaXRpb24gKyAodGltZSAtIHRoaXMuX190aW1lKSAqIHRoaXMuX19zcGVlZDtcbiAgfVxuXG4gIF9fc3luY1RyYW5zcG9ydGVkUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKSB7XG4gICAgY29uc3QgbnVtVHJhbnNwb3J0ZWRFbmdpbmVzID0gdGhpcy5fX3RyYW5zcG9ydGVkLmxlbmd0aDtcbiAgICBsZXQgbmV4dFBvc2l0aW9uID0gSW5maW5pdHkgKiBzcGVlZDtcblxuICAgIGlmIChudW1UcmFuc3BvcnRlZEVuZ2luZXMgPiAwKSB7XG4gICAgICB0aGlzLl9fdHJhbnNwb3J0ZWRRdWV1ZS5jbGVhcigpO1xuICAgICAgdGhpcy5fX3RyYW5zcG9ydGVkUXVldWUucmV2ZXJzZSA9IChzcGVlZCA8IDApO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVRyYW5zcG9ydGVkRW5naW5lczsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGVuZ2luZSA9IHRoaXMuX190cmFuc3BvcnRlZFtpXTtcbiAgICAgICAgY29uc3QgbmV4dEVuZ2luZVBvc2l0aW9uID0gZW5naW5lLnN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpO1xuICAgICAgICB0aGlzLl9fdHJhbnNwb3J0ZWRRdWV1ZS5pbnNlcnQoZW5naW5lLCBuZXh0RW5naW5lUG9zaXRpb24pO1xuICAgICAgfVxuXG4gICAgICBuZXh0UG9zaXRpb24gPSB0aGlzLl9fdHJhbnNwb3J0ZWRRdWV1ZS50aW1lO1xuICAgIH1cblxuICAgIHJldHVybiBuZXh0UG9zaXRpb247XG4gIH1cblxuICBfX3N5bmNUcmFuc3BvcnRlZFNwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCkge1xuICAgIGZvciAobGV0IHRyYW5zcG9ydGVkIG9mIHRoaXMuX190cmFuc3BvcnRlZClcbiAgICAgIHRyYW5zcG9ydGVkLnN5bmNTcGVlZCh0aW1lLCBwb3NpdGlvbiwgc3BlZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBjdXJyZW50IG1hc3RlciB0aW1lLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAbmFtZSBjdXJyZW50VGltZVxuICAgKiBAbWVtYmVyb2YgVHJhbnNwb3J0XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBjdXJyZW50VGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fX3NjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgbWFzdGVyIGF1ZGlvIHRpbWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBuYW1lIGN1cnJlbnRUaW1lXG4gICAqIEBtZW1iZXJvZiBUcmFuc3BvcnRcbiAgICogQGluc3RhbmNlXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IGF1ZGlvVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fX3NjaGVkdWxlci5hdWRpb1RpbWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgbWFzdGVyIHBvc2l0aW9uLiBUaGlzIGdldHRlciB3aWxsIGJlIHJlcGxhY2VkIHdoZW4gdGhlIHRyYW5zcG9ydFxuICAgKiBpcyBhZGRlZCB0byBhIG1hc3RlciAoaS5lLiB0cmFuc3BvcnQgb3IgcGxheS1jb250cm9sKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQG5hbWUgY3VycmVudFBvc2l0aW9uXG4gICAqIEBtZW1iZXJvZiBUcmFuc3BvcnRcbiAgICogQGluc3RhbmNlXG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IGN1cnJlbnRQb3NpdGlvbigpIHtcbiAgICBjb25zdCBtYXN0ZXIgPSB0aGlzLm1hc3RlcjtcblxuICAgIGlmIChtYXN0ZXIgJiYgbWFzdGVyLmN1cnJlbnRQb3NpdGlvbiAhPT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuIG1hc3Rlci5jdXJyZW50UG9zaXRpb247XG5cbiAgICByZXR1cm4gdGhpcy5fX3Bvc2l0aW9uICsgKHRoaXMuX19zY2hlZHVsZXIuY3VycmVudFRpbWUgLSB0aGlzLl9fdGltZSkgKiB0aGlzLl9fc3BlZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgbmV4dCB0cmFuc3BvcnQgcG9zaXRpb25cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5leHQgLSB0cmFuc3BvcnQgcG9zaXRpb25cbiAgICovXG4gIHJlc2V0UG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICBjb25zdCBtYXN0ZXIgPSB0aGlzLm1hc3RlcjtcblxuICAgIGlmIChtYXN0ZXIgJiYgbWFzdGVyLnJlc2V0RW5naW5lUG9zaXRpb24gIT09IHVuZGVmaW5lZClcbiAgICAgIG1hc3Rlci5yZXNldEVuZ2luZVBvc2l0aW9uKHRoaXMsIHBvc2l0aW9uKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLl9fc2NoZWR1bGVySG9vay5yZXNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRhdGlvbiBvZiB0aGUgdHJhbnNwb3J0ZWQgdGltZSBlbmdpbmUgaW50ZXJmYWNlLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZVxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb25cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNwZWVkXG4gICAqL1xuICBzeW5jUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKSB7XG4gICAgdGhpcy5fX3RpbWUgPSB0aW1lO1xuICAgIHRoaXMuX19wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIHRoaXMuX19zcGVlZCA9IHNwZWVkO1xuXG4gICAgcmV0dXJuIHRoaXMuX19zeW5jVHJhbnNwb3J0ZWRQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGF0aW9uIG9mIHRoZSB0cmFuc3BvcnRlZCB0aW1lIGVuZ2luZSBpbnRlcmZhY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvblxuICAgKiBAcGFyYW0ge051bWJlcn0gc3BlZWRcbiAgICovXG4gIGFkdmFuY2VQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICBjb25zdCBlbmdpbmUgPSB0aGlzLl9fdHJhbnNwb3J0ZWRRdWV1ZS5oZWFkO1xuICAgIGNvbnN0IG5leHRFbmdpbmVQb3NpdGlvbiA9IGVuZ2luZS5hZHZhbmNlUG9zaXRpb24odGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgICByZXR1cm4gdGhpcy5fX3RyYW5zcG9ydGVkUXVldWUubW92ZShlbmdpbmUsIG5leHRFbmdpbmVQb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50YXRpb24gb2YgdGhlIHRyYW5zcG9ydGVkIHRpbWUgZW5naW5lIGludGVyZmFjZS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzcGVlZFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtzZWVrPWZhbHNlXVxuICAgKi9cbiAgc3luY1NwZWVkKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCwgc2VlayA9IGZhbHNlKSB7XG4gICAgY29uc3QgbGFzdFNwZWVkID0gdGhpcy5fX3NwZWVkO1xuXG4gICAgdGhpcy5fX3RpbWUgPSB0aW1lO1xuICAgIHRoaXMuX19wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIHRoaXMuX19zcGVlZCA9IHNwZWVkO1xuXG4gICAgaWYgKHNwZWVkICE9PSBsYXN0U3BlZWQgfHwgc2Vlaykge1xuICAgICAgbGV0IG5leHRQb3NpdGlvbjtcblxuICAgICAgLy8gcmVzeW5jIHRyYW5zcG9ydGVkIGVuZ2luZXNcbiAgICAgIGlmIChzZWVrIHx8IHNwZWVkICogbGFzdFNwZWVkIDwgMCkge1xuICAgICAgICAvLyBzZWVrIG9yIHJldmVyc2UgZGlyZWN0aW9uXG4gICAgICAgIG5leHRQb3NpdGlvbiA9IHRoaXMuX19zeW5jVHJhbnNwb3J0ZWRQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpO1xuICAgICAgfSBlbHNlIGlmIChsYXN0U3BlZWQgPT09IDApIHtcbiAgICAgICAgLy8gc3RhcnRcbiAgICAgICAgbmV4dFBvc2l0aW9uID0gdGhpcy5fX3N5bmNUcmFuc3BvcnRlZFBvc2l0aW9uKHRpbWUsIHBvc2l0aW9uLCBzcGVlZCk7XG4gICAgICB9IGVsc2UgaWYgKHNwZWVkID09PSAwKSB7XG4gICAgICAgIC8vIHN0b3BcbiAgICAgICAgbmV4dFBvc2l0aW9uID0gSW5maW5pdHk7XG4gICAgICAgIHRoaXMuX19zeW5jVHJhbnNwb3J0ZWRQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY2hhbmdlIHNwZWVkIHdpdGhvdXQgcmV2ZXJzaW5nIGRpcmVjdGlvblxuICAgICAgICB0aGlzLl9fc3luY1RyYW5zcG9ydGVkU3BlZWQodGltZSwgcG9zaXRpb24sIHNwZWVkKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXNldFBvc2l0aW9uKG5leHRQb3NpdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHRpbWUgZW5naW5lIHRvIHRoZSB0cmFuc3BvcnQuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbmdpbmUgLSBlbmdpbmUgdG8gYmUgYWRkZWQgdG8gdGhlIHRyYW5zcG9ydFxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb24gLSBzdGFydCBwb3NpdGlvblxuICAgKi9cbiAgYWRkKGVuZ2luZSwgc3RhcnRQb3NpdGlvbiA9IDAsIGVuZFBvc2l0aW9uID0gSW5maW5pdHksIG9mZnNldFBvc2l0aW9uID0gMCkge1xuICAgIGxldCB0cmFuc3BvcnRlZCA9IG51bGw7XG5cbiAgICBpZiAob2Zmc2V0UG9zaXRpb24gPT09IC1JbmZpbml0eSlcbiAgICAgIG9mZnNldFBvc2l0aW9uID0gMDtcblxuICAgIGlmIChlbmdpbmUubWFzdGVyKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwib2JqZWN0IGhhcyBhbHJlYWR5IGJlZW4gYWRkZWQgdG8gYSBtYXN0ZXJcIik7XG5cbiAgICBpZiAoVGltZUVuZ2luZS5pbXBsZW1lbnRzVHJhbnNwb3J0ZWQoZW5naW5lKSlcbiAgICAgIHRyYW5zcG9ydGVkID0gbmV3IFRyYW5zcG9ydGVkVHJhbnNwb3J0ZWQodGhpcywgZW5naW5lLCBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgb2Zmc2V0UG9zaXRpb24pO1xuICAgIGVsc2UgaWYgKFRpbWVFbmdpbmUuaW1wbGVtZW50c1NwZWVkQ29udHJvbGxlZChlbmdpbmUpKVxuICAgICAgdHJhbnNwb3J0ZWQgPSBuZXcgVHJhbnNwb3J0ZWRTcGVlZENvbnRyb2xsZWQodGhpcywgZW5naW5lLCBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgb2Zmc2V0UG9zaXRpb24pO1xuICAgIGVsc2UgaWYgKFRpbWVFbmdpbmUuaW1wbGVtZW50c1NjaGVkdWxlZChlbmdpbmUpKVxuICAgICAgdHJhbnNwb3J0ZWQgPSBuZXcgVHJhbnNwb3J0ZWRTY2hlZHVsZWQodGhpcywgZW5naW5lLCBzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbiwgb2Zmc2V0UG9zaXRpb24pO1xuICAgIGVsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIm9iamVjdCBjYW5ub3QgYmUgYWRkZWQgdG8gYSB0cmFuc3BvcnRcIik7XG5cbiAgICBpZiAodHJhbnNwb3J0ZWQpIHtcbiAgICAgIGNvbnN0IHNwZWVkID0gdGhpcy5fX3NwZWVkO1xuXG4gICAgICBhZGREdXBsZXQodGhpcy5fX2VuZ2luZXMsIHRoaXMuX190cmFuc3BvcnRlZCwgZW5naW5lLCB0cmFuc3BvcnRlZCk7XG5cbiAgICAgIGlmIChzcGVlZCAhPT0gMCkge1xuICAgICAgICAvLyBzeW5jIGFuZCBzdGFydFxuICAgICAgICBjb25zdCBuZXh0RW5naW5lUG9zaXRpb24gPSB0cmFuc3BvcnRlZC5zeW5jUG9zaXRpb24odGhpcy5jdXJyZW50VGltZSwgdGhpcy5jdXJyZW50UG9zaXRpb24sIHNwZWVkKTtcbiAgICAgICAgY29uc3QgbmV4dFBvc2l0aW9uID0gdGhpcy5fX3RyYW5zcG9ydGVkUXVldWUuaW5zZXJ0KHRyYW5zcG9ydGVkLCBuZXh0RW5naW5lUG9zaXRpb24pO1xuXG4gICAgICAgIHRoaXMucmVzZXRQb3NpdGlvbihuZXh0UG9zaXRpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cmFuc3BvcnRlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSB0aW1lIGVuZ2luZSBmcm9tIHRoZSB0cmFuc3BvcnQuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBlbmdpbmVPclRyYW5zcG9ydGVkIC0gZW5naW5lIG9yIHRyYW5zcG9ydGVkIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGUgdHJhbnNwb3J0XG4gICAqL1xuICByZW1vdmUoZW5naW5lT3JUcmFuc3BvcnRlZCkge1xuICAgIGxldCBlbmdpbmUgPSBlbmdpbmVPclRyYW5zcG9ydGVkO1xuICAgIGxldCB0cmFuc3BvcnRlZCA9IHJlbW92ZUR1cGxldCh0aGlzLl9fZW5naW5lcywgdGhpcy5fX3RyYW5zcG9ydGVkLCBlbmdpbmVPclRyYW5zcG9ydGVkKTtcblxuICAgIGlmICghdHJhbnNwb3J0ZWQpIHtcbiAgICAgIGVuZ2luZSA9IHJlbW92ZUR1cGxldCh0aGlzLl9fdHJhbnNwb3J0ZWQsIHRoaXMuX19lbmdpbmVzLCBlbmdpbmVPclRyYW5zcG9ydGVkKTtcbiAgICAgIHRyYW5zcG9ydGVkID0gZW5naW5lT3JUcmFuc3BvcnRlZDtcbiAgICB9XG5cbiAgICBpZiAoZW5naW5lICYmIHRyYW5zcG9ydGVkKSB7XG4gICAgICBjb25zdCBuZXh0UG9zaXRpb24gPSB0aGlzLl9fdHJhbnNwb3J0ZWRRdWV1ZS5yZW1vdmUodHJhbnNwb3J0ZWQpO1xuXG4gICAgICB0cmFuc3BvcnRlZC5kZXN0cm95KCk7XG5cbiAgICAgIGlmICh0aGlzLl9fc3BlZWQgIT09IDApXG4gICAgICAgIHRoaXMucmVzZXRQb3NpdGlvbihuZXh0UG9zaXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJvYmplY3QgaGFzIG5vdCBiZWVuIGFkZGVkIHRvIHRoaXMgdHJhbnNwb3J0XCIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCBwb3NpdGlvbiBvZiB0aGUgZ2l2ZW4gZW5naW5lLlxuICAgKlxuICAgKiBAcGFyYW0ge1RpbWVFbmdpbmV9IHRyYW5zcG9ydGVkIC0gRW5naW5lIHRvIHJlc2V0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NpdGlvbiAtIE5ldyBwb3NpdGlvblxuICAgKi9cbiAgcmVzZXRFbmdpbmVQb3NpdGlvbih0cmFuc3BvcnRlZCwgcG9zaXRpb24gPSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBzcGVlZCA9IHRoaXMuX19zcGVlZDtcblxuICAgIGlmIChzcGVlZCAhPT0gMCkge1xuICAgICAgaWYgKHBvc2l0aW9uID09PSB1bmRlZmluZWQpXG4gICAgICAgIHBvc2l0aW9uID0gdHJhbnNwb3J0ZWQuc3luY1Bvc2l0aW9uKHRoaXMuY3VycmVudFRpbWUsIHRoaXMuY3VycmVudFBvc2l0aW9uLCBzcGVlZCk7XG5cbiAgICAgIGxldCBuZXh0UG9zaXRpb24gPSBudWxsO1xuXG4gICAgICAvLyB0aGUgcHJpb3JpdHkgcXVldWUgZG9lcyBub3Qga2VlcCB0cmFjayBvZiB0aGUgZWxlbWVudHMgdGhhdCBhcmVcbiAgICAgIC8vIGluc2VydGVkIGF0IEluZmluaXR5LCBzbyB3ZSBuZWVkIHRvIHJlaW5zZXJ0IHRyYW5zcG9ydGVkIGVuZ2luZSBpblxuICAgICAgLy8gdGhpcyBjYXNlLlxuICAgICAgLy8gQG5vdGUgLSB0aGlzIGNvdWxkIHByb2JhYmx5IGJlIG1vcmUgY2xlYW5cbiAgICAgIC8vICAgICAgIC0gcHJvYmFibHkgdGhlIHByaW9yaXR5IHF1ZXVlIHNob3VsZCBrZWVwIHRoZXNlIHJlZmVyZW5jZXNcbiAgICAgIGlmICghdGhpcy5fX3RyYW5zcG9ydGVkUXVldWUuaGFzKHRyYW5zcG9ydGVkKSkge1xuICAgICAgICBuZXh0UG9zaXRpb24gPSB0aGlzLl9fdHJhbnNwb3J0ZWRRdWV1ZS5pbnNlcnQodHJhbnNwb3J0ZWQsIHBvc2l0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHRQb3NpdGlvbiA9IHRoaXMuX190cmFuc3BvcnRlZFF1ZXVlLm1vdmUodHJhbnNwb3J0ZWQsIHBvc2l0aW9uKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXNldFBvc2l0aW9uKG5leHRQb3NpdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgdGltZSBlbmdpbmVzIGZyb20gdGhlIHRyYW5zcG9ydC5cbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuc3luY1NwZWVkKHRoaXMuY3VycmVudFRpbWUsIHRoaXMuY3VycmVudFBvc2l0aW9uLCAwKTtcblxuICAgIGZvciAobGV0IHRyYW5zcG9ydGVkIG9mIHRoaXMuX190cmFuc3BvcnRlZClcbiAgICAgIHRyYW5zcG9ydGVkLmRlc3Ryb3koKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUcmFuc3BvcnQ7XG4iLCJpbXBvcnQgKiBhcyBtYXN0ZXJzIGZyb20gJ3dhdmVzLW1hc3RlcnMnO1xuaW1wb3J0ICogYXMgY29udHJvbGxlcnMgZnJvbSAnQGlyY2FtL2Jhc2ljLWNvbnRyb2xsZXJzJztcblxuY29udHJvbGxlcnMuc2V0VGhlbWUoJ2RhcmsnKTtcblxuY2xhc3MgUG9zaXRpb25EaXNwbGF5IGV4dGVuZHMgbWFzdGVycy5UaW1lRW5naW5lIHtcbiAgY29uc3RydWN0b3IoJHNsaWRlcikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLiRzbGlkZXIgPSAkc2xpZGVyO1xuICAgIHRoaXMucGVyaW9kID0gMC4wMjtcbiAgfVxuXG4gIHN5bmNQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICBsZXQgbmV4dFBvc2l0aW9uID0gTWF0aC5mbG9vcihwb3NpdGlvbiAvIHRoaXMucGVyaW9kKSAqIHRoaXMucGVyaW9kO1xuXG4gICAgaWYgKHNwZWVkID4gMCAmJiBuZXh0UG9zaXRpb24gPCBwb3NpdGlvbilcbiAgICAgIG5leHRQb3NpdGlvbiArPSB0aGlzLnBlcmlvZDtcbiAgICBlbHNlIGlmIChzcGVlZCA8IDAgJiYgbmV4dFBvc2l0aW9uID4gcG9zaXRpb24pXG4gICAgICBuZXh0UG9zaXRpb24gLT0gdGhpcy5wZXJpb2Q7XG5cbiAgICB0aGlzLiRzbGlkZXIudmFsdWUgPSBwb3NpdGlvbi50b0ZpeGVkKDIpO1xuXG4gICAgcmV0dXJuIG5leHRQb3NpdGlvbjtcbiAgfVxuXG4gIGFkdmFuY2VQb3NpdGlvbih0aW1lLCBwb3NpdGlvbiwgc3BlZWQpIHtcbiAgICB0aGlzLiRzbGlkZXIudmFsdWUgPSBwb3NpdGlvbi50b0ZpeGVkKDIpO1xuXG4gICAgaWYgKHNwZWVkIDwgMClcbiAgICAgIHJldHVybiBwb3NpdGlvbiAtIHRoaXMucGVyaW9kO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBwb3NpdGlvbiArIHRoaXMucGVyaW9kO1xuICB9XG59XG5cbmNvbnN0IGdldFRpbWVGdW5jdGlvbiA9ICgpID0+IHBlcmZvcm1hbmNlLm5vdygpIC8gMTAwMDtcbmNvbnN0IHNjaGVkdWxlciA9IG5ldyBtYXN0ZXJzLlNjaGVkdWxlcihnZXRUaW1lRnVuY3Rpb24pO1xuY29uc3QgdHJhbnNwb3J0ID0gbmV3IG1hc3RlcnMuVHJhbnNwb3J0KHNjaGVkdWxlcik7XG5jb25zdCBwbGF5Q29udHJvbCA9IG5ldyBtYXN0ZXJzLlBsYXlDb250cm9sKHNjaGVkdWxlciwgdHJhbnNwb3J0KTtcblxuY29uc3QgJHNsaWRlciA9IG5ldyBjb250cm9sbGVycy5TbGlkZXIoe1xuICBsYWJlbDogJ3Bvc2l0aW9uJyxcbiAgbWluOiAwLFxuICBtYXg6IDEwLFxuICBzdGVwOiAwLjAxLFxuICBkZWZhdWx0OiAwLFxuICBzaXplOiAnbGFyZ2UnLFxuICBjb250YWluZXI6ICcuY29udHJvbGxlcnMnLFxuICBjYWxsYmFjazogdmFsdWUgPT4gcGxheUNvbnRyb2wuc2Vlayh2YWx1ZSksXG59KTtcblxubmV3IGNvbnRyb2xsZXJzLlNlbGVjdEJ1dHRvbnMoe1xuICBsYWJlbDogJyZuYnNwOycsXG4gIG9wdGlvbnM6IFsnc3RhcnQnLCAncGF1c2UnLCAnc3RvcCddLFxuICBkZWZhdWx0OiAnc3RvcCcsXG4gIGNvbnRhaW5lcjogJy5jb250cm9sbGVycycsXG4gIGNhbGxiYWNrOiB2YWx1ZSA9PiBwbGF5Q29udHJvbFt2YWx1ZV0oKSxcbn0pO1xuXG5uZXcgY29udHJvbGxlcnMuU2xpZGVyKHtcbiAgbGFiZWw6ICdzcGVlZCcsXG4gIG1pbjogLTEsXG4gIG1heDogMSxcbiAgZGVmYXVsdDogMSxcbiAgc2l6ZTogJ2xhcmdlJyxcbiAgY29udGFpbmVyOiAnLmNvbnRyb2xsZXJzJyxcbiAgY2FsbGJhY2s6IHZhbHVlID0+IHBsYXlDb250cm9sLnNwZWVkID0gdmFsdWUsXG59KTtcblxuXG5jb25zdCBwb3NpdGlvbkRpc3BsYXkgPSBuZXcgUG9zaXRpb25EaXNwbGF5KCRzbGlkZXIpO1xudHJhbnNwb3J0LmFkZChwb3NpdGlvbkRpc3BsYXkpO1xuXG5wbGF5Q29udHJvbC5zZXRMb29wQm91bmRhcmllcygwLCAxMCk7XG5wbGF5Q29udHJvbC5sb29wID0gdHJ1ZTtcbiIsIi8qKiBAbW9kdWxlIGJhc2ljLWNvbnRyb2xsZXIgKi9cblxuY29uc3QgdHlwZUNvdW50ZXJzID0ge307XG5cbi8qKlxuICogQmFzZSBjbGFzcyB0byBjcmVhdGUgbmV3IGNvbnRyb2xsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gU3RyaW5nIGRlc2NyaWJpbmcgdGhlIHR5cGUgb2YgdGhlIGNvbnRyb2xsZXIuXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdHMgLSBEZWZhdWx0IHBhcmFtZXRlcnMgb2YgdGhlIGNvbnRyb2xsZXIuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gVXNlciBkZWZpbmVkIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAqL1xuY2xhc3MgQmFzZUNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHR5cGUsIGRlZmF1bHRzLCBjb25maWcgPSB7fSkge1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgY29uZmlnKTtcblxuICAgIC8vIGhhbmRsZSBpZFxuICAgIGlmICghdHlwZUNvdW50ZXJzW3R5cGVdKVxuICAgICAgdHlwZUNvdW50ZXJzW3R5cGVdID0gMDtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuaWQpIHtcbiAgICAgIHRoaXMuaWQgPSBgJHt0eXBlfS0ke3R5cGVDb3VudGVyc1t0eXBlXX1gO1xuICAgICAgdHlwZUNvdW50ZXJzW3R5cGVdICs9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaWQgPSB0aGlzLnBhcmFtcy5pZDtcbiAgICB9XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5fZ3JvdXBMaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG5cbiAgICAvLyByZWdpc3RlciBjYWxsYmFjayBpZiBnaXZlblxuICAgIGlmICh0aGlzLnBhcmFtcy5jYWxsYmFjaylcbiAgICAgIHRoaXMuYWRkTGlzdGVuZXIodGhpcy5wYXJhbXMuY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGxpc3RlbmVyIHRvIHRoZSBjb250cm9sbGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGJlIGFwcGxpZWQgd2hlbiB0aGUgY29udHJvbGxlclxuICAgKiAgc3RhdGUgY2hhbmdlLlxuICAgKi9cbiAgYWRkTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMuYWRkKGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBhIGxpc3RlbmVyIGlzIGFkZGVkIGZyb20gYSBjb250YWluaW5nIGdyb3VwLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2FkZEdyb3VwTGlzdGVuZXIoaWQsIGNhbGxJZCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIWNhbGxJZClcbiAgICAgIHRoaXMuYWRkTGlzdGVuZXIoY2FsbGJhY2spO1xuICAgIGVsc2Uge1xuICAgICAgdGhpcy5fZ3JvdXBMaXN0ZW5lcnMuYWRkKHsgY2FsbElkLCBjYWxsYmFjayB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZnJvbSB0aGUgY29udHJvbGxlci5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byByZW1vdmUgZnJvbSB0aGUgbGlzdGVuZXJzLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdG9kbyAtIHJlZXhwb3NlIHdoZW4gYGNvbnRhaW5lcmAgY2FuIG92ZXJyaWRlIHRoaXMgbWV0aG9kLi4uXG4gICAqL1xuICAvLyByZW1vdmVMaXN0ZW5lcihjYWxsYmFjaykge1xuICAvLyAgIHRoaXMuX2xpc3RlbmVycy5yZW1vdmUoY2FsbGJhY2spO1xuICAvLyB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGV4ZWN1dGVMaXN0ZW5lcnMoLi4udmFsdWVzKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjayguLi52YWx1ZXMpKTtcblxuICAgIHRoaXMuX2dyb3VwTGlzdGVuZXJzLmZvckVhY2goKHBheWxvYWQpID0+IHtcbiAgICAgIGNvbnN0IHsgY2FsbGJhY2ssIGNhbGxJZCB9ID0gcGF5bG9hZDtcbiAgICAgIGNhbGxiYWNrKGNhbGxJZCwgLi4udmFsdWVzKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCYXNlQ29tcG9uZW50O1xuIiwiaW1wb3J0IEJhc2VDb21wb25lbnQgZnJvbSAnLi9CYXNlQ29tcG9uZW50JztcbmltcG9ydCBkaXNwbGF5IGZyb20gJy4uL21peGlucy9kaXNwbGF5JztcblxuY29uc3QgQXVkaW9Db250ZXh0ID0gKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCk7XG5cbi8qKiBAbW9kdWxlIGJhc2ljLWNvbnRyb2xsZXJzICovXG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICBsYWJlbDogJ0RyYWcgYW5kIGRyb3AgYXVkaW8gZmlsZXMnLFxuICBsYWJlbFByb2Nlc3M6ICdwcm9jZXNzLi4uJyxcbiAgYXVkaW9Db250ZXh0OiBudWxsLFxuICBjb250YWluZXI6IG51bGwsXG4gIGNhbGxiYWNrOiBudWxsLFxufTtcblxuLyoqXG4gKiBEcmFnIGFuZCBkcm9wIHpvbmUgZm9yIGF1ZGlvIGZpbGVzIHJldHVybmluZyBgQXVkaW9CdWZmZXJgcyBhbmQvb3IgSlNPTlxuICogZGVzY3JpcHRvciBkYXRhLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge1N0cmluZ30gW2NvbmZpZy5sYWJlbD0nRHJhZyBhbmQgZHJvcCBhdWRpbyBmaWxlcyddIC0gTGFiZWwgb2YgdGhlXG4gKiAgY29udHJvbGxlci5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbY29uZmlnLmxhYmVsUHJvY2Vzcz0ncHJvY2Vzcy4uLiddIC0gTGFiZWwgb2YgdGhlIGNvbnRyb2xsZXJcbiAqICB3aGlsZSBhdWRpbyBmaWxlcyBhcmUgZGVjb2RlZC5cbiAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBbY29uZmlnLmF1ZGlvQ29udGV4dD1udWxsXSAtIE9wdGlvbm5hbCBhdWRpbyBjb250ZXh0XG4gKiAgdG8gdXNlIGluIG9yZGVyIHRvIGRlY29kZSBhdWRpbyBmaWxlcy5cbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR8YmFzaWMtY29udHJvbGxlcn5Hcm91cH0gW2NvbmZpZy5jb250YWluZXI9bnVsbF0gLVxuICogIENvbnRhaW5lciBvZiB0aGUgY29udHJvbGxlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb25maWcuY2FsbGJhY2s9bnVsbF0gLSBDYWxsYmFjayB0byBiZSBleGVjdXRlZCB3aGVuIHRoZVxuICogIHZhbHVlIGNoYW5nZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGNvbnRyb2xsZXJzIGZyb20gJ2Jhc2ljLWNvbnRyb2xsZXJzJztcbiAqXG4gKiBjb25zdCBkcmFnQW5kRHJvcCA9IG5ldyBjb250cm9sbGVycy5EcmFnQW5kRHJvcCh7XG4gKiAgIGNvbnRhaW5lcjogJyNjb250YWluZXInLFxuICogICBjYWxsYmFjazogKHJlc3VsdHMpID0+IGNvbnNvbGUubG9nKHJlc3VsdHMpLFxuICogfSk7XG4gKi9cbmNsYXNzIERyYWdBbmREcm9wIGV4dGVuZHMgZGlzcGxheShCYXNlQ29tcG9uZW50KSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcignZHJhZy1hbmQtZHJvcCcsIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX3ZhbHVlID0gbnVsbDtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuYXVkaW9Db250ZXh0KVxuICAgICAgdGhpcy5wYXJhbXMuYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuXG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbGFzdCByZXN1bHRzXG4gICAqIEB0eXBlIHtPYmplY3Q8U3RyaW5nLCBBdWRpb0J1ZmZlcnxKU09OPn1cbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgbGFiZWwgfSA9IHRoaXMucGFyYW1zO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBgXG4gICAgICA8ZGl2IGNsYXNzPVwiZHJvcC16b25lXCI+XG4gICAgICAgIDxwIGNsYXNzPVwibGFiZWxcIj4ke2xhYmVsfTwvcD5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICB0aGlzLiRlbCA9IHN1cGVyLnJlbmRlcigpO1xuICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gICAgdGhpcy4kZHJvcFpvbmUgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuZHJvcC16b25lJyk7XG4gICAgdGhpcy4kbGFiZWwgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcubGFiZWwnKTtcblxuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuJGRyb3Bab25lLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIHRoaXMuJGRyb3Bab25lLmNsYXNzTGlzdC5hZGQoJ2RyYWcnKTtcbiAgICAgIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnY29weSc7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdGhpcy4kZHJvcFpvbmUuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIHRoaXMuJGRyb3Bab25lLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWcnKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB0aGlzLiRkcm9wWm9uZS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGNvbnN0IGZpbGVzID0gQXJyYXkuZnJvbShlLmRhdGFUcmFuc2Zlci5maWxlcyk7XG4gICAgICBjb25zdCBhdWRpb0ZpbGVzID0gZmlsZXMuZmlsdGVyKChmaWxlKSA9PiB7XG4gICAgICAgIGlmICgvXmF1ZGlvLy50ZXN0KGZpbGUudHlwZSkpIHtcbiAgICAgICAgICBmaWxlLnNob3J0VHlwZSA9ICdhdWRpbyc7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoL2pzb24kLy50ZXN0KGZpbGUudHlwZSkpIHtcbiAgICAgICAgICBmaWxlLnNob3J0VHlwZSA9ICdqc29uJztcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCByZXN1bHRzID0ge307XG4gICAgICBsZXQgY291bnRlciA9IDA7XG5cbiAgICAgIHRoaXMuJGxhYmVsLnRleHRDb250ZW50ID0gdGhpcy5wYXJhbXMubGFiZWxQcm9jZXNzO1xuXG4gICAgICBjb25zdCB0ZXN0RW5kID0gKCkgPT4ge1xuICAgICAgICBjb3VudGVyICs9IDE7XG5cbiAgICAgICAgaWYgKGNvdW50ZXIgPT09IGF1ZGlvRmlsZXMubGVuZ3RoKcKge1xuICAgICAgICAgIHRoaXMuX3ZhbHVlID0gcmVzdWx0c1xuICAgICAgICAgIHRoaXMuZXhlY3V0ZUxpc3RlbmVycyhyZXN1bHRzKTtcblxuICAgICAgICAgIHRoaXMuJGRyb3Bab25lLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWcnKTtcbiAgICAgICAgICB0aGlzLiRsYWJlbC50ZXh0Q29udGVudCA9IHRoaXMucGFyYW1zLmxhYmVsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZpbGVzLmZvckVhY2goKGZpbGUsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IChlKSA9PiB7XG4gICAgICAgICAgaWYgKGZpbGUuc2hvcnRUeXBlID09PSAnanNvbicpIHtcbiAgICAgICAgICAgIHJlc3VsdHNbZmlsZS5uYW1lXSA9IEpTT04ucGFyc2UoZS50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgICAgIHRlc3RFbmQoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGZpbGUuc2hvcnRUeXBlID09PSAnYXVkaW8nKSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcy5hdWRpb0NvbnRleHRcbiAgICAgICAgICAgICAgLmRlY29kZUF1ZGlvRGF0YShlLnRhcmdldC5yZXN1bHQpXG4gICAgICAgICAgICAgIC50aGVuKChhdWRpb0J1ZmZlcikgPT4ge1xuICAgICAgICAgICAgICAgIHJlc3VsdHNbZmlsZS5uYW1lXSA9IGF1ZGlvQnVmZmVyO1xuICAgICAgICAgICAgICAgIHRlc3RFbmQoKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICByZXN1bHRzW2ZpbGUubmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIHRlc3RFbmQoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpbGUuc2hvcnRUeXBlID09PSAnanNvbicpXG4gICAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG4gICAgICAgIGVsc2UgaWYgKGZpbGUuc2hvcnRUeXBlID09PSAnYXVkaW8nKVxuICAgICAgICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihmaWxlKTtcbiAgICAgIH0pO1xuICAgIH0sIGZhbHNlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEcmFnQW5kRHJvcDtcbiIsImltcG9ydCBCYXNlQ29tcG9uZW50IGZyb20gJy4vQmFzZUNvbXBvbmVudCc7XG5pbXBvcnQgZGlzcGxheSBmcm9tICcuLi9taXhpbnMvZGlzcGxheSc7XG5pbXBvcnQgY29udGFpbmVyIGZyb20gJy4uL21peGlucy9jb250YWluZXInO1xuaW1wb3J0ICogYXMgZWxlbWVudHMgZnJvbSAnLi4vdXRpbHMvZWxlbWVudHMnO1xuXG4vKiogQG1vZHVsZSBiYXNpYy1jb250cm9sbGVycyAqL1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgbGVnZW5kOiAnJm5ic3A7JyxcbiAgZGVmYXVsdDogJ29wZW5lZCcsXG4gIGNvbnRhaW5lcjogbnVsbCxcbn07XG5cbi8qKlxuICogR3JvdXAgb2YgY29udHJvbGxlcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWcubGFiZWwgLSBMYWJlbCBvZiB0aGUgZ3JvdXAuXG4gKiBAcGFyYW0geydvcGVuZWQnfCdjbG9zZWQnfSBbY29uZmlnLmRlZmF1bHQ9J29wZW5lZCddIC0gRGVmYXVsdCBzdGF0ZSBvZiB0aGVcbiAqICBncm91cC5cbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR8YmFzaWMtY29udHJvbGxlcn5Hcm91cH0gW2NvbmZpZy5jb250YWluZXI9bnVsbF0gLVxuICogIENvbnRhaW5lciBvZiB0aGUgY29udHJvbGxlci5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgY29udHJvbGxlcnMgZnJvbSAnYmFzaWMtY29udHJvbGxlcnMnO1xuICpcbiAqIC8vIGNyZWF0ZSBhIGdyb3VwXG4gKiBjb25zdCBncm91cCA9IG5ldyBjb250cm9sbGVycy5Hcm91cCh7XG4gKiAgIGxhYmVsOiAnR3JvdXAnLFxuICogICBkZWZhdWx0OiAnb3BlbmVkJyxcbiAqICAgY29udGFpbmVyOiAnI2NvbnRhaW5lcidcbiAqIH0pO1xuICpcbiAqIC8vIGluc2VydCBjb250cm9sbGVycyBpbiB0aGUgZ3JvdXBcbiAqIGNvbnN0IGdyb3VwU2xpZGVyID0gbmV3IGNvbnRyb2xsZXJzLlNsaWRlcih7XG4gKiAgIGxhYmVsOiAnR3JvdXAgU2xpZGVyJyxcbiAqICAgbWluOiAyMCxcbiAqICAgbWF4OiAxMDAwLFxuICogICBzdGVwOiAxLFxuICogICBkZWZhdWx0OiAyMDAsXG4gKiAgIHVuaXQ6ICdIeicsXG4gKiAgIHNpemU6ICdsYXJnZScsXG4gKiAgIGNvbnRhaW5lcjogZ3JvdXAsXG4gKiAgIGNhbGxiYWNrOiAodmFsdWUpID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGdyb3VwVGV4dCA9IG5ldyBjb250cm9sbGVycy5UZXh0KHtcbiAqICAgbGFiZWw6ICdHcm91cCBUZXh0JyxcbiAqICAgZGVmYXVsdDogJ3RleHQgaW5wdXQnLFxuICogICByZWFkb25seTogZmFsc2UsXG4gKiAgIGNvbnRhaW5lcjogZ3JvdXAsXG4gKiAgIGNhbGxiYWNrOiAodmFsdWUpID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqIH0pO1xuICovXG5jbGFzcyBHcm91cCBleHRlbmRzIGNvbnRhaW5lcihkaXNwbGF5KEJhc2VDb21wb25lbnQpKSB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgIHN1cGVyKCdncm91cCcsIGRlZmF1bHRzLCBjb25maWcpO1xuXG4gICAgdGhpcy5fc3RhdGVzID0gWydvcGVuZWQnLCAnY2xvc2VkJ107XG5cbiAgICBpZiAodGhpcy5fc3RhdGVzLmluZGV4T2YodGhpcy5wYXJhbXMuZGVmYXVsdCkgPT09IC0xKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHN0YXRlIFwiJHt2YWx1ZX1cImApO1xuXG4gICAgdGhpcy5fc3RhdGUgPSB0aGlzLnBhcmFtcy5kZWZhdWx0O1xuXG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXRlIG9mIHRoZSBncm91cCAoYCdvcGVuZWQnYCBvciBgJ2Nsb3NlZCdgKS5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZShzdGF0ZSkge1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGlhcyBmb3IgYHZhbHVlYC5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gIH1cblxuICBzZXQgc3RhdGUodmFsdWUpIHtcbiAgICBpZiAodGhpcy5fc3RhdGVzLmluZGV4T2YodmFsdWUpID09PSAtMSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzdGF0ZSBcIiR7dmFsdWV9XCJgKTtcblxuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5fc3RhdGUpO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQodmFsdWUpO1xuXG4gICAgdGhpcy5fc3RhdGUgPSB2YWx1ZTtcbiAgfVxuXG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgY29udGVudCA9IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJncm91cC1oZWFkZXJcIj5cbiAgICAgICAgJHtlbGVtZW50cy5zbWFsbEFycm93UmlnaHR9XG4gICAgICAgICR7ZWxlbWVudHMuc21hbGxBcnJvd0JvdHRvbX1cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJsYWJlbFwiPiR7dGhpcy5wYXJhbXMubGFiZWx9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZ3JvdXAtY29udGVudFwiPjwvZGl2PlxuICAgIGA7XG5cbiAgICB0aGlzLiRlbCA9IHN1cGVyLnJlbmRlcigpO1xuICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZCh0aGlzLl9zdGF0ZSk7XG5cbiAgICB0aGlzLiRoZWFkZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuZ3JvdXAtaGVhZGVyJyk7XG4gICAgdGhpcy4kY29udGFpbmVyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLmdyb3VwLWNvbnRlbnQnKTtcblxuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLiRoZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX3N0YXRlID09PSAnY2xvc2VkJyA/ICdvcGVuZWQnIDogJ2Nsb3NlZCc7XG4gICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR3JvdXA7XG4iLCJpbXBvcnQgQmFzZUNvbXBvbmVudCBmcm9tICcuL0Jhc2VDb21wb25lbnQnO1xuaW1wb3J0IGRpc3BsYXkgZnJvbSAnLi4vbWl4aW5zL2Rpc3BsYXknO1xuaW1wb3J0ICogYXMgZWxlbWVudHMgZnJvbSAnLi4vdXRpbHMvZWxlbWVudHMnO1xuXG4vKiogQG1vZHVsZSBiYXNpYy1jb250cm9sbGVycyAqL1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgbGFiZWw6ICcmbmJzcDsnLFxuICBtaW46IDAsXG4gIG1heDogMSxcbiAgc3RlcDogMC4wMSxcbiAgZGVmYXVsdDogMCxcbiAgY29udGFpbmVyOiBudWxsLFxuICBjYWxsYmFjazogbnVsbCxcbn07XG5cbi8qKlxuICogTnVtYmVyIEJveCBjb250cm9sbGVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWcubGFiZWwgLSBMYWJlbCBvZiB0aGUgY29udHJvbGxlci5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbY29uZmlnLm1pbj0wXSAtIE1pbmltdW0gdmFsdWUuXG4gKiBAcGFyYW0ge051bWJlcn0gW2NvbmZpZy5tYXg9MV0gLSBNYXhpbXVtIHZhbHVlLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtjb25maWcuc3RlcD0wLjAxXSAtIFN0ZXAgYmV0d2VlbiBjb25zZWN1dGl2ZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge051bWJlcn0gW2NvbmZpZy5kZWZhdWx0PTBdIC0gRGVmYXVsdCB2YWx1ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR8YmFzaWMtY29udHJvbGxlcn5Hcm91cH0gW2NvbmZpZy5jb250YWluZXI9bnVsbF0gLVxuICogIENvbnRhaW5lciBvZiB0aGUgY29udHJvbGxlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb25maWcuY2FsbGJhY2s9bnVsbF0gLSBDYWxsYmFjayB0byBiZSBleGVjdXRlZCB3aGVuIHRoZVxuICogIHZhbHVlIGNoYW5nZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGNvbnRyb2xsZXJzIGZyb20gJ2Jhc2ljLWNvbnRyb2xsZXJzJztcbiAqXG4gKiBjb25zdCBudW1iZXJCb3ggPSBuZXcgY29udHJvbGxlcnMuTnVtYmVyQm94KHtcbiAqICAgbGFiZWw6ICdNeSBOdW1iZXIgQm94JyxcbiAqICAgbWluOiAwLFxuICogICBtYXg6IDEwLFxuICogICBzdGVwOiAwLjEsXG4gKiAgIGRlZmF1bHQ6IDUsXG4gKiAgIGNvbnRhaW5lcjogJyNjb250YWluZXInLFxuICogICBjYWxsYmFjazogKHZhbHVlKSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiB9KTtcbiAqL1xuY2xhc3MgTnVtYmVyQm94IGV4dGVuZHMgZGlzcGxheShCYXNlQ29tcG9uZW50KSB7XG4gIC8vIGxlZ2VuZCwgbWluID0gMCwgbWF4ID0gMSwgc3RlcCA9IDAuMDEsIGRlZmF1bHRWYWx1ZSA9IDAsICRjb250YWluZXIgPSBudWxsLCBjYWxsYmFjayA9IG51bGxcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgc3VwZXIoJ251bWJlci1ib3gnLCBkZWZhdWx0cywgY29uZmlnKTtcblxuICAgIHRoaXMuX3ZhbHVlID0gdGhpcy5wYXJhbXMuZGVmYXVsdDtcbiAgICB0aGlzLl9pc0ludFN0ZXAgPSAodGhpcy5wYXJhbXMuc3RlcCAlIDEgPT09IDApO1xuXG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgdmFsdWUgb2YgdGhlIGNvbnRyb2xsZXIuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgLy8gdXNlICRudW1iZXIgZWxlbWVudCBtaW4sIG1heCBhbmQgc3RlcCBzeXN0ZW1cbiAgICB0aGlzLiRudW1iZXIudmFsdWUgPSB2YWx1ZTtcbiAgICB2YWx1ZSA9IHRoaXMuJG51bWJlci52YWx1ZTtcbiAgICB2YWx1ZSA9IHRoaXMuX2lzSW50U3RlcCA/IHBhcnNlSW50KHZhbHVlLCAxMCkgOiBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGxhYmVsLCBtaW4sIG1heCwgc3RlcCB9ID0gdGhpcy5wYXJhbXM7XG4gICAgY29uc3QgY29udGVudCA9IGBcbiAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWxcIj4ke2xhYmVsfTwvc3Bhbj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpbm5lci13cmFwcGVyXCI+XG4gICAgICAgICR7ZWxlbWVudHMuYXJyb3dMZWZ0fVxuICAgICAgICA8aW5wdXQgY2xhc3M9XCJudW1iZXJcIiB0eXBlPVwibnVtYmVyXCIgbWluPVwiJHttaW59XCIgbWF4PVwiJHttYXh9XCIgc3RlcD1cIiR7c3RlcH1cIiB2YWx1ZT1cIiR7dGhpcy5fdmFsdWV9XCIgLz5cbiAgICAgICAgJHtlbGVtZW50cy5hcnJvd1JpZ2h0fVxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICAgIHRoaXMuJGVsID0gc3VwZXIucmVuZGVyKCk7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZCgnYWxpZ24tc21hbGwnKTtcbiAgICB0aGlzLiRlbC5pbm5lckhUTUwgPSBjb250ZW50O1xuXG4gICAgdGhpcy4kcHJldiA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5hcnJvdy1sZWZ0Jyk7XG4gICAgdGhpcy4kbmV4dCA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5hcnJvdy1yaWdodCcpO1xuICAgIHRoaXMuJG51bWJlciA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJudW1iZXJcIl0nKTtcblxuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLiRwcmV2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGNvbnN0IHN0ZXAgPSB0aGlzLnBhcmFtcy5zdGVwO1xuICAgICAgY29uc3QgZGVjaW1hbHMgPSBzdGVwLnRvU3RyaW5nKCkuc3BsaXQoJy4nKVsxXTtcbiAgICAgIGNvbnN0IGV4cCA9IGRlY2ltYWxzID8gZGVjaW1hbHMubGVuZ3RoIDogMDtcbiAgICAgIGNvbnN0IG11bHQgPSBNYXRoLnBvdygxMCwgZXhwKTtcblxuICAgICAgY29uc3QgaW50VmFsdWUgPSBNYXRoLmZsb29yKHRoaXMuX3ZhbHVlICogbXVsdCArIDAuNSk7XG4gICAgICBjb25zdCBpbnRTdGVwID0gTWF0aC5mbG9vcihzdGVwICogbXVsdCArIDAuNSk7XG4gICAgICBjb25zdCB2YWx1ZSA9IChpbnRWYWx1ZSAtIGludFN0ZXApIC8gbXVsdDtcblxuICAgICAgdGhpcy5fcHJvcGFnYXRlKHZhbHVlKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB0aGlzLiRuZXh0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGNvbnN0IHN0ZXAgPSB0aGlzLnBhcmFtcy5zdGVwO1xuICAgICAgY29uc3QgZGVjaW1hbHMgPSBzdGVwLnRvU3RyaW5nKCkuc3BsaXQoJy4nKVsxXTtcbiAgICAgIGNvbnN0IGV4cCA9IGRlY2ltYWxzID8gZGVjaW1hbHMubGVuZ3RoIDogMDtcbiAgICAgIGNvbnN0IG11bHQgPSBNYXRoLnBvdygxMCwgZXhwKTtcblxuICAgICAgY29uc3QgaW50VmFsdWUgPSBNYXRoLmZsb29yKHRoaXMuX3ZhbHVlICogbXVsdCArIDAuNSk7XG4gICAgICBjb25zdCBpbnRTdGVwID0gTWF0aC5mbG9vcihzdGVwICogbXVsdCArIDAuNSk7XG4gICAgICBjb25zdCB2YWx1ZSA9IChpbnRWYWx1ZSArIGludFN0ZXApIC8gbXVsdDtcblxuICAgICAgdGhpcy5fcHJvcGFnYXRlKHZhbHVlKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB0aGlzLiRudW1iZXIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgIGxldCB2YWx1ZSA9IHRoaXMuJG51bWJlci52YWx1ZTtcbiAgICAgIHZhbHVlID0gdGhpcy5faXNJbnRTdGVwID8gcGFyc2VJbnQodmFsdWUsIDEwKSA6IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgdmFsdWUgPSBNYXRoLm1pbih0aGlzLnBhcmFtcy5tYXgsIE1hdGgubWF4KHRoaXMucGFyYW1zLm1pbiwgdmFsdWUpKTtcblxuICAgICAgdGhpcy5fcHJvcGFnYXRlKHZhbHVlKTtcbiAgICB9LCBmYWxzZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3Byb3BhZ2F0ZSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5fdmFsdWUpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuJG51bWJlci52YWx1ZSA9IHZhbHVlO1xuXG4gICAgdGhpcy5leGVjdXRlTGlzdGVuZXJzKHRoaXMuX3ZhbHVlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBOdW1iZXJCb3g7XG4iLCJpbXBvcnQgQmFzZUNvbXBvbmVudCBmcm9tICcuL0Jhc2VDb21wb25lbnQnO1xuaW1wb3J0IGRpc3BsYXkgZnJvbSAnLi4vbWl4aW5zL2Rpc3BsYXknO1xuaW1wb3J0ICogYXMgZWxlbWVudHMgZnJvbSAnLi4vdXRpbHMvZWxlbWVudHMnO1xuXG4vKiogQG1vZHVsZSBiYXNpYy1jb250cm9sbGVycyAqL1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgbGFiZWw6ICcmbmJzcDsnLFxuICBvcHRpb25zOiBudWxsLFxuICBkZWZhdWx0OiBudWxsLFxuICBjb250YWluZXI6IG51bGwsXG4gIGNhbGxiYWNrOiBudWxsLFxufTtcblxuLyoqXG4gKiBMaXN0IG9mIGJ1dHRvbnMgd2l0aCBzdGF0ZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtTdHJpbmd9IGNvbmZpZy5sYWJlbCAtIExhYmVsIG9mIHRoZSBjb250cm9sbGVyLlxuICogQHBhcmFtIHtBcnJheX0gW2NvbmZpZy5vcHRpb25zPW51bGxdIC0gVmFsdWVzIG9mIHRoZSBkcm9wIGRvd24gbGlzdC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbY29uZmlnLmRlZmF1bHQ9bnVsbF0gLSBEZWZhdWx0IHZhbHVlLlxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudHxiYXNpYy1jb250cm9sbGVyfkdyb3VwfSBbY29uZmlnLmNvbnRhaW5lcj1udWxsXSAtXG4gKiAgQ29udGFpbmVyIG9mIHRoZSBjb250cm9sbGVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbmZpZy5jYWxsYmFjaz1udWxsXSAtIENhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIHdoZW4gdGhlXG4gKiAgdmFsdWUgY2hhbmdlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgY29udHJvbGxlcnMgZnJvbSAnYmFzaWMtY29udHJvbGxlcnMnO1xuICpcbiAqIGNvbnN0IHNlbGVjdEJ1dHRvbnMgPSBuZXcgY29udHJvbGxlcnMuU2VsZWN0QnV0dG9ucyh7XG4gKiAgIGxhYmVsOiAnU2VsZWN0QnV0dG9ucycsXG4gKiAgIG9wdGlvbnM6IFsnc3RhbmRieScsICdydW4nLCAnZW5kJ10sXG4gKiAgIGRlZmF1bHQ6ICdydW4nLFxuICogICBjb250YWluZXI6ICcjY29udGFpbmVyJyxcbiAqICAgY2FsbGJhY2s6ICh2YWx1ZSwgaW5kZXgpID0+IGNvbnNvbGUubG9nKHZhbHVlLCBpbmRleCksXG4gKiB9KTtcbiAqL1xuY2xhc3MgU2VsZWN0QnV0dG9ucyBleHRlbmRzIGRpc3BsYXkoQmFzZUNvbXBvbmVudCkge1xuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICBzdXBlcignc2VsZWN0LWJ1dHRvbnMnLCBkZWZhdWx0cywgY29uZmlnKTtcblxuICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLnBhcmFtcy5vcHRpb25zKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignVHJpZ2dlckJ1dHRvbjogSW52YWxpZCBvcHRpb24gXCJvcHRpb25zXCInKTtcblxuICAgIHRoaXMuX3ZhbHVlID0gdGhpcy5wYXJhbXMuZGVmYXVsdDtcblxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnBhcmFtcy5vcHRpb25zO1xuICAgIGNvbnN0IGluZGV4ID0gb3B0aW9ucy5pbmRleE9mKHRoaXMuX3ZhbHVlKTtcbiAgICB0aGlzLl9pbmRleCA9IGluZGV4ID09PSAtMSA/wqAwIDogaW5kZXg7XG4gICAgdGhpcy5fbWF4SW5kZXggPSBvcHRpb25zLmxlbmd0aCAtIDE7XG5cbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCB2YWx1ZS5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMucGFyYW1zLm9wdGlvbnMuaW5kZXhPZih2YWx1ZSk7XG5cbiAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgb3B0aW9uIGluZGV4LlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGluZGV4KCkge1xuICAgIHRoaXMuX2luZGV4O1xuICB9XG5cbiAgc2V0IGluZGV4KGluZGV4KSB7XG4gICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMuX21heEluZGV4KSByZXR1cm47XG5cbiAgICB0aGlzLl92YWx1ZSA9IHRoaXMucGFyYW1zLm9wdGlvbnNbaW5kZXhdO1xuICAgIHRoaXMuX2luZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5faGlnaGxpZ2h0QnRuKHRoaXMuX2luZGV4KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBvcHRpb25zLCBsYWJlbCB9ID0gdGhpcy5wYXJhbXM7XG4gICAgY29uc3QgY29udGVudCA9IGBcbiAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWxcIj4ke2xhYmVsfTwvc3Bhbj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpbm5lci13cmFwcGVyXCI+XG4gICAgICAgICR7ZWxlbWVudHMuYXJyb3dMZWZ0fVxuICAgICAgICAke29wdGlvbnMubWFwKChvcHRpb24sIGluZGV4KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG5cIiBkYXRhLWluZGV4PVwiJHtpbmRleH1cIiBkYXRhLXZhbHVlPVwiJHtvcHRpb259XCI+XG4gICAgICAgICAgICAgICR7b3B0aW9ufVxuICAgICAgICAgICAgPC9idXR0b24+YDtcbiAgICAgICAgfSkuam9pbignJyl9XG4gICAgICAgICR7ZWxlbWVudHMuYXJyb3dSaWdodH1cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICB0aGlzLiRlbCA9IHN1cGVyLnJlbmRlcih0aGlzLnR5cGUpO1xuICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cbiAgICB0aGlzLiRwcmV2ID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLmFycm93LWxlZnQnKTtcbiAgICB0aGlzLiRuZXh0ID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLmFycm93LXJpZ2h0Jyk7XG4gICAgdGhpcy4kYnRucyA9IEFycmF5LmZyb20odGhpcy4kZWwucXVlcnlTZWxlY3RvckFsbCgnLmJ0bicpKTtcblxuICAgIHRoaXMuX2hpZ2hsaWdodEJ0bih0aGlzLl9pbmRleCk7XG4gICAgdGhpcy5fYmluZEV2ZW50cygpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuJHByZXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2luZGV4IC0gMTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZShpbmRleCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRuZXh0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9pbmRleCArIDE7XG4gICAgICB0aGlzLl9wcm9wYWdhdGUoaW5kZXgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kYnRucy5mb3JFYWNoKCgkYnRuLCBpbmRleCkgPT4ge1xuICAgICAgJGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5fcHJvcGFnYXRlKGluZGV4KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9wcm9wYWdhdGUoaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gdGhpcy5fbWF4SW5kZXgpIHJldHVybjtcblxuICAgIHRoaXMuX2luZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5fdmFsdWUgPSB0aGlzLnBhcmFtcy5vcHRpb25zW2luZGV4XTtcbiAgICB0aGlzLl9oaWdobGlnaHRCdG4odGhpcy5faW5kZXgpO1xuXG4gICAgdGhpcy5leGVjdXRlTGlzdGVuZXJzKHRoaXMuX3ZhbHVlLCB0aGlzLl9pbmRleCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2hpZ2hsaWdodEJ0bihhY3RpdmVJbmRleCkge1xuICAgIHRoaXMuJGJ0bnMuZm9yRWFjaCgoJGJ0biwgaW5kZXgpID0+IHtcbiAgICAgICRidG4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cbiAgICAgIGlmIChhY3RpdmVJbmRleCA9PT0gaW5kZXgpIHtcbiAgICAgICAgJGJ0bi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZWxlY3RCdXR0b25zO1xuIiwiaW1wb3J0IEJhc2VDb21wb25lbnQgZnJvbSAnLi9CYXNlQ29tcG9uZW50JztcbmltcG9ydCBkaXNwbGF5IGZyb20gJy4uL21peGlucy9kaXNwbGF5JztcbmltcG9ydCAqIGFzIGVsZW1lbnRzIGZyb20gJy4uL3V0aWxzL2VsZW1lbnRzJztcblxuLyoqIEBtb2R1bGUgYmFzaWMtY29udHJvbGxlcnMgKi9cblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIGxhYmVsOiAnJm5ic3A7JyxcbiAgb3B0aW9uczogbnVsbCxcbiAgZGVmYXVsdDogbnVsbCxcbiAgY29udGFpbmVyOiBudWxsLFxuICBjYWxsYmFjazogbnVsbCxcbn1cblxuLyoqXG4gKiBEcm9wLWRvd24gbGlzdCBjb250cm9sbGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge1N0cmluZ30gY29uZmlnLmxhYmVsIC0gTGFiZWwgb2YgdGhlIGNvbnRyb2xsZXIuXG4gKiBAcGFyYW0ge0FycmF5fSBbY29uZmlnLm9wdGlvbnM9bnVsbF0gLSBWYWx1ZXMgb2YgdGhlIGRyb3AgZG93biBsaXN0LlxuICogQHBhcmFtIHtOdW1iZXJ9IFtjb25maWcuZGVmYXVsdD1udWxsXSAtIERlZmF1bHQgdmFsdWUuXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fGJhc2ljLWNvbnRyb2xsZXJ+R3JvdXB9IFtjb25maWcuY29udGFpbmVyPW51bGxdIC1cbiAqICBDb250YWluZXIgb2YgdGhlIGNvbnRyb2xsZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29uZmlnLmNhbGxiYWNrPW51bGxdIC0gQ2FsbGJhY2sgdG8gYmUgZXhlY3V0ZWQgd2hlbiB0aGVcbiAqICB2YWx1ZSBjaGFuZ2VzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBjb250cm9sbGVycyBmcm9tICdiYXNpYy1jb250cm9sbGVycyc7XG4gKlxuICogY29uc3Qgc2VsZWN0TGlzdCA9IG5ldyBjb250cm9sbGVycy5TZWxlY3RMaXN0KHtcbiAqICAgbGFiZWw6ICdTZWxlY3RMaXN0JyxcbiAqICAgb3B0aW9uczogWydzdGFuZGJ5JywgJ3J1bicsICdlbmQnXSxcbiAqICAgZGVmYXVsdDogJ3J1bicsXG4gKiAgIGNvbnRhaW5lcjogJyNjb250YWluZXInLFxuICogICBjYWxsYmFjazogKHZhbHVlLCBpbmRleCkgPT4gY29uc29sZS5sb2codmFsdWUsIGluZGV4KSxcbiAqIH0pO1xuICovXG5jbGFzcyBTZWxlY3RMaXN0IGV4dGVuZHMgZGlzcGxheShCYXNlQ29tcG9uZW50KSB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgIHN1cGVyKCdzZWxlY3QtbGlzdCcsIGRlZmF1bHRzLCBjb25maWcpO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMucGFyYW1zLm9wdGlvbnMpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmlnZ2VyQnV0dG9uOiBJbnZhbGlkIG9wdGlvbiBcIm9wdGlvbnNcIicpO1xuXG4gICAgdGhpcy5fdmFsdWUgPSB0aGlzLnBhcmFtcy5kZWZhdWx0O1xuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMucGFyYW1zLm9wdGlvbnM7XG4gICAgY29uc3QgaW5kZXggPSBvcHRpb25zLmluZGV4T2YodGhpcy5fdmFsdWUpO1xuICAgIHRoaXMuX2luZGV4ID0gaW5kZXggPT09IC0xID/CoDAgOiBpbmRleDtcbiAgICB0aGlzLl9tYXhJbmRleCA9IG9wdGlvbnMubGVuZ3RoIC0gMTtcblxuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDdXJyZW50IHZhbHVlLlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMuJHNlbGVjdC52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5faW5kZXggPSB0aGlzLnBhcmFtcy5vcHRpb25zLmluZGV4T2YodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgb3B0aW9uIGluZGV4LlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGluZGV4KCkge1xuICAgIHJldHVybiB0aGlzLl9pbmRleDtcbiAgfVxuXG4gIHNldCBpbmRleChpbmRleCkge1xuICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLl9tYXhJbmRleCkgcmV0dXJuO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLnBhcmFtcy5vcHRpb25zW2luZGV4XTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBsYWJlbCwgb3B0aW9uc8KgfSA9IHRoaXMucGFyYW1zO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBgXG4gICAgICA8c3BhbiBjbGFzcz1cImxhYmVsXCI+JHtsYWJlbH08L3NwYW4+XG4gICAgICA8ZGl2IGNsYXNzPVwiaW5uZXItd3JhcHBlclwiPlxuICAgICAgICAke2VsZW1lbnRzLmFycm93TGVmdH1cbiAgICAgICAgPHNlbGVjdD5cbiAgICAgICAgJHtvcHRpb25zLm1hcCgob3B0aW9uLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHJldHVybiBgPG9wdGlvbiB2YWx1ZT1cIiR7b3B0aW9ufVwiPiR7b3B0aW9ufTwvb3B0aW9uPmA7XG4gICAgICAgIH0pLmpvaW4oJycpfVxuICAgICAgICA8c2VsZWN0PlxuICAgICAgICAke2VsZW1lbnRzLmFycm93UmlnaHR9XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gICAgdGhpcy4kZWwgPSBzdXBlci5yZW5kZXIodGhpcy50eXBlKTtcbiAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKCdhbGlnbi1zbWFsbCcpO1xuICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cbiAgICB0aGlzLiRwcmV2ID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLmFycm93LWxlZnQnKTtcbiAgICB0aGlzLiRuZXh0ID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLmFycm93LXJpZ2h0Jyk7XG4gICAgdGhpcy4kc2VsZWN0ID0gdGhpcy4kZWwucXVlcnlTZWxlY3Rvcignc2VsZWN0Jyk7XG4gICAgLy8gc2V0IHRvIGRlZmF1bHQgdmFsdWVcbiAgICB0aGlzLiRzZWxlY3QudmFsdWUgPSBvcHRpb25zW3RoaXMuX2luZGV4XTtcbiAgICB0aGlzLl9iaW5kRXZlbnRzKCk7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2JpbmRFdmVudHMoKSB7XG4gICAgdGhpcy4kcHJldi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5faW5kZXggLSAxO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKGluZGV4KTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB0aGlzLiRuZXh0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9pbmRleCArIDE7XG4gICAgICB0aGlzLl9wcm9wYWdhdGUoaW5kZXgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHRoaXMuJHNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuJHNlbGVjdC52YWx1ZTtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5wYXJhbXMub3B0aW9ucy5pbmRleE9mKHZhbHVlKTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZShpbmRleCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3Byb3BhZ2F0ZShpbmRleCkge1xuICAgIGlmIChpbmRleCA8IDAgfHzCoGluZGV4ID4gdGhpcy5fbWF4SW5kZXgpIHJldHVybjtcblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wYXJhbXMub3B0aW9uc1tpbmRleF07XG4gICAgdGhpcy5faW5kZXggPSBpbmRleDtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuJHNlbGVjdC52YWx1ZSA9IHZhbHVlO1xuXG4gICAgdGhpcy5leGVjdXRlTGlzdGVuZXJzKHRoaXMuX3ZhbHVlLCB0aGlzLl9pbmRleCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0TGlzdDtcbiIsImltcG9ydCBCYXNlQ29tcG9uZW50IGZyb20gJy4vQmFzZUNvbXBvbmVudCc7XG5pbXBvcnQgZGlzcGxheSBmcm9tICcuLi9taXhpbnMvZGlzcGxheSc7XG5pbXBvcnQgKiBhcyBndWlDb21wb25lbnRzIGZyb20gJ0BpcmNhbS9ndWktY29tcG9uZW50cyc7XG5cbi8qKiBAbW9kdWxlIGJhc2ljLWNvbnRyb2xsZXJzICovXG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICBsYWJlbDogJyZuYnNwOycsXG4gIG1pbjogMCxcbiAgbWF4OiAxLFxuICBzdGVwOiAwLjAxLFxuICBkZWZhdWx0OiAwLFxuICB1bml0OiAnJyxcbiAgc2l6ZTogJ21lZGl1bScsXG4gIGNvbnRhaW5lcjogbnVsbCxcbiAgY2FsbGJhY2s6IG51bGwsXG59XG5cbi8qKlxuICogU2xpZGVyIGNvbnRyb2xsZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWcubGFiZWwgLSBMYWJlbCBvZiB0aGUgY29udHJvbGxlci5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbY29uZmlnLm1pbj0wXSAtIE1pbmltdW0gdmFsdWUuXG4gKiBAcGFyYW0ge051bWJlcn0gW2NvbmZpZy5tYXg9MV0gLSBNYXhpbXVtIHZhbHVlLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtjb25maWcuc3RlcD0wLjAxXSAtIFN0ZXAgYmV0d2VlbiBjb25zZWN1dGl2ZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge051bWJlcn0gW2NvbmZpZy5kZWZhdWx0PTBdIC0gRGVmYXVsdCB2YWx1ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbY29uZmlnLnVuaXQ9JyddIC0gVW5pdCBvZiB0aGUgdmFsdWUuXG4gKiBAcGFyYW0geydzbWFsbCd8J21lZGl1bSd8J2xhcmdlJ30gW2NvbmZpZy5zaXplPSdtZWRpdW0nXSAtIFNpemUgb2YgdGhlXG4gKiAgc2xpZGVyLlxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudHxiYXNpYy1jb250cm9sbGVyfkdyb3VwfSBbY29uZmlnLmNvbnRhaW5lcj1udWxsXSAtXG4gKiAgQ29udGFpbmVyIG9mIHRoZSBjb250cm9sbGVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbmZpZy5jYWxsYmFjaz1udWxsXSAtIENhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIHdoZW4gdGhlXG4gKiAgdmFsdWUgY2hhbmdlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgY29udHJvbGxlcnMgZnJvbSAnYmFzaWMtY29udHJvbGxlcnMnO1xuICpcbiAqIGNvbnN0IHNsaWRlciA9IG5ldyBjb250cm9sbGVycy5TbGlkZXIoe1xuICogICBsYWJlbDogJ015IFNsaWRlcicsXG4gKiAgIG1pbjogMjAsXG4gKiAgIG1heDogMTAwMCxcbiAqICAgc3RlcDogMSxcbiAqICAgZGVmYXVsdDogNTM3LFxuICogICB1bml0OiAnSHonLFxuICogICBzaXplOiAnbGFyZ2UnLFxuICogICBjb250YWluZXI6ICcjY29udGFpbmVyJyxcbiAqICAgY2FsbGJhY2s6ICh2YWx1ZSkgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogfSk7XG4gKi9cbmNsYXNzIFNsaWRlciBleHRlbmRzIGRpc3BsYXkoQmFzZUNvbXBvbmVudCkge1xuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICBzdXBlcignc2xpZGVyJywgZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgICB0aGlzLl92YWx1ZSA9IHRoaXMucGFyYW1zLmRlZmF1bHQ7XG4gICAgdGhpcy5fb25TbGlkZXJDaGFuZ2UgPSB0aGlzLl9vblNsaWRlckNoYW5nZS5iaW5kKHRoaXMpO1xuXG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgdmFsdWUuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuXG4gICAgaWYgKHRoaXMuJG51bWJlciAmJiB0aGlzLiRyYW5nZSkge1xuICAgICAgdGhpcy4kbnVtYmVyLnZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgIHRoaXMuc2xpZGVyLnZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgdW5pdCwgc2l6ZSB9ID0gdGhpcy5wYXJhbXM7XG4gICAgY29uc3QgY29udGVudCA9IGBcbiAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWxcIj4ke2xhYmVsfTwvc3Bhbj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpbm5lci13cmFwcGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJyYW5nZVwiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibnVtYmVyLXdyYXBwZXJcIj5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGNsYXNzPVwibnVtYmVyXCIgbWluPVwiJHttaW59XCIgbWF4PVwiJHttYXh9XCIgc3RlcD1cIiR7c3RlcH1cIiB2YWx1ZT1cIiR7dGhpcy5fdmFsdWV9XCIgLz5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cInVuaXRcIj4ke3VuaXR9PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PmA7XG5cbiAgICB0aGlzLiRlbCA9IHN1cGVyLnJlbmRlcih0aGlzLnR5cGUpO1xuICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZChgc2xpZGVyLSR7c2l6ZX1gKTtcblxuICAgIHRoaXMuJHJhbmdlID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLnJhbmdlJyk7XG4gICAgdGhpcy4kbnVtYmVyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcihgaW5wdXRbdHlwZT1cIm51bWJlclwiXWApO1xuXG4gICAgdGhpcy5zbGlkZXIgPSBuZXcgZ3VpQ29tcG9uZW50cy5TbGlkZXIoe1xuICAgICAgY29udGFpbmVyOiB0aGlzLiRyYW5nZSxcbiAgICAgIGNhbGxiYWNrOiB0aGlzLl9vblNsaWRlckNoYW5nZSxcbiAgICAgIG1pbjogbWluLFxuICAgICAgbWF4OiBtYXgsXG4gICAgICBzdGVwOiBzdGVwLFxuICAgICAgZGVmYXVsdDogdGhpcy5fdmFsdWUsXG4gICAgICBmb3JlZ3JvdW5kQ29sb3I6ICcjYWJhYmFiJyxcbiAgICB9KTtcblxuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICByZXNpemUoKSB7XG4gICAgc3VwZXIucmVzaXplKCk7XG5cbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHTCoH0gPSB0aGlzLiRyYW5nZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB0aGlzLnNsaWRlci5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2JpbmRFdmVudHMoKSB7XG4gICAgdGhpcy4kbnVtYmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gcGFyc2VGbG9hdCh0aGlzLiRudW1iZXIudmFsdWUpO1xuICAgICAgLy8gdGhlIHNsaWRlciBwcm9wYWdhdGVzIHRoZSB2YWx1ZVxuICAgICAgdGhpcy5zbGlkZXIudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG5cbiAgICAgIHRoaXMuZXhlY3V0ZUxpc3RlbmVycyh0aGlzLl92YWx1ZSk7XG4gICAgfSwgZmFsc2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblNsaWRlckNoYW5nZSh2YWx1ZSkge1xuICAgIHRoaXMuJG51bWJlci52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG5cbiAgICB0aGlzLmV4ZWN1dGVMaXN0ZW5lcnModGhpcy5fdmFsdWUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNsaWRlcjtcbiIsImltcG9ydCBCYXNlQ29tcG9uZW50IGZyb20gJy4vQmFzZUNvbXBvbmVudCc7XG5pbXBvcnQgZGlzcGxheSBmcm9tICcuLi9taXhpbnMvZGlzcGxheSc7XG5cbi8qKiBAbW9kdWxlIGJhc2ljLWNvbnRyb2xsZXJzICovXG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICBsYWJlbDogJyZuYnNwOycsXG4gIGRlZmF1bHQ6ICcnLFxuICByZWFkb25seTogZmFsc2UsXG4gIGNvbnRhaW5lcjogbnVsbCxcbiAgY2FsbGJhY2s6IG51bGwsXG59XG5cbi8qKlxuICogVGV4dCBjb250cm9sbGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge1N0cmluZ30gY29uZmlnLmxhYmVsIC0gTGFiZWwgb2YgdGhlIGNvbnRyb2xsZXIuXG4gKiBAcGFyYW0ge0FycmF5fSBbY29uZmlnLmRlZmF1bHQ9JyddIC0gRGVmYXVsdCB2YWx1ZSBvZiB0aGUgY29udHJvbGxlci5cbiAqIEBwYXJhbSB7QXJyYXl9IFtjb25maWcucmVhZG9ubHk9ZmFsc2VdIC0gRGVmaW5lIGlmIHRoZSBjb250cm9sbGVyIGlzIHJlYWRvbmx5LlxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudHxiYXNpYy1jb250cm9sbGVyfkdyb3VwfSBbY29uZmlnLmNvbnRhaW5lcj1udWxsXSAtXG4gKiAgQ29udGFpbmVyIG9mIHRoZSBjb250cm9sbGVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbmZpZy5jYWxsYmFjaz1udWxsXSAtIENhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIHdoZW4gdGhlXG4gKiAgdmFsdWUgY2hhbmdlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgY29udHJvbGxlcnMgZnJvbSAnYmFzaWMtY29udG9sbGVycyc7XG4gKlxuICogY29uc3QgdGV4dCA9IG5ldyBjb250cm9sbGVycy5UZXh0KHtcbiAqICAgbGFiZWw6ICdNeSBUZXh0JyxcbiAqICAgZGVmYXVsdDogJ2RlZmF1bHQgdmFsdWUnLFxuICogICByZWFkb25seTogZmFsc2UsXG4gKiAgIGNvbnRhaW5lcjogJyNjb250YWluZXInLFxuICogICBjYWxsYmFjazogKHZhbHVlKSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiB9KTtcbiAqL1xuY2xhc3MgVGV4dCBleHRlbmRzIGRpc3BsYXkoQmFzZUNvbXBvbmVudCkge1xuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICBzdXBlcigndGV4dCcsIGRlZmF1bHRzLCBjb25maWcpO1xuXG4gICAgdGhpcy5fdmFsdWUgPSB0aGlzLnBhcmFtcy5kZWZhdWx0O1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgdmFsdWUuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgdGhpcy4kaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCByZWFkb25seSA9IHRoaXMucGFyYW1zLnJlYWRvbmx5ID8gJ3JlYWRvbmx5JyA6ICcnO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBgXG4gICAgICA8c3BhbiBjbGFzcz1cImxhYmVsXCI+JHt0aGlzLnBhcmFtcy5sYWJlbH08L3NwYW4+XG4gICAgICA8ZGl2IGNsYXNzPVwiaW5uZXItd3JhcHBlclwiPlxuICAgICAgICA8aW5wdXQgY2xhc3M9XCJ0ZXh0XCIgdHlwZT1cInRleHRcIiB2YWx1ZT1cIiR7dGhpcy5fdmFsdWV9XCIgJHtyZWFkb25seX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICB0aGlzLiRlbCA9IHN1cGVyLnJlbmRlcigpO1xuICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gICAgdGhpcy4kaW5wdXQgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcudGV4dCcpO1xuXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy4kaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoKSA9PiB7XG4gICAgICB0aGlzLl92YWx1ZSA9IHRoaXMuJGlucHV0LnZhbHVlO1xuICAgICAgdGhpcy5leGVjdXRlTGlzdGVuZXJzKHRoaXMuX3ZhbHVlKTtcbiAgICB9LCBmYWxzZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGV4dDtcbiIsImltcG9ydCBCYXNlQ29tcG9uZW50IGZyb20gJy4vQmFzZUNvbXBvbmVudCc7XG5pbXBvcnQgZGlzcGxheSBmcm9tICcuLi9taXhpbnMvZGlzcGxheSc7XG5cbi8qKiBAbW9kdWxlIGJhc2ljLWNvbnRyb2xsZXJzICovXG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICBsYWJlbDogJyZuYnNwOycsXG4gIGNvbnRhaW5lcjogbnVsbCxcbn07XG5cbi8qKlxuICogVGl0bGUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWcubGFiZWwgLSBMYWJlbCBvZiB0aGUgY29udHJvbGxlci5cbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR8YmFzaWMtY29udHJvbGxlcn5Hcm91cH0gW2NvbmZpZy5jb250YWluZXI9bnVsbF0gLVxuICogIENvbnRhaW5lciBvZiB0aGUgY29udHJvbGxlci5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgY29udHJvbGxlciBmcm9tICdiYXNpYy1jb250cm9sbGVycyc7XG4gKlxuICogY29uc3QgdGl0bGUgPSBuZXcgY29udHJvbGxlcnMuVGl0bGUoe1xuICogICBsYWJlbDogJ015IFRpdGxlJyxcbiAqICAgY29udGFpbmVyOiAnI2NvbnRhaW5lcidcbiAqIH0pO1xuICovXG5jbGFzcyBUaXRsZSBleHRlbmRzIGRpc3BsYXkoQmFzZUNvbXBvbmVudCkge1xuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICBzdXBlcigndGl0bGUnLCBkZWZhdWx0cywgY29uZmlnKTtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSBgPHNwYW4gY2xhc3M9XCJsYWJlbFwiPiR7dGhpcy5wYXJhbXMubGFiZWx9PC9zcGFuPmA7XG5cbiAgICB0aGlzLiRlbCA9IHN1cGVyLnJlbmRlcigpO1xuICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGl0bGU7XG4iLCJpbXBvcnQgQmFzZUNvbXBvbmVudCBmcm9tICcuL0Jhc2VDb21wb25lbnQnO1xuaW1wb3J0IGRpc3BsYXkgZnJvbSAnLi4vbWl4aW5zL2Rpc3BsYXknO1xuaW1wb3J0ICogYXMgZWxlbWVudHMgZnJvbSAnLi4vdXRpbHMvZWxlbWVudHMnO1xuXG4vKiogQG1vZHVsZSBiYXNpYy1jb250cm9sbGVycyAqL1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgbGFiZWw6ICcmYm5zcDsnLFxuICBhY3RpdmU6IGZhbHNlLFxuICBjb250YWluZXI6IG51bGwsXG4gIGNhbGxiYWNrOiBudWxsLFxufTtcblxuLyoqXG4gKiBPbi9PZmYgY29udHJvbGxlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtTdHJpbmd9IGNvbmZpZy5sYWJlbCAtIExhYmVsIG9mIHRoZSBjb250cm9sbGVyLlxuICogQHBhcmFtIHtBcnJheX0gW2NvbmZpZy5hY3RpdmU9ZmFsc2VdIC0gRGVmYXVsdCBzdGF0ZSBvZiB0aGUgdG9nZ2xlLlxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudHxiYXNpYy1jb250cm9sbGVyfkdyb3VwfSBbY29uZmlnLmNvbnRhaW5lcj1udWxsXSAtXG4gKiAgQ29udGFpbmVyIG9mIHRoZSBjb250cm9sbGVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbmZpZy5jYWxsYmFjaz1udWxsXSAtIENhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIHdoZW4gdGhlXG4gKiAgdmFsdWUgY2hhbmdlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgY29udHJvbGxlcnMgZnJvbSAnYmFzaWMtY29udHJvbGxlcnMnO1xuICpcbiAqIGNvbnN0IHRvZ2dsZSA9IG5ldyBjb250cm9sbGVycy5Ub2dnbGUoe1xuICogICBsYWJlbDogJ015IFRvZ2dsZScsXG4gKiAgIGFjdGl2ZTogZmFsc2UsXG4gKiAgIGNvbnRhaW5lcjogJyNjb250YWluZXInLFxuICogICBjYWxsYmFjazogKGFjdGl2ZSkgPT4gY29uc29sZS5sb2coYWN0aXZlKSxcbiAqIH0pO1xuICovXG5jbGFzcyBUb2dnbGUgZXh0ZW5kcyBkaXNwbGF5KEJhc2VDb21wb25lbnQpIHtcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgc3VwZXIoJ3RvZ2dsZScsIGRlZmF1bHRzLCBjb25maWcpO1xuXG4gICAgdGhpcy5fYWN0aXZlID0gdGhpcy5wYXJhbXMuYWN0aXZlO1xuXG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbHVlIG9mIHRoZSB0b2dnbGVcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBzZXQgdmFsdWUoYm9vbCkge1xuICAgIHRoaXMuYWN0aXZlID0gYm9vbDtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsaWFzIGZvciBgdmFsdWVgLlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHNldCBhY3RpdmUoYm9vbCkge1xuICAgIHRoaXMuX2FjdGl2ZSA9IGJvb2w7XG4gICAgdGhpcy5fdXBkYXRlQnRuKCk7XG4gIH1cblxuICBnZXQgYWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmU7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3VwZGF0ZUJ0bigpIHtcbiAgICB2YXIgbWV0aG9kID0gdGhpcy5hY3RpdmUgPyAnYWRkJyA6ICdyZW1vdmUnO1xuICAgIHRoaXMuJHRvZ2dsZS5jbGFzc0xpc3RbbWV0aG9kXSgnYWN0aXZlJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcmVuZGVyKCkge1xuICAgIGxldCBjb250ZW50ID0gYFxuICAgICAgPHNwYW4gY2xhc3M9XCJsYWJlbFwiPiR7dGhpcy5wYXJhbXMubGFiZWx9PC9zcGFuPlxuICAgICAgPGRpdiBjbGFzcz1cImlubmVyLXdyYXBwZXJcIj5cbiAgICAgICAgJHtlbGVtZW50cy50b2dnbGV9XG4gICAgICA8L2Rpdj5gO1xuXG4gICAgdGhpcy4kZWwgPSBzdXBlci5yZW5kZXIoKTtcbiAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKCdhbGlnbi1zbWFsbCcpO1xuICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cbiAgICB0aGlzLiR0b2dnbGUgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcudG9nZ2xlLWVsZW1lbnQnKTtcbiAgICAvLyBpbml0aWFsaXplIHN0YXRlXG4gICAgdGhpcy5hY3RpdmUgPSB0aGlzLl9hY3RpdmU7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLiR0b2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0aGlzLmFjdGl2ZSA9ICF0aGlzLmFjdGl2ZTtcbiAgICAgIHRoaXMuZXhlY3V0ZUxpc3RlbmVycyh0aGlzLl9hY3RpdmUpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRvZ2dsZTtcbiIsImltcG9ydCBCYXNlQ29tcG9uZW50IGZyb20gJy4vQmFzZUNvbXBvbmVudCc7XG5pbXBvcnQgZGlzcGxheSBmcm9tICcuLi9taXhpbnMvZGlzcGxheSc7XG5cbi8qKiBAbW9kdWxlIGJhc2ljLWNvbnRyb2xsZXJzICovXG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICBsYWJlbDogJyZuYnNwOycsXG4gIG9wdGlvbnM6IG51bGwsXG4gIGNvbnRhaW5lcjogbnVsbCxcbiAgY2FsbGJhY2s6IG51bGwsXG59O1xuXG4vKipcbiAqIExpc3Qgb2YgYnV0dG9ucyB3aXRob3V0IHN0YXRlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge1N0cmluZ30gY29uZmlnLmxhYmVsIC0gTGFiZWwgb2YgdGhlIGNvbnRyb2xsZXIuXG4gKiBAcGFyYW0ge0FycmF5fSBbY29uZmlnLm9wdGlvbnM9bnVsbF0gLSBPcHRpb25zIGZvciBlYWNoIGJ1dHRvbi5cbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR8YmFzaWMtY29udHJvbGxlcn5Hcm91cH0gW2NvbmZpZy5jb250YWluZXI9bnVsbF0gLVxuICogIENvbnRhaW5lciBvZiB0aGUgY29udHJvbGxlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb25maWcuY2FsbGJhY2s9bnVsbF0gLSBDYWxsYmFjayB0byBiZSBleGVjdXRlZCB3aGVuIHRoZVxuICogIHZhbHVlIGNoYW5nZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGNvbnRyb2xsZXJzIGZyb20gJ2Jhc2ljLWNvbnRyb2xsZXJzJztcbiAqXG4gKiBjb25zdCB0cmlnZ2VyQnV0dG9ucyA9IG5ldyBjb250cm9sbGVycy5UcmlnZ2VyQnV0dG9ucyh7XG4gKiAgIGxhYmVsOiAnTXkgVHJpZ2dlciBCdXR0b25zJyxcbiAqICAgb3B0aW9uczogWyd2YWx1ZSAxJywgJ3ZhbHVlIDInLCAndmFsdWUgMyddLFxuICogICBjb250YWluZXI6ICcjY29udGFpbmVyJyxcbiAqICAgY2FsbGJhY2s6ICh2YWx1ZSwgaW5kZXgpID0+IGNvbnNvbGUubG9nKHZhbHVlLCBpbmRleCksXG4gKiB9KTtcbiAqL1xuY2xhc3MgVHJpZ2dlckJ1dHRvbnMgZXh0ZW5kcyBkaXNwbGF5KEJhc2VDb21wb25lbnQpIHtcbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgc3VwZXIoJ3RyaWdnZXItYnV0dG9ucycsIGRlZmF1bHRzLCBjb25maWcpO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMucGFyYW1zLm9wdGlvbnMpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmlnZ2VyQnV0dG9uOiBJbnZhbGlkIG9wdGlvbiBcIm9wdGlvbnNcIicpO1xuXG4gICAgdGhpcy5faW5kZXggPSBudWxsO1xuICAgIHRoaXMuX3ZhbHVlID0gbnVsbDtcblxuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMYXN0IHRyaWdnZXJlZCBidXR0b24gdmFsdWUuXG4gICAqXG4gICAqIEByZWFkb25seVxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgZ2V0IHZhbHVlKCkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cblxuICAvKipcbiAgICogTGFzdCB0cmlnZ2VyZWQgYnV0dG9uIGluZGV4LlxuICAgKlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGdldCBpbmRleCgpIHsgcmV0dXJuIHRoaXMuX2luZGV4OyB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGxhYmVsLCBvcHRpb25zIH0gPSB0aGlzLnBhcmFtcztcblxuICAgIGNvbnN0IGNvbnRlbnQgPSBgXG4gICAgICA8c3BhbiBjbGFzcz1cImxhYmVsXCI+JHtsYWJlbH08L3NwYW4+XG4gICAgICA8ZGl2IGNsYXNzPVwiaW5uZXItd3JhcHBlclwiPlxuICAgICAgICAke29wdGlvbnMubWFwKChvcHRpb24sIGluZGV4KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGA8YSBocmVmPVwiI1wiIGNsYXNzPVwiYnRuXCI+JHtvcHRpb259PC9hPmA7XG4gICAgICAgIH0pLmpvaW4oJycpfVxuICAgICAgPC9kaXY+YDtcblxuICAgIHRoaXMuJGVsID0gc3VwZXIucmVuZGVyKCk7XG4gICAgdGhpcy4kZWwuaW5uZXJIVE1MID0gY29udGVudDtcblxuICAgIHRoaXMuJGJ1dHRvbnMgPSBBcnJheS5mcm9tKHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5idG4nKSk7XG4gICAgdGhpcy5fYmluZEV2ZW50cygpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuJGJ1dHRvbnMuZm9yRWFjaCgoJGJ0biwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wYXJhbXMub3B0aW9uc1tpbmRleF07XG5cbiAgICAgICRidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5faW5kZXggPSBpbmRleDtcblxuICAgICAgICB0aGlzLmV4ZWN1dGVMaXN0ZW5lcnModmFsdWUsIGluZGV4KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyaWdnZXJCdXR0b25zO1xuIiwiaW1wb3J0IEJhc2VDb21wb25lbnQgZnJvbSAnLi9jb21wb25lbnRzL0Jhc2VDb21wb25lbnQnO1xuaW1wb3J0IEdyb3VwIGZyb20gJy4vY29tcG9uZW50cy9Hcm91cCc7XG5pbXBvcnQgTnVtYmVyQm94IGZyb20gJy4vY29tcG9uZW50cy9OdW1iZXJCb3gnO1xuaW1wb3J0IFNlbGVjdEJ1dHRvbnMgZnJvbSAnLi9jb21wb25lbnRzL1NlbGVjdEJ1dHRvbnMnO1xuaW1wb3J0IFNlbGVjdExpc3QgZnJvbSAnLi9jb21wb25lbnRzL1NlbGVjdExpc3QnO1xuaW1wb3J0IFNsaWRlciBmcm9tICcuL2NvbXBvbmVudHMvU2xpZGVyJztcbmltcG9ydCBUZXh0IGZyb20gJy4vY29tcG9uZW50cy9UZXh0JztcbmltcG9ydCBUaXRsZSBmcm9tICcuL2NvbXBvbmVudHMvVGl0bGUnO1xuaW1wb3J0IFRvZ2dsZSBmcm9tICcuL2NvbXBvbmVudHMvVG9nZ2xlJztcbmltcG9ydCBUcmlnZ2VyQnV0dG9ucyBmcm9tICcuL2NvbXBvbmVudHMvVHJpZ2dlckJ1dHRvbnMnO1xuXG5pbXBvcnQgY29udGFpbmVyIGZyb20gJy4vbWl4aW5zL2NvbnRhaW5lcic7XG5cbi8vIG1hcCB0eXBlIG5hbWVzIHRvIGNvbnN0cnVjdG9yc1xuY29uc3QgdHlwZUN0b3JNYXAgPSB7XG4gICdncm91cCc6IEdyb3VwLFxuICAnbnVtYmVyLWJveCc6IE51bWJlckJveCxcbiAgJ3NlbGVjdC1idXR0b25zJzogU2VsZWN0QnV0dG9ucyxcbiAgJ3NlbGVjdC1saXN0JzogU2VsZWN0TGlzdCxcbiAgJ3NsaWRlcic6IFNsaWRlcixcbiAgJ3RleHQnOiBUZXh0LFxuICAndGl0bGUnOiBUaXRsZSxcbiAgJ3RvZ2dsZSc6IFRvZ2dsZSxcbiAgJ3RyaWdnZXItYnV0dG9ucyc6IFRyaWdnZXJCdXR0b25zLFxufTtcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIGNvbnRhaW5lcjogJ2JvZHknLFxufTtcblxuY2xhc3MgQ29udHJvbCBleHRlbmRzIGNvbnRhaW5lcihCYXNlQ29tcG9uZW50KSB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgIHN1cGVyKCdjb250cm9sJywgZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgICBsZXQgJGNvbnRhaW5lciA9IHRoaXMucGFyYW1zLmNvbnRhaW5lcjtcblxuICAgIGlmICh0eXBlb2YgJGNvbnRhaW5lciA9PT0gJ3N0cmluZycpXG4gICAgICAkY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigkY29udGFpbmVyKTtcblxuICAgIHRoaXMuJGNvbnRhaW5lciA9ICRjb250YWluZXI7XG4gIH1cbn1cblxuLyoqIEBtb2R1bGUgYmFzaWMtY29udHJvbGxlcnMgKi9cblxuLyoqXG4gKiBDcmVhdGUgYSB3aG9sZSBjb250cm9sIHN1cmZhY2UgZnJvbSBhIGpzb24gZGVmaW5pdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fSBjb250YWluZXIgLSBDb250YWluZXIgb2YgdGhlIGNvbnRyb2xzLlxuICogQHBhcmFtIHtPYmplY3R9IC0gRGVmaW5pdGlvbnMgZm9yIHRoZSBjb250cm9scy5cbiAqIEByZXR1cm4ge09iamVjdH0gLSBBIGBDb250cm9sYCBpbnN0YW5jZSB0aGF0IGJlaGF2ZXMgbGlrZSBhIGdyb3VwIHdpdGhvdXQgZ3JhcGhpYy5cbiAqIEBzdGF0aWNcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgY29udHJvbGxlcnMgZnJvbSAnYmFzaWMtY29udHJvbGxlcnMnO1xuICpcbiAqIGNvbnN0IGRlZmluaXRpb25zID0gW1xuICogICB7XG4gKiAgICAgaWQ6ICdteS1zbGlkZXInLFxuICogICAgIHR5cGU6ICdzbGlkZXInLFxuICogICAgIGxhYmVsOiAnTXkgU2xpZGVyJyxcbiAqICAgICBzaXplOiAnbGFyZ2UnLFxuICogICAgIG1pbjogMCxcbiAqICAgICBtYXg6IDEwMDAsXG4gKiAgICAgc3RlcDogMSxcbiAqICAgICBkZWZhdWx0OiAyNTMsXG4gKiAgIH0sIHtcbiAqICAgICBpZDogJ215LWdyb3VwJyxcbiAqICAgICB0eXBlOiAnZ3JvdXAnLFxuICogICAgIGxhYmVsOiAnR3JvdXAnLFxuICogICAgIGRlZmF1bHQ6ICdvcGVuZWQnLFxuICogICAgIGVsZW1lbnRzOiBbXG4gKiAgICAgICB7XG4gKiAgICAgICAgIGlkOiAnbXktbnVtYmVyJyxcbiAqICAgICAgICAgdHlwZTogJ251bWJlci1ib3gnLFxuICogICAgICAgICBkZWZhdWx0OiAwLjQsXG4gKiAgICAgICAgIG1pbjogLTEsXG4gKiAgICAgICAgIG1heDogMSxcbiAqICAgICAgICAgc3RlcDogMC4wMSxcbiAqICAgICAgIH1cbiAqICAgICBdLFxuICogICB9XG4gKiBdO1xuICpcbiAqIGNvbnN0IGNvbnRyb2xzID0gY29udHJvbGxlcnMuY3JlYXRlKCcjY29udGFpbmVyJywgZGVmaW5pdGlvbnMpO1xuICpcbiAqIC8vIGFkZCBhIGxpc3RlbmVyIG9uIGFsbCB0aGUgY29tcG9uZW50IGluc2lkZSBgbXktZ3JvdXBgXG4gKiBjb250cm9scy5hZGRMaXN0ZW5lcignbXktZ3JvdXAnLCAoaWQsIHZhbHVlKSA9PiBjb25zb2xlLmxvZyhpZCwgdmFsdWUpKTtcbiAqXG4gKiAvLyByZXRyaWV2ZSB0aGUgaW5zdGFuY2Ugb2YgYG15LW51bWJlcmBcbiAqIGNvbnN0IG15TnVtYmVyID0gY29udHJvbHMuZ2V0Q29tcG9uZW50KCdteS1ncm91cC9teS1udW1iZXInKTtcbiAqL1xuZnVuY3Rpb24gY3JlYXRlKGNvbnRhaW5lciwgZGVmaW5pdGlvbnMpIHtcblxuICBmdW5jdGlvbiBfcGFyc2UoY29udGFpbmVyLCBkZWZpbml0aW9ucykge1xuICAgIGRlZmluaXRpb25zLmZvckVhY2goKGRlZiwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHR5cGUgPSBkZWYudHlwZTtcbiAgICAgIGNvbnN0IGN0b3IgPSB0eXBlQ3Rvck1hcFt0eXBlXTtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZik7XG5cbiAgICAgIC8vXG4gICAgICBjb25maWcuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgZGVsZXRlIGNvbmZpZy50eXBlO1xuXG4gICAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgY3Rvcihjb25maWcpO1xuXG4gICAgICBpZiAodHlwZSA9PT0gJ2dyb3VwJylcbiAgICAgICAgX3BhcnNlKGNvbXBvbmVudCwgY29uZmlnLmVsZW1lbnRzKTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBfcm9vdCA9IG5ldyBDb250cm9sKHsgY29udGFpbmVyOiBjb250YWluZXIgfSk7XG4gIF9wYXJzZShfcm9vdCwgZGVmaW5pdGlvbnMpO1xuXG4gIHJldHVybiBfcm9vdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlO1xuIiwiaW1wb3J0ICogYXMgX3N0eWxlcyBmcm9tICcuL3V0aWxzL3N0eWxlcyc7XG5leHBvcnQgY29uc3Qgc3R5bGVzID0gX3N0eWxlcztcblxuLyoqIEBtb2R1bGUgYmFzaWMtY29udHJvbGxlcnMgKi9cblxuLy8gZXhwb3NlIGZvciBwbHVnaW5zXG5pbXBvcnQgX0Jhc2VDb21wb25lbnQgZnJvbSAnLi9jb21wb25lbnRzL0Jhc2VDb21wb25lbnQnO1xuZXhwb3J0IGNvbnN0IEJhc2VDb21wb25lbnQgPSBfQmFzZUNvbXBvbmVudDtcblxuLy8gY29tcG9uZW50c1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBHcm91cCB9IGZyb20gJy4vY29tcG9uZW50cy9Hcm91cCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIERyYWdBbmREcm9wIH0gZnJvbSAnLi9jb21wb25lbnRzL0RyYWdBbmREcm9wJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTnVtYmVyQm94IH0gZnJvbSAnLi9jb21wb25lbnRzL051bWJlckJveCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNlbGVjdEJ1dHRvbnMgfSBmcm9tICcuL2NvbXBvbmVudHMvU2VsZWN0QnV0dG9ucyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNlbGVjdExpc3QgfSBmcm9tICcuL2NvbXBvbmVudHMvU2VsZWN0TGlzdCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNsaWRlciB9IGZyb20gJy4vY29tcG9uZW50cy9TbGlkZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBUZXh0IH0gZnJvbSAnLi9jb21wb25lbnRzL1RleHQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBUaXRsZSB9IGZyb20gJy4vY29tcG9uZW50cy9UaXRsZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFRvZ2dsZSB9IGZyb20gJy4vY29tcG9uZW50cy9Ub2dnbGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBUcmlnZ2VyQnV0dG9ucyB9IGZyb20gJy4vY29tcG9uZW50cy9UcmlnZ2VyQnV0dG9ucyc7XG5cbi8vIGZhY3RvcnlcbmV4cG9ydCB7IGRlZmF1bHQgYXMgY3JlYXRlIH0gZnJvbSAnLi9mYWN0b3J5Jztcbi8vIGRpc3BsYXlcbmV4cG9ydCB7IHNldFRoZW1lICB9IGZyb20gJy4vbWl4aW5zL2Rpc3BsYXknO1xuXG4vKipcbiAqIERpc2FibGUgZGVmYXVsdCBzdHlsaW5nIChleHBlY3QgYSBicm9rZW4gdWkpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXNhYmxlU3R5bGVzKCkge1xuICBfc3R5bGVzLmRpc2FibGUoKTtcbn07XG4iLCJcbmNvbnN0IHNlcGFyYXRvciA9ICcvJztcblxuZnVuY3Rpb24gZ2V0SGVhZChwYXRoKSB7XG4gIHJldHVybiBwYXRoLnNwbGl0KHNlcGFyYXRvcilbMF07XG59XG5cbmZ1bmN0aW9uIGdldFRhaWwocGF0aCkge1xuICBjb25zdCBwYXJ0cyA9IHBhdGguc3BsaXQoc2VwYXJhdG9yKTtcbiAgcGFydHMuc2hpZnQoKTtcbiAgcmV0dXJuIHBhcnRzLmpvaW4oc2VwYXJhdG9yKTtcbn1cblxuY29uc3QgY29udGFpbmVyID0gKHN1cGVyY2xhc3MpID0+IGNsYXNzIGV4dGVuZHMgc3VwZXJjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcblxuICAgIHRoaXMuZWxlbWVudHMgPSBuZXcgU2V0KCk7XG5cbiAgICAvLyBzdXJlIG9mIHRoYXQgP1xuICAgIGRlbGV0ZSB0aGlzLl9saXN0ZW5lcnM7XG4gICAgZGVsZXRlIHRoaXMuX2dyb3VwTGlzdGVuZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBvbmUgb2YgdGhlIGdyb3VwIGNoaWxkcmVuIGFjY29yZGluZyB0byBpdHMgYGlkYCwgYG51bGxgIG90aGVyd2lzZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9nZXRIZWFkKGlkKSB7XG5cbiAgfVxuXG4gIF9nZXRUYWlsKGlkKSB7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBjaGlsZCBvZiB0aGUgZ3JvdXAgcmVjdXJzaXZlbHkgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBgaWRgLFxuICAgKiBgbnVsbGAgb3RoZXJ3aXNlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0Q29tcG9uZW50KGlkKSB7XG4gICAgY29uc3QgaGVhZCA9IGdldEhlYWQoaWQpO1xuXG4gICAgZm9yIChsZXQgY29tcG9uZW50IG9mIHRoaXMuZWxlbWVudHMpIHtcbiAgICAgIGlmIChoZWFkID09PSBjb21wb25lbnQuaWQpIHtcbiAgICAgICAgaWYgKGhlYWQgPT09IGlkKVxuICAgICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgICAgIGVsc2UgaWYgKGNvbXBvbmVudC50eXBlID0gJ2dyb3VwJylcbiAgICAgICAgICByZXR1cm4gY29tcG9uZW50LmdldENvbXBvbmVudChnZXRUYWlsKGlkKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZGVmaW5lZCBjb21wb25lbnQgJHtpZH1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZGVmaW5lZCBjb21wb25lbnQgJHtpZH1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgTGlzdGVuZXIgb24gZWFjaCBjb21wb25lbnRzIG9mIHRoZSBncm91cC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gUGF0aCB0byBjb21wb25lbnQgaWQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gZXhlY3V0ZS5cbiAgICovXG4gIGFkZExpc3RlbmVyKGlkLCBjYWxsYmFjaykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBjYWxsYmFjayA9IGlkO1xuICAgICAgdGhpcy5fYWRkR3JvdXBMaXN0ZW5lcignJywgJycsIGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYWRkR3JvdXBMaXN0ZW5lcihpZCwgJycsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2FkZEdyb3VwTGlzdGVuZXIoaWQsIGNhbGxJZCwgY2FsbGJhY2spIHtcbiAgICBpZiAoaWQpIHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudElkID0gZ2V0SGVhZChpZCk7XG4gICAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmdldENvbXBvbmVudChjb21wb25lbnRJZCk7XG5cbiAgICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgICAgaWQgPSBnZXRUYWlsKGlkKTtcbiAgICAgICAgY29tcG9uZW50Ll9hZGRHcm91cExpc3RlbmVyKGlkLCBjYWxsSWQsIGNhbGxiYWNrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5kZWZpbmVkIGNvbXBvbmVudCAke3RoaXMucm9vdElkfS8ke2NvbXBvbmVudElkfWApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsZW1lbnRzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICBsZXQgX2NhbGxJZCA9IGNhbGxJZDsgLy8gY3JlYXRlIGEgbmV3IGJyYW5jaGVcbiAgICAgICAgX2NhbGxJZCArPSAoY2FsbElkID09PSAnJykgPyBjb21wb25lbnQuaWQgOiBzZXBhcmF0b3IgKyBjb21wb25lbnQuaWQ7XG4gICAgICAgIGNvbXBvbmVudC5fYWRkR3JvdXBMaXN0ZW5lcihpZCwgX2NhbGxJZCwgY2FsbGJhY2spO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbnRhaW5lcjtcbiIsImltcG9ydCAqIGFzIHN0eWxlcyBmcm9tICcuLi91dGlscy9zdHlsZXMnO1xuXG4vKiogQG1vZHVsZSBiYXNpYy1jb250cm9sbGVycyAqL1xuXG4vLyBkZWZhdWx0IHRoZW1lXG5sZXQgdGhlbWUgPSAnbGlnaHQnO1xuLy8gc2V0IG9mIHRoZSBpbnN0YW5jaWF0ZWQgY29udHJvbGxlcnNcbmNvbnN0IGNvbnRyb2xsZXJzID0gbmV3IFNldCgpO1xuXG5cbi8qKlxuICogQ2hhbmdlIHRoZSB0aGVtZSBvZiB0aGUgY29udHJvbGxlcnMsIGN1cnJlbnRseSAzIHRoZW1lcyBhcmUgYXZhaWxhYmxlOlxuICogIC0gYCdsaWdodCdgIChkZWZhdWx0KVxuICogIC0gYCdncmV5J2BcbiAqICAtIGAnZGFyaydgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRoZW1lIC0gTmFtZSBvZiB0aGUgdGhlbWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRUaGVtZSh2YWx1ZSkge1xuICBjb250cm9sbGVycy5mb3JFYWNoKChjb250cm9sbGVyKSA9PiBjb250cm9sbGVyLiRlbC5jbGFzc0xpc3QucmVtb3ZlKHRoZW1lKSk7XG4gIHRoZW1lID0gdmFsdWU7XG4gIGNvbnRyb2xsZXJzLmZvckVhY2goKGNvbnRyb2xsZXIpID0+IGNvbnRyb2xsZXIuJGVsLmNsYXNzTGlzdC5hZGQodGhlbWUpKTtcbn1cblxuLyoqXG4gKiBkaXNwbGF5IG1peGluIC0gY29tcG9uZW50cyB3aXRoIERPTVxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgZGlzcGxheSA9IChzdXBlcmNsYXNzKSA9PiBjbGFzcyBleHRlbmRzIHN1cGVyY2xhc3Mge1xuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncyk7XG5cbiAgICAvLyBpbnNlcnQgc3R5bGVzIHdoZW4gdGhlIGZpcnN0IGNvbnRyb2xsZXIgaXMgY3JlYXRlZFxuICAgIGlmIChjb250cm9sbGVycy5zaXplID09PSAwKVxuICAgICAgc3R5bGVzLmluc2VydFN0eWxlU2hlZXQoKTtcblxuICAgIHRoaXMucmVzaXplID0gdGhpcy5yZXNpemUuYmluZCh0aGlzKTtcblxuICAgIGNvbnRyb2xsZXJzLmFkZCh0aGlzKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgbGV0ICRjb250YWluZXIgPSB0aGlzLnBhcmFtcy5jb250YWluZXI7XG5cbiAgICBpZiAoJGNvbnRhaW5lcikge1xuICAgICAgLy8gY3NzIHNlbGVjdG9yXG4gICAgICBpZiAodHlwZW9mICRjb250YWluZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICRjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCRjb250YWluZXIpO1xuICAgICAgLy8gZ3JvdXBcbiAgICAgIH0gZWxzZSBpZiAoJGNvbnRhaW5lci4kY29udGFpbmVyKSB7XG4gICAgICAgIC8vIHRoaXMuZ3JvdXAgPSAkY29udGFpbmVyO1xuICAgICAgICAkY29udGFpbmVyLmVsZW1lbnRzLmFkZCh0aGlzKTtcbiAgICAgICAgJGNvbnRhaW5lciA9ICRjb250YWluZXIuJGNvbnRhaW5lcjtcbiAgICAgIH1cblxuICAgICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcigpKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZXNpemUoKSwgMCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoc3R5bGVzLm5zLCB0aGVtZSwgdGhpcy50eXBlKTtcblxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICByZXNpemUoKSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7XG4gICAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHdpZHRoID0gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgICAgY29uc3QgbWV0aG9kID0gd2lkdGggPiA2MDAgPyAncmVtb3ZlJyA6ICdhZGQnO1xuXG4gICAgICB0aGlzLiRlbC5jbGFzc0xpc3RbbWV0aG9kXSgnc21hbGwnKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheTtcbiIsIlxuZXhwb3J0IGNvbnN0IHRvZ2dsZSA9IGBcbiAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgY2xhc3M9XCJ0b2dnbGUtZWxlbWVudFwiIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiMCAwIDUwIDUwXCIgcHJlc2VydmVBc3BlY3RSYXRpbz1cIm5vbmVcIj5cbiAgICAgIDxnIGNsYXNzPVwieFwiPlxuICAgICAgICA8bGluZSB4MT1cIjhcIiB5MT1cIjhcIiB4Mj1cIjQyXCIgeTI9XCI0MlwiIHN0cm9rZT1cIndoaXRlXCIgLz5cbiAgICAgICAgPGxpbmUgeDE9XCI4XCIgeTE9XCI0MlwiIHgyPVwiNDJcIiB5Mj1cIjhcIiBzdHJva2U9XCJ3aGl0ZVwiIC8+XG4gICAgICA8L2c+XG4gIDwvc3ZnPlxuYDtcblxuZXhwb3J0IGNvbnN0IGFycm93UmlnaHQgPSBgXG4gIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzPVwiYXJyb3ctcmlnaHRcIiB2ZXJzaW9uPVwiMS4xXCIgdmlld0JveD1cIjAgMCA1MCA1MFwiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJub25lXCI+XG4gICAgPGxpbmUgeDE9XCIxMFwiIHkxPVwiMTBcIiB4Mj1cIjQwXCIgeTI9XCIyNVwiIC8+XG4gICAgPGxpbmUgeDE9XCIxMFwiIHkxPVwiNDBcIiB4Mj1cIjQwXCIgeTI9XCIyNVwiIC8+XG4gIDwvc3ZnPlxuYDtcblxuZXhwb3J0IGNvbnN0IGFycm93TGVmdCA9IGBcbiAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgY2xhc3M9XCJhcnJvdy1sZWZ0XCIgdmVyc2lvbj1cIjEuMVwiIHZpZXdCb3g9XCIwIDAgNTAgNTBcIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwibm9uZVwiPlxuICAgIDxsaW5lIHgxPVwiNDBcIiB5MT1cIjEwXCIgeDI9XCIxMFwiIHkyPVwiMjVcIiAvPlxuICAgIDxsaW5lIHgxPVwiNDBcIiB5MT1cIjQwXCIgeDI9XCIxMFwiIHkyPVwiMjVcIiAvPlxuICA8L3N2Zz5cbmA7XG5cbmV4cG9ydCBjb25zdCBzbWFsbEFycm93UmlnaHQgPSBgXG4gIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzPVwic21hbGwtYXJyb3ctcmlnaHRcIiB2aWV3Qm94PVwiMCAwIDUwIDUwXCI+XG4gICAgPHBhdGggZD1cIk0gMjAgMTUgTCAzNSAyNSBMIDIwIDM1IFpcIiAvPlxuICA8L3N2Zz5cbmA7XG5cbmV4cG9ydCBjb25zdCBzbWFsbEFycm93Qm90dG9tID0gYFxuICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBjbGFzcz1cInNtYWxsLWFycm93LWJvdHRvbVwiIHZpZXdCb3g9XCIwIDAgNTAgNTBcIj5cbiAgICA8cGF0aCBkPVwiTSAxNSAxNyBMIDM1IDE3IEwgMjUgMzIgWlwiIC8+XG4gIDwvc3ZnPlxuYDtcblxuXG5cbiIsIm1vZHVsZS5leHBvcnRzID0gXCIgLmJhc2ljLWNvbnRyb2xsZXJzIHsgfSAuYmFzaWMtY29udHJvbGxlcnMgeyB3aWR0aDogMTAwJTsgbWF4LXdpZHRoOiA4MDBweDsgaGVpZ2h0OiAzNHB4OyBwYWRkaW5nOiAzcHg7IG1hcmdpbjogNHB4IDA7IGJhY2tncm91bmQtY29sb3I6ICNlZmVmZWY7IGJvcmRlcjogMXB4IHNvbGlkICNhYWFhYWE7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IGJvcmRlci1yYWRpdXM6IDJweDsgZGlzcGxheTogYmxvY2s7IGNvbG9yOiAjNDY0NjQ2OyAtd2Via2l0LXRvdWNoLWNhbGxvdXQ6IG5vbmU7IC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7IC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTsgLW1vei11c2VyLXNlbGVjdDogbm9uZTsgLW1zLXVzZXItc2VsZWN0OiBub25lOyB1c2VyLXNlbGVjdDogbm9uZTsgfSAuYmFzaWMtY29udHJvbGxlcnMgLmxhYmVsIHsgZm9udDogaXRhbGljIG5vcm1hbCAxLjJlbSBRdWlja3NhbmQsIGFyaWFsLCBzYW5zLXNlcmlmOyBsaW5lLWhlaWdodDogMjZweDsgb3ZlcmZsb3c6IGhpZGRlbjsgdGV4dC1hbGlnbjogcmlnaHQ7IHBhZGRpbmc6IDAgOHB4IDAgMDsgZGlzcGxheTogYmxvY2s7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IHdpZHRoOiAyNCU7IGZsb2F0OiBsZWZ0OyB3aGl0ZS1zcGFjZTogbm93cmFwOyAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lOyAtbW96LXVzZXItc2VsZWN0OiBub25lOyAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7IC1vLXVzZXItc2VsZWN0OiBub25lOyB1c2VyLXNlbGVjdDogbm9uZTsgfSAuYmFzaWMtY29udHJvbGxlcnMgLmlubmVyLXdyYXBwZXIgeyBkaXNwbGF5OiAtd2Via2l0LWlubGluZS1mbGV4OyBkaXNwbGF5OiBpbmxpbmUtZmxleDsgLXdlYmtpdC1mbGV4LXdyYXA6IG5vLXdyYXA7IGZsZXgtd3JhcDogbm8td3JhcDsgd2lkdGg6IDc2JTsgZmxvYXQ6IGxlZnQ7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLnNtYWxsIHsgaGVpZ2h0OiA0OHB4OyB9IC5iYXNpYy1jb250cm9sbGVycy5zbWFsbDpub3QoLmFsaWduLXNtYWxsKSB7IGhlaWdodDogYXV0bzsgfSAuYmFzaWMtY29udHJvbGxlcnMuc21hbGw6bm90KC5hbGlnbi1zbWFsbCkgLmxhYmVsIHsgd2lkdGg6IDEwMCU7IGZsb2F0OiBub25lOyB0ZXh0LWFsaWduOiBsZWZ0OyBsaW5lLWhlaWdodDogNDBweDsgfSAuYmFzaWMtY29udHJvbGxlcnMuc21hbGw6bm90KC5hbGlnbi1zbWFsbCkgLmlubmVyLXdyYXBwZXIgeyB3aWR0aDogMTAwJTsgZmxvYXQ6IG5vbmU7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLnNtYWxsLmFsaWduLXNtYWxsIC5sYWJlbCB7IGRpc3BsYXk6IGJsb2NrOyBtYXJnaW4tcmlnaHQ6IDIwcHg7IHRleHQtYWxpZ246IGxlZnQ7IGxpbmUtaGVpZ2h0OiA0MHB4OyB9IC5iYXNpYy1jb250cm9sbGVycy5zbWFsbC5hbGlnbi1zbWFsbCAuaW5uZXItd3JhcHBlciB7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgd2lkdGg6IGF1dG87IH0gLmJhc2ljLWNvbnRyb2xsZXJzIC5hcnJvdy1yaWdodCwgLmJhc2ljLWNvbnRyb2xsZXJzIC5hcnJvdy1sZWZ0IHsgYm9yZGVyLXJhZGl1czogMnB4OyB3aWR0aDogMTRweDsgaGVpZ2h0OiAyNnB4OyBjdXJzb3I6IHBvaW50ZXI7IGJhY2tncm91bmQtY29sb3I6ICM0NjQ2NDY7IH0gLmJhc2ljLWNvbnRyb2xsZXJzIC5hcnJvdy1yaWdodCBsaW5lLCAuYmFzaWMtY29udHJvbGxlcnMgLmFycm93LWxlZnQgbGluZSB7IHN0cm9rZS13aWR0aDogM3B4OyBzdHJva2U6ICNmZmZmZmY7IH0gLmJhc2ljLWNvbnRyb2xsZXJzIC5hcnJvdy1yaWdodDpob3ZlciwgLmJhc2ljLWNvbnRyb2xsZXJzIC5hcnJvdy1sZWZ0OmhvdmVyIHsgYmFja2dyb3VuZC1jb2xvcjogIzY4Njg2ODsgfSAuYmFzaWMtY29udHJvbGxlcnMgLmFycm93LXJpZ2h0OmFjdGl2ZSwgLmJhc2ljLWNvbnRyb2xsZXJzIC5hcnJvdy1sZWZ0OmFjdGl2ZSB7IGJhY2tncm91bmQtY29sb3I6ICM5MDkwOTA7IH0gLmJhc2ljLWNvbnRyb2xsZXJzIC5zbWFsbC1hcnJvdy1yaWdodCwgLmJhc2ljLWNvbnRyb2xsZXJzIC5zbWFsbC1hcnJvdy1ib3R0b20geyB3aWR0aDogMjZweDsgaGVpZ2h0OiAyNnB4OyBjdXJzb3I6IHBvaW50ZXI7IH0gLmJhc2ljLWNvbnRyb2xsZXJzIC5zbWFsbC1hcnJvdy1yaWdodCBwYXRoLCAuYmFzaWMtY29udHJvbGxlcnMgLnNtYWxsLWFycm93LWJvdHRvbSBwYXRoIHsgZmlsbDogIzkwOTA5MDsgfSAuYmFzaWMtY29udHJvbGxlcnMgLnNtYWxsLWFycm93LXJpZ2h0OmhvdmVyIHBhdGgsIC5iYXNpYy1jb250cm9sbGVycyAuc21hbGwtYXJyb3ctYm90dG9tOmhvdmVyIHBhdGggeyBmaWxsOiAjNjg2ODY4OyB9IC5iYXNpYy1jb250cm9sbGVycyAudG9nZ2xlLWVsZW1lbnQgeyB3aWR0aDogMjZweDsgaGVpZ2h0OiAyNnB4OyBib3JkZXItcmFkaXVzOiAycHg7IGJhY2tncm91bmQtY29sb3I6ICM0NjQ2NDY7IGN1cnNvcjogcG9pbnRlcjsgfSAuYmFzaWMtY29udHJvbGxlcnMgLnRvZ2dsZS1lbGVtZW50OmhvdmVyIHsgYmFja2dyb3VuZC1jb2xvcjogIzY4Njg2ODsgfSAuYmFzaWMtY29udHJvbGxlcnMgLnRvZ2dsZS1lbGVtZW50IGxpbmUgeyBzdHJva2Utd2lkdGg6IDNweDsgfSAuYmFzaWMtY29udHJvbGxlcnMgLnRvZ2dsZS1lbGVtZW50IC54IHsgZGlzcGxheTogbm9uZTsgfSAuYmFzaWMtY29udHJvbGxlcnMgLnRvZ2dsZS1lbGVtZW50LmFjdGl2ZSAueCB7IGRpc3BsYXk6IGJsb2NrOyB9IC5iYXNpYy1jb250cm9sbGVycyAuYnRuIHsgZGlzcGxheTogYmxvY2s7IHRleHQtYWxpZ246IGNlbnRlcjsgZm9udDogbm9ybWFsIG5vcm1hbCAxMnB4IGFyaWFsOyB0ZXh0LWRlY29yYXRpb246IG5vbmU7IGhlaWdodDogMjZweDsgbGluZS1oZWlnaHQ6IDI2cHg7IGJhY2tncm91bmQtY29sb3I6ICM0NjQ2NDY7IGJvcmRlcjogbm9uZTsgY29sb3I6ICNmZmZmZmY7IG1hcmdpbjogMCA0cHggMCAwOyBwYWRkaW5nOiAwOyBib3gtc2l6aW5nOiBib3JkZXItYm94OyBib3JkZXItcmFkaXVzOiAycHg7IGN1cnNvcjogcG9pbnRlcjsgLXdlYmtpdC1mbGV4LWdyb3c6IDE7IGZsZXgtZ3JvdzogMTsgfSAuYmFzaWMtY29udHJvbGxlcnMgLmJ0bjpsYXN0LWNoaWxkIHsgbWFyZ2luOiAwOyB9IC5iYXNpYy1jb250cm9sbGVycyAuYnRuOmhvdmVyIHsgYmFja2dyb3VuZC1jb2xvcjogIzY4Njg2ODsgfSAuYmFzaWMtY29udHJvbGxlcnMgLmJ0bjphY3RpdmUsIC5iYXNpYy1jb250cm9sbGVycyAuYnRuLmFjdGl2ZSB7IGJhY2tncm91bmQtY29sb3I6ICM5MDkwOTA7IH0gLmJhc2ljLWNvbnRyb2xsZXJzIC5idG46Zm9jdXMgeyBvdXRsaW5lOiBub25lOyB9IC5iYXNpYy1jb250cm9sbGVycyAubnVtYmVyIHsgaGVpZ2h0OiAyNnB4OyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHBvc2l0aW9uOiByZWxhdGl2ZTsgZm9udDogbm9ybWFsIG5vcm1hbCAxLjJlbSBRdWlja3NhbmQsIGFyaWFsLCBzYW5zLXNlcmlmOyB2ZXJ0aWNhbC1hbGlnbjogdG9wOyBib3JkZXI6IG5vbmU7IGJhY2tncm91bmQ6IG5vbmU7IGNvbG9yOiAjNDY0NjQ2OyBwYWRkaW5nOiAwIDRweDsgbWFyZ2luOiAwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjZjlmOWY5OyBib3JkZXItcmFkaXVzOiAycHg7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IH0gLmJhc2ljLWNvbnRyb2xsZXJzIC5udW1iZXI6Zm9jdXMgeyBvdXRsaW5lOiBub25lOyB9IC5iYXNpYy1jb250cm9sbGVycyBzZWxlY3QgeyBoZWlnaHQ6IDI2cHg7IGxpbmUtaGVpZ2h0OiAyNnB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAjZjlmOWY5OyBib3JkZXItcmFkaXVzOiAycHg7IGJvcmRlcjogbm9uZTsgdmVydGljYWwtYWxpZ246IHRvcDsgcGFkZGluZzogMDsgbWFyZ2luOiAwOyB9IC5iYXNpYy1jb250cm9sbGVycyBzZWxlY3Q6Zm9jdXMgeyBvdXRsaW5lOiBub25lOyB9IC5iYXNpYy1jb250cm9sbGVycyBpbnB1dFt0eXBlPXRleHRdIHsgd2lkdGg6IDEwMCU7IGhlaWdodDogMjZweDsgbGluZS1oZWlnaHQ6IDI2cHg7IGJvcmRlcjogMDsgcGFkZGluZzogMCA0cHg7IGJhY2tncm91bmQtY29sb3I6ICNmOWY5Zjk7IGJvcmRlci1yYWRpdXM6IDJweDsgY29sb3I6ICM1NjU2NTY7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLnNtYWxsIC5hcnJvdy1yaWdodCwgLmJhc2ljLWNvbnRyb2xsZXJzLnNtYWxsIC5hcnJvdy1sZWZ0IHsgd2lkdGg6IDI0cHg7IGhlaWdodDogNDBweDsgfSAuYmFzaWMtY29udHJvbGxlcnMuc21hbGwgLnRvZ2dsZS1lbGVtZW50IHsgd2lkdGg6IDQwcHg7IGhlaWdodDogNDBweDsgfSAuYmFzaWMtY29udHJvbGxlcnMuc21hbGwgLmJ0biB7IGhlaWdodDogNDBweDsgbGluZS1oZWlnaHQ6IDQwcHg7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLnNtYWxsIC5udW1iZXIgeyBoZWlnaHQ6IDQwcHg7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLnNtYWxsIHNlbGVjdCB7IGhlaWdodDogNDBweDsgbGluZS1oZWlnaHQ6IDQwcHg7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLnNtYWxsIGlucHV0W3R5cGU9dGV4dF0geyBoZWlnaHQ6IDQwcHg7IGxpbmUtaGVpZ2h0OiA0MHB4OyB9IC5iYXNpYy1jb250cm9sbGVycy50aXRsZSB7IGJvcmRlcjogbm9uZSAhaW1wb3J0YW50OyBtYXJnaW4tYm90dG9tOiAwOyBtYXJnaW4tdG9wOiA4cHg7IHBhZGRpbmctdG9wOiA4cHg7IHBhZGRpbmctYm90dG9tOiAwOyBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50OyBoZWlnaHQ6IDI1cHg7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLnRpdGxlIC5sYWJlbCB7IGZvbnQ6IG5vcm1hbCBib2xkIDEuM2VtIFF1aWNrc2FuZCwgYXJpYWwsIHNhbnMtc2VyaWY7IGhlaWdodDogMTAwJTsgb3ZlcmZsb3c6IGhpZGRlbjsgdGV4dC1hbGlnbjogbGVmdDsgcGFkZGluZzogMDsgd2lkdGg6IDEwMCU7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC13ZWJraXQtZmxleC1ncm93OiAxOyBmbGV4LWdyb3c6IDE7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmdyb3VwIHsgaGVpZ2h0OiBhdXRvOyBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTsgfSAuYmFzaWMtY29udHJvbGxlcnMuZ3JvdXAgLmdyb3VwLWhlYWRlciAubGFiZWwgeyBmb250OiBub3JtYWwgYm9sZCAxLjNlbSBRdWlja3NhbmQsIGFyaWFsLCBzYW5zLXNlcmlmOyBoZWlnaHQ6IDI2cHg7IGxpbmUtaGVpZ2h0OiAyNnB4OyBvdmVyZmxvdzogaGlkZGVuOyB0ZXh0LWFsaWduOiBsZWZ0OyBwYWRkaW5nOiAwIDAgMCAzNnB4OyB3aWR0aDogMTAwJTsgYm94LXNpemluZzogYm9yZGVyLWJveDsgLXdlYmtpdC1mbGV4LWdyb3c6IDE7IGZsZXgtZ3JvdzogMTsgZmxvYXQ6IG5vbmU7IGN1cnNvcjogcG9pbnRlcjsgfSAuYmFzaWMtY29udHJvbGxlcnMuZ3JvdXAgLmdyb3VwLWhlYWRlciAuc21hbGwtYXJyb3ctcmlnaHQgeyB3aWR0aDogMjZweDsgaGVpZ2h0OiAyNnB4OyBwb3NpdGlvbjogYWJzb2x1dGU7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmdyb3VwIC5ncm91cC1oZWFkZXIgLnNtYWxsLWFycm93LWJvdHRvbSB7IHdpZHRoOiAyNnB4OyBoZWlnaHQ6IDI2cHg7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgfSAuYmFzaWMtY29udHJvbGxlcnMuZ3JvdXAgLmdyb3VwLWNvbnRlbnQgeyBvdmVyZmxvdzogaGlkZGVuOyB9IC5iYXNpYy1jb250cm9sbGVycy5ncm91cCAuZ3JvdXAtY29udGVudCA+IGRpdiB7IG1hcmdpbjogNHB4IGF1dG87IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmdyb3VwIC5ncm91cC1jb250ZW50ID4gZGl2Omxhc3QtY2hpbGQgeyBtYXJnaW4tYm90dG9tOiAwOyB9IC5iYXNpYy1jb250cm9sbGVycy5ncm91cC5vcGVuZWQgLmdyb3VwLWhlYWRlciAuc21hbGwtYXJyb3ctcmlnaHQgeyBkaXNwbGF5OiBub25lOyB9IC5iYXNpYy1jb250cm9sbGVycy5ncm91cC5vcGVuZWQgLmdyb3VwLWhlYWRlciAuc21hbGwtYXJyb3ctYm90dG9tIHsgZGlzcGxheTogYmxvY2s7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmdyb3VwLm9wZW5lZCAuZ3JvdXAtY29udGVudCB7IGRpc3BsYXk6IGJsb2NrOyB9IC5iYXNpYy1jb250cm9sbGVycy5ncm91cC5jbG9zZWQgLmdyb3VwLWhlYWRlciAuc21hbGwtYXJyb3ctcmlnaHQgeyBkaXNwbGF5OiBibG9jazsgfSAuYmFzaWMtY29udHJvbGxlcnMuZ3JvdXAuY2xvc2VkIC5ncm91cC1oZWFkZXIgLnNtYWxsLWFycm93LWJvdHRvbSB7IGRpc3BsYXk6IG5vbmU7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmdyb3VwLmNsb3NlZCAuZ3JvdXAtY29udGVudCB7IGRpc3BsYXk6IG5vbmU7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLnNsaWRlciAucmFuZ2UgeyBoZWlnaHQ6IDI2cHg7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgbWFyZ2luOiAwOyAtd2Via2l0LWZsZXgtZ3JvdzogNDsgZmxleC1ncm93OiA0OyBwb3NpdGlvbjogcmVsYXRpdmU7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLnNsaWRlciAucmFuZ2UgY2FudmFzIHsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLnNsaWRlciAubnVtYmVyLXdyYXBwZXIgeyBkaXNwbGF5OiBpbmxpbmU7IGhlaWdodDogMjZweDsgdGV4dC1hbGlnbjogcmlnaHQ7IC13ZWJraXQtZmxleC1ncm93OiAzOyBmbGV4LWdyb3c6IDM7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLnNsaWRlciAubnVtYmVyLXdyYXBwZXIgLm51bWJlciB7IGxlZnQ6IDVweDsgd2lkdGg6IDU0cHg7IHRleHQtYWxpZ246IHJpZ2h0OyB9IC5iYXNpYy1jb250cm9sbGVycy5zbGlkZXIgLm51bWJlci13cmFwcGVyIC51bml0IHsgZm9udDogaXRhbGljIG5vcm1hbCAxZW0gUXVpY2tzYW5kLCBhcmlhbCwgc2Fucy1zZXJpZjsgbGluZS1oZWlnaHQ6IDI2cHg7IGhlaWdodDogMjZweDsgd2lkdGg6IDMwcHg7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgcG9zaXRpb246IHJlbGF0aXZlOyBwYWRkaW5nLWxlZnQ6IDVweDsgcGFkZGluZy1yaWdodDogNXB4OyBjb2xvcjogIzU2NTY1NjsgfSAuYmFzaWMtY29udHJvbGxlcnMuc2xpZGVyIC5udW1iZXItd3JhcHBlciAudW5pdCBzdXAgeyBsaW5lLWhlaWdodDogN3B4OyB9IC5iYXNpYy1jb250cm9sbGVycy5zbGlkZXIuc2xpZGVyLWxhcmdlIC5yYW5nZSB7IC13ZWJraXQtZmxleC1ncm93OiA1MDsgZmxleC1ncm93OiA1MDsgfSAuYmFzaWMtY29udHJvbGxlcnMuc2xpZGVyLnNsaWRlci1sYXJnZSAubnVtYmVyLXdyYXBwZXIgeyAtd2Via2l0LWZsZXgtZ3JvdzogMTsgZmxleC1ncm93OiAxOyB9IC5iYXNpYy1jb250cm9sbGVycy5zbGlkZXIuc2xpZGVyLXNtYWxsIC5yYW5nZSB7IC13ZWJraXQtZmxleC1ncm93OiAyOyBmbGV4LWdyb3c6IDI7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLnNsaWRlci5zbGlkZXItc21hbGwgLm51bWJlci13cmFwcGVyIHsgLXdlYmtpdC1mbGV4LWdyb3c6IDQ7IGZsZXgtZ3JvdzogNDsgfSAuYmFzaWMtY29udHJvbGxlcnMuc21hbGwuc2xpZGVyIC5yYW5nZSB7IGhlaWdodDogNDBweDsgfSAuYmFzaWMtY29udHJvbGxlcnMuc21hbGwuc2xpZGVyIC5udW1iZXItd3JhcHBlciB7IGhlaWdodDogNDBweDsgfSAuYmFzaWMtY29udHJvbGxlcnMuc21hbGwuc2xpZGVyIC5udW1iZXItd3JhcHBlciAudW5pdCB7IGxpbmUtaGVpZ2h0OiA0MHB4OyBoZWlnaHQ6IDQwcHg7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLm51bWJlci1ib3ggLm51bWJlciB7IHdpZHRoOiAxMjBweDsgbWFyZ2luOiAwIDEwcHg7IHZlcnRpY2FsLWFsaWduOiB0b3A7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLnNlbGVjdC1saXN0IHNlbGVjdCB7IG1hcmdpbjogMCAxMHB4OyB3aWR0aDogMTIwcHg7IGZvbnQ6IG5vcm1hbCBub3JtYWwgMS4yZW0gUXVpY2tzYW5kLCBhcmlhbCwgc2Fucy1zZXJpZjsgY29sb3I6ICM0NjQ2NDY7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLnNlbGVjdC1idXR0b25zIC5idG46Zmlyc3Qtb2YtdHlwZSB7IG1hcmdpbi1sZWZ0OiA0cHg7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLnRleHQgaW5wdXRbdHlwZT10ZXh0XSB7IGZvbnQ6IG5vcm1hbCBub3JtYWwgMS4yZW0gUXVpY2tzYW5kLCBhcmlhbCwgc2Fucy1zZXJpZjsgY29sb3I6ICM0NjQ2NDY7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmRyYWctYW5kLWRyb3AgeyB3aWR0aDogMTAwJTsgdGV4dC1hbGlnbjogY2VudGVyOyBmb250LXdlaWdodDogYm9sZDsgaGVpZ2h0OiAxMDBweDsgfSAuYmFzaWMtY29udHJvbGxlcnMuZHJhZy1hbmQtZHJvcCAuZHJvcC16b25lIHsgYm9yZGVyOiAxcHggZG90dGVkICNjNGM0YzQ7IGJvcmRlci1yYWRpdXM6IDJweDsgdHJhbnNpdGlvbjogYmFja2dyb3VuZCAyMDBtczsgaGVpZ2h0OiA5MHB4OyB9IC5iYXNpYy1jb250cm9sbGVycy5kcmFnLWFuZC1kcm9wIC5kcm9wLXpvbmUuZHJhZyB7IGJhY2tncm91bmQtY29sb3I6ICNjNGM0YzQ7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmRyYWctYW5kLWRyb3AgLmxhYmVsIHsgZGlzcGxheTogYmxvY2s7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDkwcHg7IGxpbmUtaGVpZ2h0OiA5MHB4OyBtYXJnaW46IDA7IHBhZGRpbmc6IDA7IHRleHQtYWxpZ246IGNlbnRlcjsgfSAuYmFzaWMtY29udHJvbGxlcnMuZHJhZy1hbmQtZHJvcC5wcm9jZXNzIC5sYWJlbCB7IGRpc3BsYXk6IG5vbmU7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLnNtYWxsLmRyYWctYW5kLWRyb3AgeyBoZWlnaHQ6IDEyMHB4OyB9IC5iYXNpYy1jb250cm9sbGVycy5zbWFsbC5kcmFnLWFuZC1kcm9wIC5kcm9wLXpvbmUgeyBoZWlnaHQ6IDExMHB4OyB9IC5iYXNpYy1jb250cm9sbGVycy5zbWFsbC5kcmFnLWFuZC1kcm9wIC5sYWJlbCB7IGRpc3BsYXk6IGJsb2NrOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMTBweDsgbGluZS1oZWlnaHQ6IDExMHB4OyBtYXJnaW46IDA7IHBhZGRpbmc6IDA7IHRleHQtYWxpZ246IGNlbnRlcjsgfSAuYmFzaWMtY29udHJvbGxlcnMuZ3JleSB7IGJhY2tncm91bmQtY29sb3I6ICMzNjM2MzY7IGJvcmRlcjogMXB4IHNvbGlkICM1ODU4NTg7IGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOTUpOyB9IC5iYXNpYy1jb250cm9sbGVycy5ncmV5IC50b2dnbGUtZWxlbWVudCB7IGJhY2tncm91bmQtY29sb3I6ICNlZmVmZWY7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmdyZXkgLnRvZ2dsZS1lbGVtZW50IGxpbmUgeyBzdHJva2U6ICMzNjM2MzY7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmdyZXkgLnRvZ2dsZS1lbGVtZW50OmhvdmVyIHsgYmFja2dyb3VuZC1jb2xvcjogI2NkY2RjZDsgfSAuYmFzaWMtY29udHJvbGxlcnMuZ3JleSAuYXJyb3ctcmlnaHQsIC5iYXNpYy1jb250cm9sbGVycy5ncmV5IC5hcnJvdy1sZWZ0IHsgYmFja2dyb3VuZC1jb2xvcjogI2VmZWZlZjsgfSAuYmFzaWMtY29udHJvbGxlcnMuZ3JleSAuYXJyb3ctcmlnaHQgbGluZSwgLmJhc2ljLWNvbnRyb2xsZXJzLmdyZXkgLmFycm93LWxlZnQgbGluZSB7IHN0cm9rZTogIzM2MzYzNjsgfSAuYmFzaWMtY29udHJvbGxlcnMuZ3JleSAuYXJyb3ctcmlnaHQ6aG92ZXIsIC5iYXNpYy1jb250cm9sbGVycy5ncmV5IC5hcnJvdy1sZWZ0OmhvdmVyIHsgYmFja2dyb3VuZC1jb2xvcjogI2NkY2RjZDsgfSAuYmFzaWMtY29udHJvbGxlcnMuZ3JleSAuYXJyb3ctcmlnaHQ6YWN0aXZlLCAuYmFzaWMtY29udHJvbGxlcnMuZ3JleSAuYXJyb3ctbGVmdDphY3RpdmUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjYWJhYmFiOyB9IC5iYXNpYy1jb250cm9sbGVycy5ncmV5IC5zbWFsbC1hcnJvdy1yaWdodCBwYXRoLCAuYmFzaWMtY29udHJvbGxlcnMuZ3JleSAuc21hbGwtYXJyb3ctYm90dG9tIHBhdGggeyBmaWxsOiAjYWJhYmFiOyB9IC5iYXNpYy1jb250cm9sbGVycy5ncmV5IC5zbWFsbC1hcnJvdy1yaWdodDpob3ZlciBwYXRoLCAuYmFzaWMtY29udHJvbGxlcnMuZ3JleSAuc21hbGwtYXJyb3ctYm90dG9tOmhvdmVyIHBhdGggeyBmaWxsOiAjY2RjZGNkOyB9IC5iYXNpYy1jb250cm9sbGVycy5ncmV5IC5udW1iZXIsIC5iYXNpYy1jb250cm9sbGVycy5ncmV5IHNlbGVjdCwgLmJhc2ljLWNvbnRyb2xsZXJzLmdyZXkgaW5wdXRbdHlwZT10ZXh0XSB7IGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOTUpOyBiYWNrZ3JvdW5kLWNvbG9yOiAjNDU0NTQ1OyB9IC5iYXNpYy1jb250cm9sbGVycy5ncmV5IC5idG4geyBiYWNrZ3JvdW5kLWNvbG9yOiAjZWZlZmVmOyBjb2xvcjogIzM2MzYzNjsgfSAuYmFzaWMtY29udHJvbGxlcnMuZ3JleSAuYnRuOmhvdmVyIHsgYmFja2dyb3VuZC1jb2xvcjogI2NkY2RjZDsgfSAuYmFzaWMtY29udHJvbGxlcnMuZ3JleSAuYnRuOmFjdGl2ZSwgLmJhc2ljLWNvbnRyb2xsZXJzLmdyZXkgLmJ0bi5hY3RpdmUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjYWJhYmFiOyB9IC5iYXNpYy1jb250cm9sbGVycy5ncmV5LnNsaWRlciAuaW5uZXItd3JhcHBlciAubnVtYmVyLXdyYXBwZXIgLnVuaXQgeyBjb2xvcjogI2JjYmNiYzsgfSAuYmFzaWMtY29udHJvbGxlcnMuZ3JleS5ncm91cCB7IGJhY2tncm91bmQtY29sb3I6ICM1MDUwNTA7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmdyZXkuZHJhZy1hbmQtZHJvcCAuZHJvcC16b25lIHsgYm9yZGVyOiAxcHggZG90dGVkICM3MjcyNzI7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmdyZXkuZHJhZy1hbmQtZHJvcCAuZHJvcC16b25lLmRyYWcgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjNzI3MjcyOyB9IC5iYXNpYy1jb250cm9sbGVycy5kYXJrIHsgYmFja2dyb3VuZC1jb2xvcjogIzI0MjQyNDsgYm9yZGVyOiAxcHggc29saWQgIzI4MjgyODsgY29sb3I6ICNmZmZmZmY7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmRhcmsgLnRvZ2dsZS1lbGVtZW50IHsgYmFja2dyb3VuZC1jb2xvcjogIzQ2NDY0NjsgfSAuYmFzaWMtY29udHJvbGxlcnMuZGFyayAudG9nZ2xlLWVsZW1lbnQgbGluZSB7IHN0cm9rZTogI2ZmZmZmZjsgfSAuYmFzaWMtY29udHJvbGxlcnMuZGFyayAudG9nZ2xlLWVsZW1lbnQ6aG92ZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjNjg2ODY4OyB9IC5iYXNpYy1jb250cm9sbGVycy5kYXJrIC5hcnJvdy1yaWdodCwgLmJhc2ljLWNvbnRyb2xsZXJzLmRhcmsgLmFycm93LWxlZnQgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjNDY0NjQ2OyB9IC5iYXNpYy1jb250cm9sbGVycy5kYXJrIC5hcnJvdy1yaWdodCBsaW5lLCAuYmFzaWMtY29udHJvbGxlcnMuZGFyayAuYXJyb3ctbGVmdCBsaW5lIHsgc3Ryb2tlOiAjZmZmZmZmOyB9IC5iYXNpYy1jb250cm9sbGVycy5kYXJrIC5hcnJvdy1yaWdodDpob3ZlciwgLmJhc2ljLWNvbnRyb2xsZXJzLmRhcmsgLmFycm93LWxlZnQ6aG92ZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjNjg2ODY4OyB9IC5iYXNpYy1jb250cm9sbGVycy5kYXJrIC5hcnJvdy1yaWdodDphY3RpdmUsIC5iYXNpYy1jb250cm9sbGVycy5kYXJrIC5hcnJvdy1sZWZ0OmFjdGl2ZSB7IGJhY2tncm91bmQtY29sb3I6ICM5MDkwOTA7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmRhcmsgLnNtYWxsLWFycm93LXJpZ2h0IHBhdGgsIC5iYXNpYy1jb250cm9sbGVycy5kYXJrIC5zbWFsbC1hcnJvdy1ib3R0b20gcGF0aCB7IGZpbGw6ICM5MDkwOTA7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmRhcmsgLnNtYWxsLWFycm93LXJpZ2h0OmhvdmVyIHBhdGgsIC5iYXNpYy1jb250cm9sbGVycy5kYXJrIC5zbWFsbC1hcnJvdy1ib3R0b206aG92ZXIgcGF0aCB7IGZpbGw6ICM2ODY4Njg7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmRhcmsgLm51bWJlciwgLmJhc2ljLWNvbnRyb2xsZXJzLmRhcmsgc2VsZWN0LCAuYmFzaWMtY29udHJvbGxlcnMuZGFyayBpbnB1dFt0eXBlPXRleHRdIHsgY29sb3I6ICNmZmZmZmY7IGJhY2tncm91bmQtY29sb3I6ICMzMzMzMzM7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmRhcmsgLmJ0biB7IGJhY2tncm91bmQtY29sb3I6ICM0NjQ2NDY7IGNvbG9yOiAjZmZmZmZmOyB9IC5iYXNpYy1jb250cm9sbGVycy5kYXJrIC5idG46aG92ZXIgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjNjg2ODY4OyB9IC5iYXNpYy1jb250cm9sbGVycy5kYXJrIC5idG46YWN0aXZlLCAuYmFzaWMtY29udHJvbGxlcnMuZGFyayAuYnRuLmFjdGl2ZSB7IGJhY2tncm91bmQtY29sb3I6ICM5MDkwOTA7IH0gLmJhc2ljLWNvbnRyb2xsZXJzLmRhcmsuc2xpZGVyIC5pbm5lci13cmFwcGVyIC5udW1iZXItd3JhcHBlciAudW5pdCB7IGNvbG9yOiAjY2RjZGNkOyB9IC5iYXNpYy1jb250cm9sbGVycy5kYXJrLmdyb3VwIHsgYmFja2dyb3VuZC1jb2xvcjogIzNlM2UzZTsgfSAuYmFzaWMtY29udHJvbGxlcnMuZGFyay5kcmFnLWFuZC1kcm9wIC5kcm9wLXpvbmUgeyBib3JkZXI6IDFweCBkb3R0ZWQgIzQyNDI0MjsgfSAuYmFzaWMtY29udHJvbGxlcnMuZGFyay5kcmFnLWFuZC1kcm9wIC5kcm9wLXpvbmUuZHJhZyB7IGJhY2tncm91bmQtY29sb3I6ICM0MjQyNDI7IH0gXCI7IiwiaW1wb3J0IHsgbmFtZSB9IGZyb20gJy4uLy4uL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vc3R5bGVzLWRlY2xhcmF0aW9ucy5qcyc7XG5cbmV4cG9ydCBjb25zdCBucyA9IG5hbWUucmVwbGFjZSgnQGlyY2FtLycsICcnKTtcblxuY29uc3QgbnNDbGFzcyA9IGAuJHtuc31gO1xubGV0IF9kaXNhYmxlZCA9IGZhbHNlO1xuXG5leHBvcnQgZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgX2Rpc2FibGVkID0gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluc2VydFN0eWxlU2hlZXQoKSB7XG4gIGlmIChfZGlzYWJsZWQpIHJldHVybjtcblxuICBjb25zdCAkY3NzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgJGNzcy5zZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZXNwYWNlJywgbnMpO1xuICAkY3NzLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gIGlmICgkY3NzLnN0eWxlU2hlZXQpXG4gICAgJGNzcy5zdHlsZVNoZWV0LmNzc1RleHQgPSBzdHlsZXM7XG4gIGVsc2VcbiAgICAkY3NzLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHN0eWxlcykpO1xuXG4gIC8vIGluc2VydCBiZWZvcmUgbGluayBvciBzdHlsZXMgaWYgZXhpc3RzXG4gIGNvbnN0ICRsaW5rID0gZG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKCdsaW5rJyk7XG4gIGNvbnN0ICRzdHlsZSA9IGRvY3VtZW50LmhlYWQucXVlcnlTZWxlY3Rvcignc3R5bGUnKTtcblxuICBpZiAoJGxpbmspXG4gICAgZG9jdW1lbnQuaGVhZC5pbnNlcnRCZWZvcmUoJGNzcywgJGxpbmspO1xuICBlbHNlIGlmICgkc3R5bGUpXG4gICAgZG9jdW1lbnQuaGVhZC5pbnNlcnRCZWZvcmUoJGNzcywgJHN0eWxlKTtcbiAgZWxzZVxuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoJGNzcyk7XG59XG5cbiIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJfZnJvbVwiOiBcIkBpcmNhbS9iYXNpYy1jb250cm9sbGVyc1wiLFxuICBcIl9pZFwiOiBcIkBpcmNhbS9iYXNpYy1jb250cm9sbGVyc0AxLjAuNFwiLFxuICBcIl9pbkJ1bmRsZVwiOiBmYWxzZSxcbiAgXCJfaW50ZWdyaXR5XCI6IFwic2hhNTEyLTNjU0F0eGZwWHRnMWEzaHZ5VkpONWdObWZxd2Y1bVNieHV4cTJnOUk2L3JvVXN3dHhPZ0d3WXdXVjE4VUpGV1I3NU1xb3Q1U1NWdmJMZFBQZ3Yxbm9BPT1cIixcbiAgXCJfbG9jYXRpb25cIjogXCIvQGlyY2FtL2Jhc2ljLWNvbnRyb2xsZXJzXCIsXG4gIFwiX3BoYW50b21DaGlsZHJlblwiOiB7fSxcbiAgXCJfcmVxdWVzdGVkXCI6IHtcbiAgICBcInR5cGVcIjogXCJ0YWdcIixcbiAgICBcInJlZ2lzdHJ5XCI6IHRydWUsXG4gICAgXCJyYXdcIjogXCJAaXJjYW0vYmFzaWMtY29udHJvbGxlcnNcIixcbiAgICBcIm5hbWVcIjogXCJAaXJjYW0vYmFzaWMtY29udHJvbGxlcnNcIixcbiAgICBcImVzY2FwZWROYW1lXCI6IFwiQGlyY2FtJTJmYmFzaWMtY29udHJvbGxlcnNcIixcbiAgICBcInNjb3BlXCI6IFwiQGlyY2FtXCIsXG4gICAgXCJyYXdTcGVjXCI6IFwiXCIsXG4gICAgXCJzYXZlU3BlY1wiOiBudWxsLFxuICAgIFwiZmV0Y2hTcGVjXCI6IFwibGF0ZXN0XCJcbiAgfSxcbiAgXCJfcmVxdWlyZWRCeVwiOiBbXG4gICAgXCIjVVNFUlwiLFxuICAgIFwiL1wiXG4gIF0sXG4gIFwiX3Jlc29sdmVkXCI6IFwiaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvQGlyY2FtL2Jhc2ljLWNvbnRyb2xsZXJzLy0vYmFzaWMtY29udHJvbGxlcnMtMS4wLjQudGd6XCIsXG4gIFwiX3NoYXN1bVwiOiBcIjJlMjE1MmM2MThiYWU5NDYxMjZiOGViZjQxYmFlYjk1Y2IzYzQwZjhcIixcbiAgXCJfc3BlY1wiOiBcIkBpcmNhbS9iYXNpYy1jb250cm9sbGVyc1wiLFxuICBcIl93aGVyZVwiOiBcIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvanMvd2F2ZXNqcy9saWIvd2F2ZXMtbWFzdGVycy9leGFtcGxlcy90cmFuc3BvcnRcIixcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9pcmNhbS1qc3Rvb2xzL2Jhc2ljLWNvbnRyb2xsZXJzL2lzc3Vlc1wiXG4gIH0sXG4gIFwiYnVuZGxlRGVwZW5kZW5jaWVzXCI6IGZhbHNlLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAaXJjYW0vZ3VpLWNvbXBvbmVudHNcIjogXCJeMS4wLjNcIlxuICB9LFxuICBcImRlcHJlY2F0ZWRcIjogZmFsc2UsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJTZXQgb2Ygc2ltcGxlIGNvbnRyb2xsZXJzIGZvciByYXBpZCBwcm90b3R5cGluZ1wiLFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJiYWJlbC1jb3JlXCI6IFwiXjYuMjYuMFwiLFxuICAgIFwiYmFiZWwtcGx1Z2luLXRyYW5zZm9ybS1lczIwMTUtbW9kdWxlcy1jb21tb25qc1wiOiBcIl42LjI2LjBcIixcbiAgICBcImJhYmVsLXByZXNldC1lbnZcIjogXCJeMS42LjFcIixcbiAgICBcImJyb3dzZXJpZnlcIjogXCJeMTQuNS4wXCIsXG4gICAgXCJjaGFsa1wiOiBcIl4yLjMuMFwiLFxuICAgIFwiZnMtZXh0cmFcIjogXCJeNC4wLjNcIixcbiAgICBcImpzZG9jLXRvLW1hcmtkb3duXCI6IFwiXjMuMC4wXCIsXG4gICAgXCJrbGF3XCI6IFwiXjIuMS4xXCIsXG4gICAgXCJub2RlLXNhc3NcIjogXCJeNC43LjJcIixcbiAgICBcIm5wXCI6IFwiXjIuMTguMlwiLFxuICAgIFwidGFwZVwiOiBcIl40LjguMFwiLFxuICAgIFwidWdsaWZ5LWpzXCI6IFwiXjMuMi4yXCIsXG4gICAgXCJ3YXRjaFwiOiBcIl4xLjAuMlwiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vaXJjYW0tanN0b29scy9iYXNpYy1jb250cm9sbGVycyNyZWFkbWVcIixcbiAgXCJsaWNlbnNlXCI6IFwiQlNELTMtQ2xhdXNlXCIsXG4gIFwibWFpblwiOiBcImRpc3QvaW5kZXguanNcIixcbiAgXCJuYW1lXCI6IFwiQGlyY2FtL2Jhc2ljLWNvbnRyb2xsZXJzXCIsXG4gIFwicHVibGlzaENvbmZpZ1wiOiB7XG4gICAgXCJhY2Nlc3NcIjogXCJwdWJsaWNcIlxuICB9LFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS9pcmNhbS1qc3Rvb2xzL2Jhc2ljLWNvbnRyb2xsZXJzLmdpdFwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJidW5kbGVcIjogXCJub2RlIC4vYmluL3J1bm5lciAtLWJ1bmRsZVwiLFxuICAgIFwiZGVwbG95XCI6IFwibnAgLS15b2xvXCIsXG4gICAgXCJkb2NcIjogXCJqc2RvYzJtZCAtdCB0bXBsL1JFQURNRS5oYnMgc3JjLyoqLyouanMgPiBSRUFETUUubWRcIixcbiAgICBcInByZXdhdGNoXCI6IFwibnBtIHJ1biB0cmFuc3BpbGVcIixcbiAgICBcInRyYW5zcGlsZVwiOiBcIm5vZGUgLi9iaW4vcnVubmVyIC0tdHJhbnNwaWxlXCIsXG4gICAgXCJ2ZXJzaW9uXCI6IFwibnBtIHJ1biB0cmFuc3BpbGUgJiYgbnBtIHJ1biBkb2MgJiYgZ2l0IGFkZCBSRUFETUUubWRcIixcbiAgICBcIndhdGNoXCI6IFwibm9kZSAuL2Jpbi9ydW5uZXIgLS13YXRjaFwiXG4gIH0sXG4gIFwic3RhbmRhbG9uZVwiOiBcImJhc2ljQ29udHJvbGxlcnNcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjRcIlxufVxuIiwiLyoqXG4gKiBAbW9kdWxlIGd1aS1jb21wb25lbnRzXG4gKi9cbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2xpZGVyIH0gZnJvbSAnLi9TbGlkZXInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBCcmVha3BvaW50IH0gZnJvbSAnLi9CcmVha3BvaW50JztcbiIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvY3JlYXRlXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHlcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1wcm90b3R5cGUtb2ZcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L3NldC1wcm90b3R5cGUtb2ZcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pdGVyYXRvclwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9kZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHlcIik7XG5cbnZhciBfZGVmaW5lUHJvcGVydHkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVmaW5lUHJvcGVydHkpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgKDAsIF9kZWZpbmVQcm9wZXJ0eTIuZGVmYXVsdCkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfTtcbn0oKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9zZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL29iamVjdC9zZXQtcHJvdG90eXBlLW9mXCIpO1xuXG52YXIgX3NldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NldFByb3RvdHlwZU9mKTtcblxudmFyIF9jcmVhdGUgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3QvY3JlYXRlXCIpO1xuXG52YXIgX2NyZWF0ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGUpO1xuXG52YXIgX3R5cGVvZjIgPSByZXF1aXJlKFwiLi4vaGVscGVycy90eXBlb2ZcIik7XG5cbnZhciBfdHlwZW9mMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3R5cGVvZjIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgKHR5cGVvZiBzdXBlckNsYXNzID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6ICgwLCBfdHlwZW9mMy5kZWZhdWx0KShzdXBlckNsYXNzKSkpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gKDAsIF9jcmVhdGUyLmRlZmF1bHQpKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2YyLmRlZmF1bHQgPyAoMCwgX3NldFByb3RvdHlwZU9mMi5kZWZhdWx0KShzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF90eXBlb2YyID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvdHlwZW9mXCIpO1xuXG52YXIgX3R5cGVvZjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90eXBlb2YyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHNlbGYsIGNhbGwpIHtcbiAgaWYgKCFzZWxmKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIGNhbGwgJiYgKCh0eXBlb2YgY2FsbCA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiAoMCwgX3R5cGVvZjMuZGVmYXVsdCkoY2FsbCkpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2l0ZXJhdG9yID0gcmVxdWlyZShcIi4uL2NvcmUtanMvc3ltYm9sL2l0ZXJhdG9yXCIpO1xuXG52YXIgX2l0ZXJhdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2l0ZXJhdG9yKTtcblxudmFyIF9zeW1ib2wgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9zeW1ib2xcIik7XG5cbnZhciBfc3ltYm9sMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N5bWJvbCk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIF9zeW1ib2wyLmRlZmF1bHQgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgX2l0ZXJhdG9yMi5kZWZhdWx0ID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gX3N5bWJvbDIuZGVmYXVsdCAmJiBvYmogIT09IF9zeW1ib2wyLmRlZmF1bHQucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgX3R5cGVvZihfaXRlcmF0b3IyLmRlZmF1bHQpID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKG9iaik7XG59IDogZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBfc3ltYm9sMi5kZWZhdWx0ICYmIG9iaiAhPT0gX3N5bWJvbDIuZGVmYXVsdC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKG9iaik7XG59OyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5jcmVhdGUnKTtcbnZhciAkT2JqZWN0ID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlKFAsIEQpIHtcbiAgcmV0dXJuICRPYmplY3QuY3JlYXRlKFAsIEQpO1xufTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHknKTtcbnZhciAkT2JqZWN0ID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgZGVzYykge1xuICByZXR1cm4gJE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKTtcbn07XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LXByb3RvdHlwZS1vZicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LnNldC1wcm90b3R5cGUtb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5zZXRQcm90b3R5cGVPZjtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN5bWJvbCcpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczcuc3ltYm9sLmFzeW5jLWl0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNy5zeW1ib2wub2JzZXJ2YWJsZScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuU3ltYm9sO1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fd2tzLWV4dCcpLmYoJ2l0ZXJhdG9yJyk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSU9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSB7XG4gICAgICBpZiAoT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59O1xuIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHsgdmVyc2lvbjogJzIuNS43JyB9O1xuaWYgKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpIF9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCB0aGF0LCBsZW5ndGgpIHtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYgKHRoYXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZuO1xuICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoLyogLi4uYXJncyAqLykge1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTtcbiIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG4vLyB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0JyBpbiBvbGQgSUVcbnZhciBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuIiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7XG4iLCIvLyBhbGwgZW51bWVyYWJsZSBvYmplY3Qga2V5cywgaW5jbHVkZXMgc3ltYm9sc1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIGdPUFMgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpO1xudmFyIHBJRSA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciByZXN1bHQgPSBnZXRLZXlzKGl0KTtcbiAgdmFyIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIGlmIChnZXRTeW1ib2xzKSB7XG4gICAgdmFyIHN5bWJvbHMgPSBnZXRTeW1ib2xzKGl0KTtcbiAgICB2YXIgaXNFbnVtID0gcElFLmY7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKHN5bWJvbHMubGVuZ3RoID4gaSkgaWYgKGlzRW51bS5jYWxsKGl0LCBrZXkgPSBzeW1ib2xzW2krK10pKSByZXN1bHQucHVzaChrZXkpO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbiAodHlwZSwgbmFtZSwgc291cmNlKSB7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GO1xuICB2YXIgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuRztcbiAgdmFyIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlM7XG4gIHZhciBJU19QUk9UTyA9IHR5cGUgJiAkZXhwb3J0LlA7XG4gIHZhciBJU19CSU5EID0gdHlwZSAmICRleHBvcnQuQjtcbiAgdmFyIElTX1dSQVAgPSB0eXBlICYgJGV4cG9ydC5XO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV07XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIga2V5LCBvd24sIG91dDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICBpZiAob3duICYmIGhhcyhleHBvcnRzLCBrZXkpKSBjb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uIChDKSB7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgQykge1xuICAgICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEMoKTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBDKGEpO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEMoYSwgYik7XG4gICAgICAgICAgfSByZXR1cm4gbmV3IEMoYSwgYiwgYyk7XG4gICAgICAgIH0gcmV0dXJuIEMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBGW1BST1RPVFlQRV0gPSBDW1BST1RPVFlQRV07XG4gICAgICByZXR1cm4gRjtcbiAgICAvLyBtYWtlIHN0YXRpYyB2ZXJzaW9ucyBmb3IgcHJvdG90eXBlIG1ldGhvZHNcbiAgICB9KShvdXQpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLm1ldGhvZHMuJU5BTUUlXG4gICAgaWYgKElTX1BST1RPKSB7XG4gICAgICAoZXhwb3J0cy52aXJ0dWFsIHx8IChleHBvcnRzLnZpcnR1YWwgPSB7fSkpW2tleV0gPSBvdXQ7XG4gICAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUucHJvdG90eXBlLiVOQU1FJVxuICAgICAgaWYgKHR5cGUgJiAkZXhwb3J0LlIgJiYgZXhwUHJvdG8gJiYgIWV4cFByb3RvW2tleV0pIGhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZiAodHlwZW9mIF9fZyA9PSAnbnVtYmVyJykgX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwidmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59O1xuIiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZykge1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgZGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCkge1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHsgbmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KSB9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyICRpdGVyQ3JlYXRlID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBCVUdHWSA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKTsgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxudmFyIEZGX0lURVJBVE9SID0gJ0BAaXRlcmF0b3InO1xudmFyIEtFWVMgPSAna2V5cyc7XG52YXIgVkFMVUVTID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKSB7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uIChraW5kKSB7XG4gICAgaWYgKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKSByZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyA9IE5BTUUgKyAnIEl0ZXJhdG9yJztcbiAgdmFyIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFUztcbiAgdmFyIFZBTFVFU19CVUcgPSBmYWxzZTtcbiAgdmFyIHByb3RvID0gQmFzZS5wcm90b3R5cGU7XG4gIHZhciAkbmF0aXZlID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdO1xuICB2YXIgJGRlZmF1bHQgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKTtcbiAgdmFyICRlbnRyaWVzID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZDtcbiAgdmFyICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlO1xuICB2YXIgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZiAoJGFueU5hdGl2ZSkge1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKCkpKTtcbiAgICBpZiAoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUgJiYgSXRlcmF0b3JQcm90b3R5cGUubmV4dCkge1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmICghTElCUkFSWSAmJiB0eXBlb2YgSXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdICE9ICdmdW5jdGlvbicpIGhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZiAoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKSB7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmICgoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSkge1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gPSByZXR1cm5UaGlzO1xuICBpZiAoREVGQVVMVCkge1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6IERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogSVNfU0VUID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYgKEZPUkNFRCkgZm9yIChrZXkgaW4gbWV0aG9kcykge1xuICAgICAgaWYgKCEoa2V5IGluIHByb3RvKSkgcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRvbmUsIHZhbHVlKSB7XG4gIHJldHVybiB7IHZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTtcbiIsInZhciBNRVRBID0gcmVxdWlyZSgnLi9fdWlkJykoJ21ldGEnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHNldERlc2MgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGlkID0gMDtcbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xudmFyIEZSRUVaRSA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGlzRXh0ZW5zaWJsZShPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKTtcbn0pO1xudmFyIHNldE1ldGEgPSBmdW5jdGlvbiAoaXQpIHtcbiAgc2V0RGVzYyhpdCwgTUVUQSwgeyB2YWx1ZToge1xuICAgIGk6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHc6IHt9ICAgICAgICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gfSk7XG59O1xudmFyIGZhc3RLZXkgPSBmdW5jdGlvbiAoaXQsIGNyZWF0ZSkge1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZiAoIWhhcyhpdCwgTUVUQSkpIHtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmICghaXNFeHRlbnNpYmxlKGl0KSkgcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmICghY3JlYXRlKSByZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBvYmplY3QgSURcbiAgfSByZXR1cm4gaXRbTUVUQV0uaTtcbn07XG52YXIgZ2V0V2VhayA9IGZ1bmN0aW9uIChpdCwgY3JlYXRlKSB7XG4gIGlmICghaGFzKGl0LCBNRVRBKSkge1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYgKCFpc0V4dGVuc2libGUoaXQpKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmICghY3JlYXRlKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIGhhc2ggd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfSByZXR1cm4gaXRbTUVUQV0udztcbn07XG4vLyBhZGQgbWV0YWRhdGEgb24gZnJlZXplLWZhbWlseSBtZXRob2RzIGNhbGxpbmdcbnZhciBvbkZyZWV6ZSA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoRlJFRVpFICYmIG1ldGEuTkVFRCAmJiBpc0V4dGVuc2libGUoaXQpICYmICFoYXMoaXQsIE1FVEEpKSBzZXRNZXRhKGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIEtFWTogTUVUQSxcbiAgTkVFRDogZmFsc2UsXG4gIGZhc3RLZXk6IGZhc3RLZXksXG4gIGdldFdlYWs6IGdldFdlYWssXG4gIG9uRnJlZXplOiBvbkZyZWV6ZVxufTtcbiIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZFBzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJyk7XG4gIHZhciBpID0gZW51bUJ1Z0tleXMubGVuZ3RoO1xuICB2YXIgbHQgPSAnPCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlIChpLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGRQID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIFA7XG4gIHdoaWxlIChsZW5ndGggPiBpKSBkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIGdPUEQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZ09QRCA6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKSB7XG4gIE8gPSB0b0lPYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBnT1BEKE8sIFApO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKGhhcyhPLCBQKSkgcmV0dXJuIGNyZWF0ZURlc2MoIXBJRS5mLmNhbGwoTywgUCksIE9bUF0pO1xufTtcbiIsIi8vIGZhbGxiYWNrIGZvciBJRTExIGJ1Z2d5IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHdpdGggaWZyYW1lIGFuZCB3aW5kb3dcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgZ09QTiA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZjtcbnZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG52YXIgd2luZG93TmFtZXMgPSB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcblxudmFyIGdldFdpbmRvd05hbWVzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGdPUE4oaXQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHdpbmRvd05hbWVzLnNsaWNlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmYgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KSB7XG4gIHJldHVybiB3aW5kb3dOYW1lcyAmJiB0b1N0cmluZy5jYWxsKGl0KSA9PSAnW29iamVjdCBXaW5kb3ddJyA/IGdldFdpbmRvd05hbWVzKGl0KSA6IGdPUE4odG9JT2JqZWN0KGl0KSk7XG59O1xuIiwiLy8gMTkuMS4yLjcgLyAxNS4yLjMuNCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpLmNvbmNhdCgnbGVuZ3RoJywgJ3Byb3RvdHlwZScpO1xuXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGhpZGRlbktleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiAoTykge1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXMoTywgSUVfUFJPVE8pKSByZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmICh0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0lPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pIGlmIChrZXkgIT0gSUVfUFJPVE8pIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTykge1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuIiwiLy8gbW9zdCBPYmplY3QgbWV0aG9kcyBieSBFUzYgc2hvdWxkIGFjY2VwdCBwcmltaXRpdmVzXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoS0VZLCBleGVjKSB7XG4gIHZhciBmbiA9IChjb3JlLk9iamVjdCB8fCB7fSlbS0VZXSB8fCBPYmplY3RbS0VZXTtcbiAgdmFyIGV4cCA9IHt9O1xuICBleHBbS0VZXSA9IGV4ZWMoZm4pO1xuICAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uICgpIHsgZm4oMSk7IH0pLCAnT2JqZWN0JywgZXhwKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19oaWRlJyk7XG4iLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29yayB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGNoZWNrID0gZnVuY3Rpb24gKE8sIHByb3RvKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBpZiAoIWlzT2JqZWN0KHByb3RvKSAmJiBwcm90byAhPT0gbnVsbCkgdGhyb3cgVHlwZUVycm9yKHByb3RvICsgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xufTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gPyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgZnVuY3Rpb24gKHRlc3QsIGJ1Z2d5LCBzZXQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNldCA9IHJlcXVpcmUoJy4vX2N0eCcpKEZ1bmN0aW9uLmNhbGwsIHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJykuZihPYmplY3QucHJvdG90eXBlLCAnX19wcm90b19fJykuc2V0LCAyKTtcbiAgICAgICAgc2V0KHRlc3QsIFtdKTtcbiAgICAgICAgYnVnZ3kgPSAhKHRlc3QgaW5zdGFuY2VvZiBBcnJheSk7XG4gICAgICB9IGNhdGNoIChlKSB7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKSB7XG4gICAgICAgIGNoZWNrKE8sIHByb3RvKTtcbiAgICAgICAgaWYgKGJ1Z2d5KSBPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgIHJldHVybiBPO1xuICAgICAgfTtcbiAgICB9KHt9LCBmYWxzZSkgOiB1bmRlZmluZWQpLFxuICBjaGVjazogY2hlY2tcbn07XG4iLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIHRhZywgc3RhdCkge1xuICBpZiAoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkgZGVmKGl0LCBUQUcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnIH0pO1xufTtcbiIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiBjb3JlLnZlcnNpb24sXG4gIG1vZGU6IHJlcXVpcmUoJy4vX2xpYnJhcnknKSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDE4IERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgcG9zKSB7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gICAgdmFyIGkgPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgbCA9IHMubGVuZ3RoO1xuICAgIHZhciBhLCBiO1xuICAgIGlmIChpIDwgMCB8fCBpID49IGwpIHJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcbiIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyIHdrc0V4dCA9IHJlcXVpcmUoJy4vX3drcy1leHQnKTtcbnZhciBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciAkU3ltYm9sID0gY29yZS5TeW1ib2wgfHwgKGNvcmUuU3ltYm9sID0gTElCUkFSWSA/IHt9IDogZ2xvYmFsLlN5bWJvbCB8fCB7fSk7XG4gIGlmIChuYW1lLmNoYXJBdCgwKSAhPSAnXycgJiYgIShuYW1lIGluICRTeW1ib2wpKSBkZWZpbmVQcm9wZXJ0eSgkU3ltYm9sLCBuYW1lLCB7IHZhbHVlOiB3a3NFeHQuZihuYW1lKSB9KTtcbn07XG4iLCJleHBvcnRzLmYgPSByZXF1aXJlKCcuL193a3MnKTtcbiIsInZhciBzdG9yZSA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2w7XG52YXIgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJyk7XG52YXIgc3RlcCA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGtpbmQgPSB0aGlzLl9rO1xuICB2YXIgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmICghTyB8fCBpbmRleCA+PSBPLmxlbmd0aCkge1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7XG4iLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHsgY3JlYXRlOiByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJykgfSk7XG4iLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuLy8gMTkuMS4yLjQgLyAxNS4yLjMuNiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyksICdPYmplY3QnLCB7IGRlZmluZVByb3BlcnR5OiByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mIH0pO1xuIiwiLy8gMTkuMS4yLjkgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciAkZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG5cbnJlcXVpcmUoJy4vX29iamVjdC1zYXAnKSgnZ2V0UHJvdG90eXBlT2YnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBnZXRQcm90b3R5cGVPZihpdCkge1xuICAgIHJldHVybiAkZ2V0UHJvdG90eXBlT2YodG9PYmplY3QoaXQpKTtcbiAgfTtcbn0pO1xuIiwiLy8gMTkuMS4zLjE5IE9iamVjdC5zZXRQcm90b3R5cGVPZihPLCBwcm90bylcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHsgc2V0UHJvdG90eXBlT2Y6IHJlcXVpcmUoJy4vX3NldC1wcm90bycpLnNldCB9KTtcbiIsIiIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbiAoaXRlcmF0ZWQpIHtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24gKCkge1xuICB2YXIgTyA9IHRoaXMuX3Q7XG4gIHZhciBpbmRleCA9IHRoaXMuX2k7XG4gIHZhciBwb2ludDtcbiAgaWYgKGluZGV4ID49IE8ubGVuZ3RoKSByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7IHZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2UgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIE1FVEEgPSByZXF1aXJlKCcuL19tZXRhJykuS0VZO1xudmFyICRmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG52YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xudmFyIHdrcyA9IHJlcXVpcmUoJy4vX3drcycpO1xudmFyIHdrc0V4dCA9IHJlcXVpcmUoJy4vX3drcy1leHQnKTtcbnZhciB3a3NEZWZpbmUgPSByZXF1aXJlKCcuL193a3MtZGVmaW5lJyk7XG52YXIgZW51bUtleXMgPSByZXF1aXJlKCcuL19lbnVtLWtleXMnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9faXMtYXJyYXknKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBfY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGdPUE5FeHQgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbi1leHQnKTtcbnZhciAkR09QRCA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJyk7XG52YXIgJERQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIGdPUEQgPSAkR09QRC5mO1xudmFyIGRQID0gJERQLmY7XG52YXIgZ09QTiA9IGdPUE5FeHQuZjtcbnZhciAkU3ltYm9sID0gZ2xvYmFsLlN5bWJvbDtcbnZhciAkSlNPTiA9IGdsb2JhbC5KU09OO1xudmFyIF9zdHJpbmdpZnkgPSAkSlNPTiAmJiAkSlNPTi5zdHJpbmdpZnk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG52YXIgSElEREVOID0gd2tzKCdfaGlkZGVuJyk7XG52YXIgVE9fUFJJTUlUSVZFID0gd2tzKCd0b1ByaW1pdGl2ZScpO1xudmFyIGlzRW51bSA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xudmFyIFN5bWJvbFJlZ2lzdHJ5ID0gc2hhcmVkKCdzeW1ib2wtcmVnaXN0cnknKTtcbnZhciBBbGxTeW1ib2xzID0gc2hhcmVkKCdzeW1ib2xzJyk7XG52YXIgT1BTeW1ib2xzID0gc2hhcmVkKCdvcC1zeW1ib2xzJyk7XG52YXIgT2JqZWN0UHJvdG8gPSBPYmplY3RbUFJPVE9UWVBFXTtcbnZhciBVU0VfTkFUSVZFID0gdHlwZW9mICRTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcbnZhciBRT2JqZWN0ID0gZ2xvYmFsLlFPYmplY3Q7XG4vLyBEb24ndCB1c2Ugc2V0dGVycyBpbiBRdCBTY3JpcHQsIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy8xNzNcbnZhciBzZXR0ZXIgPSAhUU9iamVjdCB8fCAhUU9iamVjdFtQUk9UT1RZUEVdIHx8ICFRT2JqZWN0W1BST1RPVFlQRV0uZmluZENoaWxkO1xuXG4vLyBmYWxsYmFjayBmb3Igb2xkIEFuZHJvaWQsIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD02ODdcbnZhciBzZXRTeW1ib2xEZXNjID0gREVTQ1JJUFRPUlMgJiYgJGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIF9jcmVhdGUoZFAoe30sICdhJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZFAodGhpcywgJ2EnLCB7IHZhbHVlOiA3IH0pLmE7IH1cbiAgfSkpLmEgIT0gNztcbn0pID8gZnVuY3Rpb24gKGl0LCBrZXksIEQpIHtcbiAgdmFyIHByb3RvRGVzYyA9IGdPUEQoT2JqZWN0UHJvdG8sIGtleSk7XG4gIGlmIChwcm90b0Rlc2MpIGRlbGV0ZSBPYmplY3RQcm90b1trZXldO1xuICBkUChpdCwga2V5LCBEKTtcbiAgaWYgKHByb3RvRGVzYyAmJiBpdCAhPT0gT2JqZWN0UHJvdG8pIGRQKE9iamVjdFByb3RvLCBrZXksIHByb3RvRGVzYyk7XG59IDogZFA7XG5cbnZhciB3cmFwID0gZnVuY3Rpb24gKHRhZykge1xuICB2YXIgc3ltID0gQWxsU3ltYm9sc1t0YWddID0gX2NyZWF0ZSgkU3ltYm9sW1BST1RPVFlQRV0pO1xuICBzeW0uX2sgPSB0YWc7XG4gIHJldHVybiBzeW07XG59O1xuXG52YXIgaXNTeW1ib2wgPSBVU0VfTkFUSVZFICYmIHR5cGVvZiAkU3ltYm9sLml0ZXJhdG9yID09ICdzeW1ib2wnID8gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCc7XG59IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCBpbnN0YW5jZW9mICRTeW1ib2w7XG59O1xuXG52YXIgJGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgRCkge1xuICBpZiAoaXQgPT09IE9iamVjdFByb3RvKSAkZGVmaW5lUHJvcGVydHkoT1BTeW1ib2xzLCBrZXksIEQpO1xuICBhbk9iamVjdChpdCk7XG4gIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEQpO1xuICBpZiAoaGFzKEFsbFN5bWJvbHMsIGtleSkpIHtcbiAgICBpZiAoIUQuZW51bWVyYWJsZSkge1xuICAgICAgaWYgKCFoYXMoaXQsIEhJRERFTikpIGRQKGl0LCBISURERU4sIGNyZWF0ZURlc2MoMSwge30pKTtcbiAgICAgIGl0W0hJRERFTl1ba2V5XSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKSBpdFtISURERU5dW2tleV0gPSBmYWxzZTtcbiAgICAgIEQgPSBfY3JlYXRlKEQsIHsgZW51bWVyYWJsZTogY3JlYXRlRGVzYygwLCBmYWxzZSkgfSk7XG4gICAgfSByZXR1cm4gc2V0U3ltYm9sRGVzYyhpdCwga2V5LCBEKTtcbiAgfSByZXR1cm4gZFAoaXQsIGtleSwgRCk7XG59O1xudmFyICRkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhpdCwgUCkge1xuICBhbk9iamVjdChpdCk7XG4gIHZhciBrZXlzID0gZW51bUtleXMoUCA9IHRvSU9iamVjdChQKSk7XG4gIHZhciBpID0gMDtcbiAgdmFyIGwgPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKGwgPiBpKSAkZGVmaW5lUHJvcGVydHkoaXQsIGtleSA9IGtleXNbaSsrXSwgUFtrZXldKTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciAkY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGl0LCBQKSB7XG4gIHJldHVybiBQID09PSB1bmRlZmluZWQgPyBfY3JlYXRlKGl0KSA6ICRkZWZpbmVQcm9wZXJ0aWVzKF9jcmVhdGUoaXQpLCBQKTtcbn07XG52YXIgJHByb3BlcnR5SXNFbnVtZXJhYmxlID0gZnVuY3Rpb24gcHJvcGVydHlJc0VudW1lcmFibGUoa2V5KSB7XG4gIHZhciBFID0gaXNFbnVtLmNhbGwodGhpcywga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKSk7XG4gIGlmICh0aGlzID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gRSB8fCAhaGFzKHRoaXMsIGtleSkgfHwgIWhhcyhBbGxTeW1ib2xzLCBrZXkpIHx8IGhhcyh0aGlzLCBISURERU4pICYmIHRoaXNbSElEREVOXVtrZXldID8gRSA6IHRydWU7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSkge1xuICBpdCA9IHRvSU9iamVjdChpdCk7XG4gIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSk7XG4gIGlmIChpdCA9PT0gT2JqZWN0UHJvdG8gJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPUFN5bWJvbHMsIGtleSkpIHJldHVybjtcbiAgdmFyIEQgPSBnT1BEKGl0LCBrZXkpO1xuICBpZiAoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pKSBELmVudW1lcmFibGUgPSB0cnVlO1xuICByZXR1cm4gRDtcbn07XG52YXIgJGdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KSB7XG4gIHZhciBuYW1lcyA9IGdPUE4odG9JT2JqZWN0KGl0KSk7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGkgPSAwO1xuICB2YXIga2V5O1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkge1xuICAgIGlmICghaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIGtleSAhPSBISURERU4gJiYga2V5ICE9IE1FVEEpIHJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgJGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhpdCkge1xuICB2YXIgSVNfT1AgPSBpdCA9PT0gT2JqZWN0UHJvdG87XG4gIHZhciBuYW1lcyA9IGdPUE4oSVNfT1AgPyBPUFN5bWJvbHMgOiB0b0lPYmplY3QoaXQpKTtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIgaSA9IDA7XG4gIHZhciBrZXk7XG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSB7XG4gICAgaWYgKGhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiAoSVNfT1AgPyBoYXMoT2JqZWN0UHJvdG8sIGtleSkgOiB0cnVlKSkgcmVzdWx0LnB1c2goQWxsU3ltYm9sc1trZXldKTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcblxuLy8gMTkuNC4xLjEgU3ltYm9sKFtkZXNjcmlwdGlvbl0pXG5pZiAoIVVTRV9OQVRJVkUpIHtcbiAgJFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbCgpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mICRTeW1ib2wpIHRocm93IFR5cGVFcnJvcignU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yIScpO1xuICAgIHZhciB0YWcgPSB1aWQoYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpO1xuICAgIHZhciAkc2V0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAodGhpcyA9PT0gT2JqZWN0UHJvdG8pICRzZXQuY2FsbChPUFN5bWJvbHMsIHZhbHVlKTtcbiAgICAgIGlmIChoYXModGhpcywgSElEREVOKSAmJiBoYXModGhpc1tISURERU5dLCB0YWcpKSB0aGlzW0hJRERFTl1bdGFnXSA9IGZhbHNlO1xuICAgICAgc2V0U3ltYm9sRGVzYyh0aGlzLCB0YWcsIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbiAgICB9O1xuICAgIGlmIChERVNDUklQVE9SUyAmJiBzZXR0ZXIpIHNldFN5bWJvbERlc2MoT2JqZWN0UHJvdG8sIHRhZywgeyBjb25maWd1cmFibGU6IHRydWUsIHNldDogJHNldCB9KTtcbiAgICByZXR1cm4gd3JhcCh0YWcpO1xuICB9O1xuICByZWRlZmluZSgkU3ltYm9sW1BST1RPVFlQRV0sICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9rO1xuICB9KTtcblxuICAkR09QRC5mID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgJERQLmYgPSAkZGVmaW5lUHJvcGVydHk7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZiA9IGdPUE5FeHQuZiA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICByZXF1aXJlKCcuL19vYmplY3QtcGllJykuZiA9ICRwcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKS5mID0gJGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZiAoREVTQ1JJUFRPUlMgJiYgIXJlcXVpcmUoJy4vX2xpYnJhcnknKSkge1xuICAgIHJlZGVmaW5lKE9iamVjdFByb3RvLCAncHJvcGVydHlJc0VudW1lcmFibGUnLCAkcHJvcGVydHlJc0VudW1lcmFibGUsIHRydWUpO1xuICB9XG5cbiAgd2tzRXh0LmYgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHJldHVybiB3cmFwKHdrcyhuYW1lKSk7XG4gIH07XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHsgU3ltYm9sOiAkU3ltYm9sIH0pO1xuXG5mb3IgKHZhciBlczZTeW1ib2xzID0gKFxuICAvLyAxOS40LjIuMiwgMTkuNC4yLjMsIDE5LjQuMi40LCAxOS40LjIuNiwgMTkuNC4yLjgsIDE5LjQuMi45LCAxOS40LjIuMTAsIDE5LjQuMi4xMSwgMTkuNC4yLjEyLCAxOS40LjIuMTMsIDE5LjQuMi4xNFxuICAnaGFzSW5zdGFuY2UsaXNDb25jYXRTcHJlYWRhYmxlLGl0ZXJhdG9yLG1hdGNoLHJlcGxhY2Usc2VhcmNoLHNwZWNpZXMsc3BsaXQsdG9QcmltaXRpdmUsdG9TdHJpbmdUYWcsdW5zY29wYWJsZXMnXG4pLnNwbGl0KCcsJyksIGogPSAwOyBlczZTeW1ib2xzLmxlbmd0aCA+IGo7KXdrcyhlczZTeW1ib2xzW2orK10pO1xuXG5mb3IgKHZhciB3ZWxsS25vd25TeW1ib2xzID0gJGtleXMod2tzLnN0b3JlKSwgayA9IDA7IHdlbGxLbm93blN5bWJvbHMubGVuZ3RoID4gazspIHdrc0RlZmluZSh3ZWxsS25vd25TeW1ib2xzW2srK10pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCAnU3ltYm9sJywge1xuICAvLyAxOS40LjIuMSBTeW1ib2wuZm9yKGtleSlcbiAgJ2Zvcic6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXG4gICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cbiAgICAgIDogU3ltYm9sUmVnaXN0cnlba2V5XSA9ICRTeW1ib2woa2V5KTtcbiAgfSxcbiAgLy8gMTkuNC4yLjUgU3ltYm9sLmtleUZvcihzeW0pXG4gIGtleUZvcjogZnVuY3Rpb24ga2V5Rm9yKHN5bSkge1xuICAgIGlmICghaXNTeW1ib2woc3ltKSkgdGhyb3cgVHlwZUVycm9yKHN5bSArICcgaXMgbm90IGEgc3ltYm9sIScpO1xuICAgIGZvciAodmFyIGtleSBpbiBTeW1ib2xSZWdpc3RyeSkgaWYgKFN5bWJvbFJlZ2lzdHJ5W2tleV0gPT09IHN5bSkgcmV0dXJuIGtleTtcbiAgfSxcbiAgdXNlU2V0dGVyOiBmdW5jdGlvbiAoKSB7IHNldHRlciA9IHRydWU7IH0sXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24gKCkgeyBzZXR0ZXIgPSBmYWxzZTsgfVxufSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiAkY3JlYXRlLFxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyAyNC4zLjIgSlNPTi5zdHJpbmdpZnkodmFsdWUgWywgcmVwbGFjZXIgWywgc3BhY2VdXSlcbiRKU09OICYmICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCFVU0VfTkFUSVZFIHx8ICRmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHZhciBTID0gJFN5bWJvbCgpO1xuICAvLyBNUyBFZGdlIGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyB7fVxuICAvLyBXZWJLaXQgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIG51bGxcbiAgLy8gVjggdGhyb3dzIG9uIGJveGVkIHN5bWJvbHNcbiAgcmV0dXJuIF9zdHJpbmdpZnkoW1NdKSAhPSAnW251bGxdJyB8fCBfc3RyaW5naWZ5KHsgYTogUyB9KSAhPSAne30nIHx8IF9zdHJpbmdpZnkoT2JqZWN0KFMpKSAhPSAne30nO1xufSkpLCAnSlNPTicsIHtcbiAgc3RyaW5naWZ5OiBmdW5jdGlvbiBzdHJpbmdpZnkoaXQpIHtcbiAgICB2YXIgYXJncyA9IFtpdF07XG4gICAgdmFyIGkgPSAxO1xuICAgIHZhciByZXBsYWNlciwgJHJlcGxhY2VyO1xuICAgIHdoaWxlIChhcmd1bWVudHMubGVuZ3RoID4gaSkgYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICAkcmVwbGFjZXIgPSByZXBsYWNlciA9IGFyZ3NbMV07XG4gICAgaWYgKCFpc09iamVjdChyZXBsYWNlcikgJiYgaXQgPT09IHVuZGVmaW5lZCB8fCBpc1N5bWJvbChpdCkpIHJldHVybjsgLy8gSUU4IHJldHVybnMgc3RyaW5nIG9uIHVuZGVmaW5lZFxuICAgIGlmICghaXNBcnJheShyZXBsYWNlcikpIHJlcGxhY2VyID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgIGlmICh0eXBlb2YgJHJlcGxhY2VyID09ICdmdW5jdGlvbicpIHZhbHVlID0gJHJlcGxhY2VyLmNhbGwodGhpcywga2V5LCB2YWx1ZSk7XG4gICAgICBpZiAoIWlzU3ltYm9sKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gICAgYXJnc1sxXSA9IHJlcGxhY2VyO1xuICAgIHJldHVybiBfc3RyaW5naWZ5LmFwcGx5KCRKU09OLCBhcmdzKTtcbiAgfVxufSk7XG5cbi8vIDE5LjQuMy40IFN5bWJvbC5wcm90b3R5cGVbQEB0b1ByaW1pdGl2ZV0oaGludClcbiRTeW1ib2xbUFJPVE9UWVBFXVtUT19QUklNSVRJVkVdIHx8IHJlcXVpcmUoJy4vX2hpZGUnKSgkU3ltYm9sW1BST1RPVFlQRV0sIFRPX1BSSU1JVElWRSwgJFN5bWJvbFtQUk9UT1RZUEVdLnZhbHVlT2YpO1xuLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoJFN5bWJvbCwgJ1N5bWJvbCcpO1xuLy8gMjAuMi4xLjkgTWF0aFtAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoTWF0aCwgJ01hdGgnLCB0cnVlKTtcbi8vIDI0LjMuMyBKU09OW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZyhnbG9iYWwuSlNPTiwgJ0pTT04nLCB0cnVlKTtcbiIsInJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKSgnYXN5bmNJdGVyYXRvcicpO1xuIiwicmVxdWlyZSgnLi9fd2tzLWRlZmluZScpKCdvYnNlcnZhYmxlJyk7XG4iLCJyZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgVE9fU1RSSU5HX1RBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG52YXIgRE9NSXRlcmFibGVzID0gKCdDU1NSdWxlTGlzdCxDU1NTdHlsZURlY2xhcmF0aW9uLENTU1ZhbHVlTGlzdCxDbGllbnRSZWN0TGlzdCxET01SZWN0TGlzdCxET01TdHJpbmdMaXN0LCcgK1xuICAnRE9NVG9rZW5MaXN0LERhdGFUcmFuc2Zlckl0ZW1MaXN0LEZpbGVMaXN0LEhUTUxBbGxDb2xsZWN0aW9uLEhUTUxDb2xsZWN0aW9uLEhUTUxGb3JtRWxlbWVudCxIVE1MU2VsZWN0RWxlbWVudCwnICtcbiAgJ01lZGlhTGlzdCxNaW1lVHlwZUFycmF5LE5hbWVkTm9kZU1hcCxOb2RlTGlzdCxQYWludFJlcXVlc3RMaXN0LFBsdWdpbixQbHVnaW5BcnJheSxTVkdMZW5ndGhMaXN0LFNWR051bWJlckxpc3QsJyArXG4gICdTVkdQYXRoU2VnTGlzdCxTVkdQb2ludExpc3QsU1ZHU3RyaW5nTGlzdCxTVkdUcmFuc2Zvcm1MaXN0LFNvdXJjZUJ1ZmZlckxpc3QsU3R5bGVTaGVldExpc3QsVGV4dFRyYWNrQ3VlTGlzdCwnICtcbiAgJ1RleHRUcmFja0xpc3QsVG91Y2hMaXN0Jykuc3BsaXQoJywnKTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCBET01JdGVyYWJsZXMubGVuZ3RoOyBpKyspIHtcbiAgdmFyIE5BTUUgPSBET01JdGVyYWJsZXNbaV07XG4gIHZhciBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdO1xuICB2YXIgcHJvdG8gPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICBpZiAocHJvdG8gJiYgIXByb3RvW1RPX1NUUklOR19UQUddKSBoaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgSXRlcmF0b3JzW05BTUVdID0gSXRlcmF0b3JzLkFycmF5O1xufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9nZXQtaXRlcmF0b3JcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvclwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9zZXRcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9nZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL29iamVjdC9nZXQtcHJvdG90eXBlLW9mXCIpO1xuXG52YXIgX2dldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldFByb3RvdHlwZU9mKTtcblxudmFyIF9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3QvZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yXCIpO1xuXG52YXIgX2dldE93blByb3BlcnR5RGVzY3JpcHRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiBnZXQob2JqZWN0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcbiAgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuICB2YXIgZGVzYyA9ICgwLCBfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yMi5kZWZhdWx0KShvYmplY3QsIHByb3BlcnR5KTtcblxuICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIHBhcmVudCA9ICgwLCBfZ2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKG9iamVjdCk7XG5cbiAgICBpZiAocGFyZW50ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZ2V0KHBhcmVudCwgcHJvcGVydHksIHJlY2VpdmVyKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIHtcbiAgICByZXR1cm4gZGVzYy52YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7XG5cbiAgICBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTtcbiAgfVxufTsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yJyk7XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG52YXIgJE9iamVjdCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KSB7XG4gIHJldHVybiAkT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KTtcbn07XG4iLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc2V0Jyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5zZXQudG8tanNvbicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcuc2V0Lm9mJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5zZXQuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuU2V0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIENvbnN0cnVjdG9yLCBuYW1lLCBmb3JiaWRkZW5GaWVsZCkge1xuICBpZiAoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSB8fCAoZm9yYmlkZGVuRmllbGQgIT09IHVuZGVmaW5lZCAmJiBmb3JiaWRkZW5GaWVsZCBpbiBpdCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IobmFtZSArICc6IGluY29ycmVjdCBpbnZvY2F0aW9uIScpO1xuICB9IHJldHVybiBpdDtcbn07XG4iLCJ2YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlciwgSVRFUkFUT1IpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3JPZihpdGVyLCBmYWxzZSwgcmVzdWx0LnB1c2gsIHJlc3VsdCwgSVRFUkFUT1IpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIDAgLT4gQXJyYXkjZm9yRWFjaFxuLy8gMSAtPiBBcnJheSNtYXBcbi8vIDIgLT4gQXJyYXkjZmlsdGVyXG4vLyAzIC0+IEFycmF5I3NvbWVcbi8vIDQgLT4gQXJyYXkjZXZlcnlcbi8vIDUgLT4gQXJyYXkjZmluZFxuLy8gNiAtPiBBcnJheSNmaW5kSW5kZXhcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBhc2MgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNyZWF0ZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVFlQRSwgJGNyZWF0ZSkge1xuICB2YXIgSVNfTUFQID0gVFlQRSA9PSAxO1xuICB2YXIgSVNfRklMVEVSID0gVFlQRSA9PSAyO1xuICB2YXIgSVNfU09NRSA9IFRZUEUgPT0gMztcbiAgdmFyIElTX0VWRVJZID0gVFlQRSA9PSA0O1xuICB2YXIgSVNfRklORF9JTkRFWCA9IFRZUEUgPT0gNjtcbiAgdmFyIE5PX0hPTEVTID0gVFlQRSA9PSA1IHx8IElTX0ZJTkRfSU5ERVg7XG4gIHZhciBjcmVhdGUgPSAkY3JlYXRlIHx8IGFzYztcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgY2FsbGJhY2tmbiwgdGhhdCkge1xuICAgIHZhciBPID0gdG9PYmplY3QoJHRoaXMpO1xuICAgIHZhciBzZWxmID0gSU9iamVjdChPKTtcbiAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCB0aGF0LCAzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoc2VsZi5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHJlc3VsdCA9IElTX01BUCA/IGNyZWF0ZSgkdGhpcywgbGVuZ3RoKSA6IElTX0ZJTFRFUiA/IGNyZWF0ZSgkdGhpcywgMCkgOiB1bmRlZmluZWQ7XG4gICAgdmFyIHZhbCwgcmVzO1xuICAgIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoTk9fSE9MRVMgfHwgaW5kZXggaW4gc2VsZikge1xuICAgICAgdmFsID0gc2VsZltpbmRleF07XG4gICAgICByZXMgPSBmKHZhbCwgaW5kZXgsIE8pO1xuICAgICAgaWYgKFRZUEUpIHtcbiAgICAgICAgaWYgKElTX01BUCkgcmVzdWx0W2luZGV4XSA9IHJlczsgICAvLyBtYXBcbiAgICAgICAgZWxzZSBpZiAocmVzKSBzd2l0Y2ggKFRZUEUpIHtcbiAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAvLyBzb21lXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgLy8gZmluZFxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgIC8vIGZpbmRJbmRleFxuICAgICAgICAgIGNhc2UgMjogcmVzdWx0LnB1c2godmFsKTsgICAgICAgIC8vIGZpbHRlclxuICAgICAgICB9IGVsc2UgaWYgKElTX0VWRVJZKSByZXR1cm4gZmFsc2U7IC8vIGV2ZXJ5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiByZXN1bHQ7XG4gIH07XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vX2lzLWFycmF5Jyk7XG52YXIgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9yaWdpbmFsKSB7XG4gIHZhciBDO1xuICBpZiAoaXNBcnJheShvcmlnaW5hbCkpIHtcbiAgICBDID0gb3JpZ2luYWwuY29uc3RydWN0b3I7XG4gICAgLy8gY3Jvc3MtcmVhbG0gZmFsbGJhY2tcbiAgICBpZiAodHlwZW9mIEMgPT0gJ2Z1bmN0aW9uJyAmJiAoQyA9PT0gQXJyYXkgfHwgaXNBcnJheShDLnByb3RvdHlwZSkpKSBDID0gdW5kZWZpbmVkO1xuICAgIGlmIChpc09iamVjdChDKSkge1xuICAgICAgQyA9IENbU1BFQ0lFU107XG4gICAgICBpZiAoQyA9PT0gbnVsbCkgQyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gcmV0dXJuIEMgPT09IHVuZGVmaW5lZCA/IEFycmF5IDogQztcbn07XG4iLCIvLyA5LjQuMi4zIEFycmF5U3BlY2llc0NyZWF0ZShvcmlnaW5hbEFycmF5LCBsZW5ndGgpXG52YXIgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jb25zdHJ1Y3RvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcmlnaW5hbCwgbGVuZ3RoKSB7XG4gIHJldHVybiBuZXcgKHNwZWNpZXNDb25zdHJ1Y3RvcihvcmlnaW5hbCkpKGxlbmd0aCk7XG59O1xuIiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcbi8vIEVTMyB3cm9uZyBoZXJlXG52YXIgQVJHID0gY29mKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKTtcbnZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xudmFyICRpdGVyRGVmaW5lID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKTtcbnZhciBzdGVwID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJyk7XG52YXIgc2V0U3BlY2llcyA9IHJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIGZhc3RLZXkgPSByZXF1aXJlKCcuL19tZXRhJykuZmFzdEtleTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBTSVpFID0gREVTQ1JJUFRPUlMgPyAnX3MnIDogJ3NpemUnO1xuXG52YXIgZ2V0RW50cnkgPSBmdW5jdGlvbiAodGhhdCwga2V5KSB7XG4gIC8vIGZhc3QgY2FzZVxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSk7XG4gIHZhciBlbnRyeTtcbiAgaWYgKGluZGV4ICE9PSAnRicpIHJldHVybiB0aGF0Ll9pW2luZGV4XTtcbiAgLy8gZnJvemVuIG9iamVjdCBjYXNlXG4gIGZvciAoZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKSB7XG4gICAgaWYgKGVudHJ5LmsgPT0ga2V5KSByZXR1cm4gZW50cnk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24gKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpIHtcbiAgICB2YXIgQyA9IHdyYXBwZXIoZnVuY3Rpb24gKHRoYXQsIGl0ZXJhYmxlKSB7XG4gICAgICBhbkluc3RhbmNlKHRoYXQsIEMsIE5BTUUsICdfaScpO1xuICAgICAgdGhhdC5fdCA9IE5BTUU7ICAgICAgICAgLy8gY29sbGVjdGlvbiB0eXBlXG4gICAgICB0aGF0Ll9pID0gY3JlYXRlKG51bGwpOyAvLyBpbmRleFxuICAgICAgdGhhdC5fZiA9IHVuZGVmaW5lZDsgICAgLy8gZmlyc3QgZW50cnlcbiAgICAgIHRoYXQuX2wgPSB1bmRlZmluZWQ7ICAgIC8vIGxhc3QgZW50cnlcbiAgICAgIHRoYXRbU0laRV0gPSAwOyAgICAgICAgIC8vIHNpemVcbiAgICAgIGlmIChpdGVyYWJsZSAhPSB1bmRlZmluZWQpIGZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcbiAgICB9KTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXG4gICAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgZm9yICh2YXIgdGhhdCA9IHZhbGlkYXRlKHRoaXMsIE5BTUUpLCBkYXRhID0gdGhhdC5faSwgZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKSB7XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYgKGVudHJ5LnApIGVudHJ5LnAgPSBlbnRyeS5wLm4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgZGVsZXRlIGRhdGFbZW50cnkuaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhhdC5fZiA9IHRoYXQuX2wgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB2YWxpZGF0ZSh0aGlzLCBOQU1FKTtcbiAgICAgICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgdmFyIG5leHQgPSBlbnRyeS5uO1xuICAgICAgICAgIHZhciBwcmV2ID0gZW50cnkucDtcbiAgICAgICAgICBkZWxldGUgdGhhdC5faVtlbnRyeS5pXTtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZiAocHJldikgcHJldi5uID0gbmV4dDtcbiAgICAgICAgICBpZiAobmV4dCkgbmV4dC5wID0gcHJldjtcbiAgICAgICAgICBpZiAodGhhdC5fZiA9PSBlbnRyeSkgdGhhdC5fZiA9IG5leHQ7XG4gICAgICAgICAgaWYgKHRoYXQuX2wgPT0gZW50cnkpIHRoYXQuX2wgPSBwcmV2O1xuICAgICAgICAgIHRoYXRbU0laRV0tLTtcbiAgICAgICAgfSByZXR1cm4gISFlbnRyeTtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4yLjMuNiBTZXQucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIC8vIDIzLjEuMy41IE1hcC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qICwgdGhhdCA9IHVuZGVmaW5lZCAqLykge1xuICAgICAgICB2YWxpZGF0ZSh0aGlzLCBOQU1FKTtcbiAgICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIDMpO1xuICAgICAgICB2YXIgZW50cnk7XG4gICAgICAgIHdoaWxlIChlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXMuX2YpIHtcbiAgICAgICAgICBmKGVudHJ5LnYsIGVudHJ5LmssIHRoaXMpO1xuICAgICAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgICAgIHdoaWxlIChlbnRyeSAmJiBlbnRyeS5yKSBlbnRyeSA9IGVudHJ5LnA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuNyBNYXAucHJvdG90eXBlLmhhcyhrZXkpXG4gICAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSkge1xuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh2YWxpZGF0ZSh0aGlzLCBOQU1FKSwga2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoREVTQ1JJUFRPUlMpIGRQKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdmFsaWRhdGUodGhpcywgTkFNRSlbU0laRV07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIEM7XG4gIH0sXG4gIGRlZjogZnVuY3Rpb24gKHRoYXQsIGtleSwgdmFsdWUpIHtcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgIHZhciBwcmV2LCBpbmRleDtcbiAgICAvLyBjaGFuZ2UgZXhpc3RpbmcgZW50cnlcbiAgICBpZiAoZW50cnkpIHtcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuX2wgPSBlbnRyeSA9IHtcbiAgICAgICAgaTogaW5kZXggPSBmYXN0S2V5KGtleSwgdHJ1ZSksIC8vIDwtIGluZGV4XG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICAgIHA6IHByZXYgPSB0aGF0Ll9sLCAgICAgICAgICAgICAvLyA8LSBwcmV2aW91cyBlbnRyeVxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxuICAgICAgfTtcbiAgICAgIGlmICghdGhhdC5fZikgdGhhdC5fZiA9IGVudHJ5O1xuICAgICAgaWYgKHByZXYpIHByZXYubiA9IGVudHJ5O1xuICAgICAgdGhhdFtTSVpFXSsrO1xuICAgICAgLy8gYWRkIHRvIGluZGV4XG4gICAgICBpZiAoaW5kZXggIT09ICdGJykgdGhhdC5faVtpbmRleF0gPSBlbnRyeTtcbiAgICB9IHJldHVybiB0aGF0O1xuICB9LFxuICBnZXRFbnRyeTogZ2V0RW50cnksXG4gIHNldFN0cm9uZzogZnVuY3Rpb24gKEMsIE5BTUUsIElTX01BUCkge1xuICAgIC8vIGFkZCAua2V5cywgLnZhbHVlcywgLmVudHJpZXMsIFtAQGl0ZXJhdG9yXVxuICAgIC8vIDIzLjEuMy40LCAyMy4xLjMuOCwgMjMuMS4zLjExLCAyMy4xLjMuMTIsIDIzLjIuMy41LCAyMy4yLjMuOCwgMjMuMi4zLjEwLCAyMy4yLjMuMTFcbiAgICAkaXRlckRlZmluZShDLCBOQU1FLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgICAgIHRoaXMuX3QgPSB2YWxpZGF0ZShpdGVyYXRlZCwgTkFNRSk7IC8vIHRhcmdldFxuICAgICAgdGhpcy5fayA9IGtpbmQ7ICAgICAgICAgICAgICAgICAgICAgLy8ga2luZFxuICAgICAgdGhpcy5fbCA9IHVuZGVmaW5lZDsgICAgICAgICAgICAgICAgLy8gcHJldmlvdXNcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICB2YXIga2luZCA9IHRoYXQuX2s7XG4gICAgICB2YXIgZW50cnkgPSB0aGF0Ll9sO1xuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICB3aGlsZSAoZW50cnkgJiYgZW50cnkucikgZW50cnkgPSBlbnRyeS5wO1xuICAgICAgLy8gZ2V0IG5leHQgZW50cnlcbiAgICAgIGlmICghdGhhdC5fdCB8fCAhKHRoYXQuX2wgPSBlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoYXQuX3QuX2YpKSB7XG4gICAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXG4gICAgICAgIHRoYXQuX3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBzdGVwKDEpO1xuICAgICAgfVxuICAgICAgLy8gcmV0dXJuIHN0ZXAgYnkga2luZFxuICAgICAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4gc3RlcCgwLCBlbnRyeS5rKTtcbiAgICAgIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcbiAgICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XG4gICAgfSwgSVNfTUFQID8gJ2VudHJpZXMnIDogJ3ZhbHVlcycsICFJU19NQVAsIHRydWUpO1xuXG4gICAgLy8gYWRkIFtAQHNwZWNpZXNdLCAyMy4xLjIuMiwgMjMuMi4yLjJcbiAgICBzZXRTcGVjaWVzKE5BTUUpO1xuICB9XG59O1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgZnJvbSA9IHJlcXVpcmUoJy4vX2FycmF5LWZyb20taXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE5BTUUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgICBpZiAoY2xhc3NvZih0aGlzKSAhPSBOQU1FKSB0aHJvdyBUeXBlRXJyb3IoTkFNRSArIFwiI3RvSlNPTiBpc24ndCBnZW5lcmljXCIpO1xuICAgIHJldHVybiBmcm9tKHRoaXMpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgbWV0YSA9IHJlcXVpcmUoJy4vX21ldGEnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpO1xudmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGVhY2ggPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJykoMCk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChOQU1FLCB3cmFwcGVyLCBtZXRob2RzLCBjb21tb24sIElTX01BUCwgSVNfV0VBSykge1xuICB2YXIgQmFzZSA9IGdsb2JhbFtOQU1FXTtcbiAgdmFyIEMgPSBCYXNlO1xuICB2YXIgQURERVIgPSBJU19NQVAgPyAnc2V0JyA6ICdhZGQnO1xuICB2YXIgcHJvdG8gPSBDICYmIEMucHJvdG90eXBlO1xuICB2YXIgTyA9IHt9O1xuICBpZiAoIURFU0NSSVBUT1JTIHx8IHR5cGVvZiBDICE9ICdmdW5jdGlvbicgfHwgIShJU19XRUFLIHx8IHByb3RvLmZvckVhY2ggJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICBuZXcgQygpLmVudHJpZXMoKS5uZXh0KCk7XG4gIH0pKSkge1xuICAgIC8vIGNyZWF0ZSBjb2xsZWN0aW9uIGNvbnN0cnVjdG9yXG4gICAgQyA9IGNvbW1vbi5nZXRDb25zdHJ1Y3Rvcih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwgbWV0aG9kcyk7XG4gICAgbWV0YS5ORUVEID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBDID0gd3JhcHBlcihmdW5jdGlvbiAodGFyZ2V0LCBpdGVyYWJsZSkge1xuICAgICAgYW5JbnN0YW5jZSh0YXJnZXQsIEMsIE5BTUUsICdfYycpO1xuICAgICAgdGFyZ2V0Ll9jID0gbmV3IEJhc2UoKTtcbiAgICAgIGlmIChpdGVyYWJsZSAhPSB1bmRlZmluZWQpIGZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRhcmdldFtBRERFUl0sIHRhcmdldCk7XG4gICAgfSk7XG4gICAgZWFjaCgnYWRkLGNsZWFyLGRlbGV0ZSxmb3JFYWNoLGdldCxoYXMsc2V0LGtleXMsdmFsdWVzLGVudHJpZXMsdG9KU09OJy5zcGxpdCgnLCcpLCBmdW5jdGlvbiAoS0VZKSB7XG4gICAgICB2YXIgSVNfQURERVIgPSBLRVkgPT0gJ2FkZCcgfHwgS0VZID09ICdzZXQnO1xuICAgICAgaWYgKEtFWSBpbiBwcm90byAmJiAhKElTX1dFQUsgJiYgS0VZID09ICdjbGVhcicpKSBoaWRlKEMucHJvdG90eXBlLCBLRVksIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIGFuSW5zdGFuY2UodGhpcywgQywgS0VZKTtcbiAgICAgICAgaWYgKCFJU19BRERFUiAmJiBJU19XRUFLICYmICFpc09iamVjdChhKSkgcmV0dXJuIEtFWSA9PSAnZ2V0JyA/IHVuZGVmaW5lZCA6IGZhbHNlO1xuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fY1tLRVldKGEgPT09IDAgPyAwIDogYSwgYik7XG4gICAgICAgIHJldHVybiBJU19BRERFUiA/IHRoaXMgOiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBJU19XRUFLIHx8IGRQKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYy5zaXplO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0VG9TdHJpbmdUYWcoQywgTkFNRSk7XG5cbiAgT1tOQU1FXSA9IEM7XG4gICRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GLCBPKTtcblxuICBpZiAoIUlTX1dFQUspIGNvbW1vbi5zZXRTdHJvbmcoQywgTkFNRSwgSVNfTUFQKTtcblxuICByZXR1cm4gQztcbn07XG4iLCJ2YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpO1xudmFyIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBnZXRJdGVyRm4gPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xudmFyIEJSRUFLID0ge307XG52YXIgUkVUVVJOID0ge307XG52YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCwgSVRFUkFUT1IpIHtcbiAgdmFyIGl0ZXJGbiA9IElURVJBVE9SID8gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcmFibGU7IH0gOiBnZXRJdGVyRm4oaXRlcmFibGUpO1xuICB2YXIgZiA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKTtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGxlbmd0aCwgc3RlcCwgaXRlcmF0b3IsIHJlc3VsdDtcbiAgaWYgKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ZXJhYmxlICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIC8vIGZhc3QgY2FzZSBmb3IgYXJyYXlzIHdpdGggZGVmYXVsdCBpdGVyYXRvclxuICBpZiAoaXNBcnJheUl0ZXIoaXRlckZuKSkgZm9yIChsZW5ndGggPSB0b0xlbmd0aChpdGVyYWJsZS5sZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgIHJlc3VsdCA9IGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgICBpZiAocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTikgcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIGZvciAoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChpdGVyYWJsZSk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTspIHtcbiAgICByZXN1bHQgPSBjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKTtcbiAgICBpZiAocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTikgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTtcbmV4cG9ydHMuQlJFQUsgPSBCUkVBSztcbmV4cG9ydHMuUkVUVVJOID0gUkVUVVJOO1xuIiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07XG4iLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoIChlKSB7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIGFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcbiIsInZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFyZ2V0LCBzcmMsIHNhZmUpIHtcbiAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgIGlmIChzYWZlICYmIHRhcmdldFtrZXldKSB0YXJnZXRba2V5XSA9IHNyY1trZXldO1xuICAgIGVsc2UgaGlkZSh0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xuICB9IHJldHVybiB0YXJnZXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9wcm9wb3NhbC1zZXRtYXAtb2Zmcm9tL1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ09MTEVDVElPTikge1xuICAkZXhwb3J0KCRleHBvcnQuUywgQ09MTEVDVElPTiwgeyBmcm9tOiBmdW5jdGlvbiBmcm9tKHNvdXJjZSAvKiAsIG1hcEZuLCB0aGlzQXJnICovKSB7XG4gICAgdmFyIG1hcEZuID0gYXJndW1lbnRzWzFdO1xuICAgIHZhciBtYXBwaW5nLCBBLCBuLCBjYjtcbiAgICBhRnVuY3Rpb24odGhpcyk7XG4gICAgbWFwcGluZyA9IG1hcEZuICE9PSB1bmRlZmluZWQ7XG4gICAgaWYgKG1hcHBpbmcpIGFGdW5jdGlvbihtYXBGbik7XG4gICAgaWYgKHNvdXJjZSA9PSB1bmRlZmluZWQpIHJldHVybiBuZXcgdGhpcygpO1xuICAgIEEgPSBbXTtcbiAgICBpZiAobWFwcGluZykge1xuICAgICAgbiA9IDA7XG4gICAgICBjYiA9IGN0eChtYXBGbiwgYXJndW1lbnRzWzJdLCAyKTtcbiAgICAgIGZvck9mKHNvdXJjZSwgZmFsc2UsIGZ1bmN0aW9uIChuZXh0SXRlbSkge1xuICAgICAgICBBLnB1c2goY2IobmV4dEl0ZW0sIG4rKykpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvck9mKHNvdXJjZSwgZmFsc2UsIEEucHVzaCwgQSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgdGhpcyhBKTtcbiAgfSB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL3Byb3Bvc2FsLXNldG1hcC1vZmZyb20vXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDT0xMRUNUSU9OKSB7XG4gICRleHBvcnQoJGV4cG9ydC5TLCBDT0xMRUNUSU9OLCB7IG9mOiBmdW5jdGlvbiBvZigpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgQSA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIHdoaWxlIChsZW5ndGgtLSkgQVtsZW5ndGhdID0gYXJndW1lbnRzW2xlbmd0aF07XG4gICAgcmV0dXJuIG5ldyB0aGlzKEEpO1xuICB9IH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgdmFyIEMgPSB0eXBlb2YgY29yZVtLRVldID09ICdmdW5jdGlvbicgPyBjb3JlW0tFWV0gOiBnbG9iYWxbS0VZXTtcbiAgaWYgKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pIGRQLmYoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH1cbiAgfSk7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgVFlQRSkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSB8fCBpdC5fdCAhPT0gVFlQRSkgdGhyb3cgVHlwZUVycm9yKCdJbmNvbXBhdGlibGUgcmVjZWl2ZXIsICcgKyBUWVBFICsgJyByZXF1aXJlZCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgIT0gdW5kZWZpbmVkKSByZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZ2V0ID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBpdGVyRm4gPSBnZXQoaXQpO1xuICBpZiAodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgcmV0dXJuIGFuT2JqZWN0KGl0ZXJGbi5jYWxsKGl0KSk7XG59O1xuIiwiLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KSB7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodG9JT2JqZWN0KGl0KSwga2V5KTtcbiAgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tc3Ryb25nJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL192YWxpZGF0ZS1jb2xsZWN0aW9uJyk7XG52YXIgU0VUID0gJ1NldCc7XG5cbi8vIDIzLjIgU2V0IE9iamVjdHNcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKFNFVCwgZnVuY3Rpb24gKGdldCkge1xuICByZXR1cm4gZnVuY3Rpb24gU2V0KCkgeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodmFsaWRhdGUodGhpcywgU0VUKSwgdmFsdWUgPSB2YWx1ZSA9PT0gMCA/IDAgOiB2YWx1ZSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcpO1xuIiwiLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9wcm9wb3NhbC1zZXRtYXAtb2Zmcm9tLyNzZWMtc2V0LmZyb21cbnJlcXVpcmUoJy4vX3NldC1jb2xsZWN0aW9uLWZyb20nKSgnU2V0Jyk7XG4iLCIvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL3Byb3Bvc2FsLXNldG1hcC1vZmZyb20vI3NlYy1zZXQub2ZcbnJlcXVpcmUoJy4vX3NldC1jb2xsZWN0aW9uLW9mJykoJ1NldCcpO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LlIsICdTZXQnLCB7IHRvSlNPTjogcmVxdWlyZSgnLi9fY29sbGVjdGlvbi10by1qc29uJykoJ1NldCcpIH0pO1xuIiwiLyoqXG4gKiBUaGlzIGlzIHRoZSB3ZWIgYnJvd3NlciBpbXBsZW1lbnRhdGlvbiBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGVidWcnKTtcbmV4cG9ydHMubG9nID0gbG9nO1xuZXhwb3J0cy5mb3JtYXRBcmdzID0gZm9ybWF0QXJncztcbmV4cG9ydHMuc2F2ZSA9IHNhdmU7XG5leHBvcnRzLmxvYWQgPSBsb2FkO1xuZXhwb3J0cy51c2VDb2xvcnMgPSB1c2VDb2xvcnM7XG5leHBvcnRzLnN0b3JhZ2UgPSAndW5kZWZpbmVkJyAhPSB0eXBlb2YgY2hyb21lXG4gICAgICAgICAgICAgICAmJiAndW5kZWZpbmVkJyAhPSB0eXBlb2YgY2hyb21lLnN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgID8gY2hyb21lLnN0b3JhZ2UubG9jYWxcbiAgICAgICAgICAgICAgICAgIDogbG9jYWxzdG9yYWdlKCk7XG5cbi8qKlxuICogQ29sb3JzLlxuICovXG5cbmV4cG9ydHMuY29sb3JzID0gW1xuICAnbGlnaHRzZWFncmVlbicsXG4gICdmb3Jlc3RncmVlbicsXG4gICdnb2xkZW5yb2QnLFxuICAnZG9kZ2VyYmx1ZScsXG4gICdkYXJrb3JjaGlkJyxcbiAgJ2NyaW1zb24nXG5dO1xuXG4vKipcbiAqIEN1cnJlbnRseSBvbmx5IFdlYktpdC1iYXNlZCBXZWIgSW5zcGVjdG9ycywgRmlyZWZveCA+PSB2MzEsXG4gKiBhbmQgdGhlIEZpcmVidWcgZXh0ZW5zaW9uIChhbnkgRmlyZWZveCB2ZXJzaW9uKSBhcmUga25vd25cbiAqIHRvIHN1cHBvcnQgXCIlY1wiIENTUyBjdXN0b21pemF0aW9ucy5cbiAqXG4gKiBUT0RPOiBhZGQgYSBgbG9jYWxTdG9yYWdlYCB2YXJpYWJsZSB0byBleHBsaWNpdGx5IGVuYWJsZS9kaXNhYmxlIGNvbG9yc1xuICovXG5cbmZ1bmN0aW9uIHVzZUNvbG9ycygpIHtcbiAgLy8gTkI6IEluIGFuIEVsZWN0cm9uIHByZWxvYWQgc2NyaXB0LCBkb2N1bWVudCB3aWxsIGJlIGRlZmluZWQgYnV0IG5vdCBmdWxseVxuICAvLyBpbml0aWFsaXplZC4gU2luY2Ugd2Uga25vdyB3ZSdyZSBpbiBDaHJvbWUsIHdlJ2xsIGp1c3QgZGV0ZWN0IHRoaXMgY2FzZVxuICAvLyBleHBsaWNpdGx5XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucHJvY2VzcyAmJiB3aW5kb3cucHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBpcyB3ZWJraXQ/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE2NDU5NjA2LzM3Njc3M1xuICAvLyBkb2N1bWVudCBpcyB1bmRlZmluZWQgaW4gcmVhY3QtbmF0aXZlOiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QtbmF0aXZlL3B1bGwvMTYzMlxuICByZXR1cm4gKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuV2Via2l0QXBwZWFyYW5jZSkgfHxcbiAgICAvLyBpcyBmaXJlYnVnPyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zOTgxMjAvMzc2NzczXG4gICAgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5jb25zb2xlICYmICh3aW5kb3cuY29uc29sZS5maXJlYnVnIHx8ICh3aW5kb3cuY29uc29sZS5leGNlcHRpb24gJiYgd2luZG93LmNvbnNvbGUudGFibGUpKSkgfHxcbiAgICAvLyBpcyBmaXJlZm94ID49IHYzMT9cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1Rvb2xzL1dlYl9Db25zb2xlI1N0eWxpbmdfbWVzc2FnZXNcbiAgICAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2ZpcmVmb3hcXC8oXFxkKykvKSAmJiBwYXJzZUludChSZWdFeHAuJDEsIDEwKSA+PSAzMSkgfHxcbiAgICAvLyBkb3VibGUgY2hlY2sgd2Via2l0IGluIHVzZXJBZ2VudCBqdXN0IGluIGNhc2Ugd2UgYXJlIGluIGEgd29ya2VyXG4gICAgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9hcHBsZXdlYmtpdFxcLyhcXGQrKS8pKTtcbn1cblxuLyoqXG4gKiBNYXAgJWogdG8gYEpTT04uc3RyaW5naWZ5KClgLCBzaW5jZSBubyBXZWIgSW5zcGVjdG9ycyBkbyB0aGF0IGJ5IGRlZmF1bHQuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzLmogPSBmdW5jdGlvbih2KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHYpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gJ1tVbmV4cGVjdGVkSlNPTlBhcnNlRXJyb3JdOiAnICsgZXJyLm1lc3NhZ2U7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBDb2xvcml6ZSBsb2cgYXJndW1lbnRzIGlmIGVuYWJsZWQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKGFyZ3MpIHtcbiAgdmFyIHVzZUNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuXG4gIGFyZ3NbMF0gPSAodXNlQ29sb3JzID8gJyVjJyA6ICcnKVxuICAgICsgdGhpcy5uYW1lc3BhY2VcbiAgICArICh1c2VDb2xvcnMgPyAnICVjJyA6ICcgJylcbiAgICArIGFyZ3NbMF1cbiAgICArICh1c2VDb2xvcnMgPyAnJWMgJyA6ICcgJylcbiAgICArICcrJyArIGV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKTtcblxuICBpZiAoIXVzZUNvbG9ycykgcmV0dXJuO1xuXG4gIHZhciBjID0gJ2NvbG9yOiAnICsgdGhpcy5jb2xvcjtcbiAgYXJncy5zcGxpY2UoMSwgMCwgYywgJ2NvbG9yOiBpbmhlcml0JylcblxuICAvLyB0aGUgZmluYWwgXCIlY1wiIGlzIHNvbWV3aGF0IHRyaWNreSwgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBvdGhlclxuICAvLyBhcmd1bWVudHMgcGFzc2VkIGVpdGhlciBiZWZvcmUgb3IgYWZ0ZXIgdGhlICVjLCBzbyB3ZSBuZWVkIHRvXG4gIC8vIGZpZ3VyZSBvdXQgdGhlIGNvcnJlY3QgaW5kZXggdG8gaW5zZXJ0IHRoZSBDU1MgaW50b1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgbGFzdEMgPSAwO1xuICBhcmdzWzBdLnJlcGxhY2UoLyVbYS16QS1aJV0vZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICBpZiAoJyUlJyA9PT0gbWF0Y2gpIHJldHVybjtcbiAgICBpbmRleCsrO1xuICAgIGlmICgnJWMnID09PSBtYXRjaCkge1xuICAgICAgLy8gd2Ugb25seSBhcmUgaW50ZXJlc3RlZCBpbiB0aGUgKmxhc3QqICVjXG4gICAgICAvLyAodGhlIHVzZXIgbWF5IGhhdmUgcHJvdmlkZWQgdGhlaXIgb3duKVxuICAgICAgbGFzdEMgPSBpbmRleDtcbiAgICB9XG4gIH0pO1xuXG4gIGFyZ3Muc3BsaWNlKGxhc3RDLCAwLCBjKTtcbn1cblxuLyoqXG4gKiBJbnZva2VzIGBjb25zb2xlLmxvZygpYCB3aGVuIGF2YWlsYWJsZS5cbiAqIE5vLW9wIHdoZW4gYGNvbnNvbGUubG9nYCBpcyBub3QgYSBcImZ1bmN0aW9uXCIuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBsb2coKSB7XG4gIC8vIHRoaXMgaGFja2VyeSBpcyByZXF1aXJlZCBmb3IgSUU4LzksIHdoZXJlXG4gIC8vIHRoZSBgY29uc29sZS5sb2dgIGZ1bmN0aW9uIGRvZXNuJ3QgaGF2ZSAnYXBwbHknXG4gIHJldHVybiAnb2JqZWN0JyA9PT0gdHlwZW9mIGNvbnNvbGVcbiAgICAmJiBjb25zb2xlLmxvZ1xuICAgICYmIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGUubG9nLCBjb25zb2xlLCBhcmd1bWVudHMpO1xufVxuXG4vKipcbiAqIFNhdmUgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzYXZlKG5hbWVzcGFjZXMpIHtcbiAgdHJ5IHtcbiAgICBpZiAobnVsbCA9PSBuYW1lc3BhY2VzKSB7XG4gICAgICBleHBvcnRzLnN0b3JhZ2UucmVtb3ZlSXRlbSgnZGVidWcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5zdG9yYWdlLmRlYnVnID0gbmFtZXNwYWNlcztcbiAgICB9XG4gIH0gY2F0Y2goZSkge31cbn1cblxuLyoqXG4gKiBMb2FkIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJldHVybnMgdGhlIHByZXZpb3VzbHkgcGVyc2lzdGVkIGRlYnVnIG1vZGVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2FkKCkge1xuICB2YXIgcjtcbiAgdHJ5IHtcbiAgICByID0gZXhwb3J0cy5zdG9yYWdlLmRlYnVnO1xuICB9IGNhdGNoKGUpIHt9XG5cbiAgLy8gSWYgZGVidWcgaXNuJ3Qgc2V0IGluIExTLCBhbmQgd2UncmUgaW4gRWxlY3Ryb24sIHRyeSB0byBsb2FkICRERUJVR1xuICBpZiAoIXIgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmICdlbnYnIGluIHByb2Nlc3MpIHtcbiAgICByID0gcHJvY2Vzcy5lbnYuREVCVUc7XG4gIH1cblxuICByZXR1cm4gcjtcbn1cblxuLyoqXG4gKiBFbmFibGUgbmFtZXNwYWNlcyBsaXN0ZWQgaW4gYGxvY2FsU3RvcmFnZS5kZWJ1Z2AgaW5pdGlhbGx5LlxuICovXG5cbmV4cG9ydHMuZW5hYmxlKGxvYWQoKSk7XG5cbi8qKlxuICogTG9jYWxzdG9yYWdlIGF0dGVtcHRzIHRvIHJldHVybiB0aGUgbG9jYWxzdG9yYWdlLlxuICpcbiAqIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugc2FmYXJpIHRocm93c1xuICogd2hlbiBhIHVzZXIgZGlzYWJsZXMgY29va2llcy9sb2NhbHN0b3JhZ2VcbiAqIGFuZCB5b3UgYXR0ZW1wdCB0byBhY2Nlc3MgaXQuXG4gKlxuICogQHJldHVybiB7TG9jYWxTdG9yYWdlfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9jYWxzdG9yYWdlKCkge1xuICB0cnkge1xuICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICB9IGNhdGNoIChlKSB7fVxufVxuIiwiXG4vKipcbiAqIFRoaXMgaXMgdGhlIGNvbW1vbiBsb2dpYyBmb3IgYm90aCB0aGUgTm9kZS5qcyBhbmQgd2ViIGJyb3dzZXJcbiAqIGltcGxlbWVudGF0aW9ucyBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZURlYnVnLmRlYnVnID0gY3JlYXRlRGVidWdbJ2RlZmF1bHQnXSA9IGNyZWF0ZURlYnVnO1xuZXhwb3J0cy5jb2VyY2UgPSBjb2VyY2U7XG5leHBvcnRzLmRpc2FibGUgPSBkaXNhYmxlO1xuZXhwb3J0cy5lbmFibGUgPSBlbmFibGU7XG5leHBvcnRzLmVuYWJsZWQgPSBlbmFibGVkO1xuZXhwb3J0cy5odW1hbml6ZSA9IHJlcXVpcmUoJ21zJyk7XG5cbi8qKlxuICogVGhlIGN1cnJlbnRseSBhY3RpdmUgZGVidWcgbW9kZSBuYW1lcywgYW5kIG5hbWVzIHRvIHNraXAuXG4gKi9cblxuZXhwb3J0cy5uYW1lcyA9IFtdO1xuZXhwb3J0cy5za2lwcyA9IFtdO1xuXG4vKipcbiAqIE1hcCBvZiBzcGVjaWFsIFwiJW5cIiBoYW5kbGluZyBmdW5jdGlvbnMsIGZvciB0aGUgZGVidWcgXCJmb3JtYXRcIiBhcmd1bWVudC5cbiAqXG4gKiBWYWxpZCBrZXkgbmFtZXMgYXJlIGEgc2luZ2xlLCBsb3dlciBvciB1cHBlci1jYXNlIGxldHRlciwgaS5lLiBcIm5cIiBhbmQgXCJOXCIuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzID0ge307XG5cbi8qKlxuICogUHJldmlvdXMgbG9nIHRpbWVzdGFtcC5cbiAqL1xuXG52YXIgcHJldlRpbWU7XG5cbi8qKlxuICogU2VsZWN0IGEgY29sb3IuXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzZWxlY3RDb2xvcihuYW1lc3BhY2UpIHtcbiAgdmFyIGhhc2ggPSAwLCBpO1xuXG4gIGZvciAoaSBpbiBuYW1lc3BhY2UpIHtcbiAgICBoYXNoICA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgbmFtZXNwYWNlLmNoYXJDb2RlQXQoaSk7XG4gICAgaGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgfVxuXG4gIHJldHVybiBleHBvcnRzLmNvbG9yc1tNYXRoLmFicyhoYXNoKSAlIGV4cG9ydHMuY29sb3JzLmxlbmd0aF07XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVidWdnZXIgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVzcGFjZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZURlYnVnKG5hbWVzcGFjZSkge1xuXG4gIGZ1bmN0aW9uIGRlYnVnKCkge1xuICAgIC8vIGRpc2FibGVkP1xuICAgIGlmICghZGVidWcuZW5hYmxlZCkgcmV0dXJuO1xuXG4gICAgdmFyIHNlbGYgPSBkZWJ1ZztcblxuICAgIC8vIHNldCBgZGlmZmAgdGltZXN0YW1wXG4gICAgdmFyIGN1cnIgPSArbmV3IERhdGUoKTtcbiAgICB2YXIgbXMgPSBjdXJyIC0gKHByZXZUaW1lIHx8IGN1cnIpO1xuICAgIHNlbGYuZGlmZiA9IG1zO1xuICAgIHNlbGYucHJldiA9IHByZXZUaW1lO1xuICAgIHNlbGYuY3VyciA9IGN1cnI7XG4gICAgcHJldlRpbWUgPSBjdXJyO1xuXG4gICAgLy8gdHVybiB0aGUgYGFyZ3VtZW50c2AgaW50byBhIHByb3BlciBBcnJheVxuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG5cbiAgICBhcmdzWzBdID0gZXhwb3J0cy5jb2VyY2UoYXJnc1swXSk7XG5cbiAgICBpZiAoJ3N0cmluZycgIT09IHR5cGVvZiBhcmdzWzBdKSB7XG4gICAgICAvLyBhbnl0aGluZyBlbHNlIGxldCdzIGluc3BlY3Qgd2l0aCAlT1xuICAgICAgYXJncy51bnNoaWZ0KCclTycpO1xuICAgIH1cblxuICAgIC8vIGFwcGx5IGFueSBgZm9ybWF0dGVyc2AgdHJhbnNmb3JtYXRpb25zXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICBhcmdzWzBdID0gYXJnc1swXS5yZXBsYWNlKC8lKFthLXpBLVolXSkvZywgZnVuY3Rpb24obWF0Y2gsIGZvcm1hdCkge1xuICAgICAgLy8gaWYgd2UgZW5jb3VudGVyIGFuIGVzY2FwZWQgJSB0aGVuIGRvbid0IGluY3JlYXNlIHRoZSBhcnJheSBpbmRleFxuICAgICAgaWYgKG1hdGNoID09PSAnJSUnKSByZXR1cm4gbWF0Y2g7XG4gICAgICBpbmRleCsrO1xuICAgICAgdmFyIGZvcm1hdHRlciA9IGV4cG9ydHMuZm9ybWF0dGVyc1tmb3JtYXRdO1xuICAgICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBmb3JtYXR0ZXIpIHtcbiAgICAgICAgdmFyIHZhbCA9IGFyZ3NbaW5kZXhdO1xuICAgICAgICBtYXRjaCA9IGZvcm1hdHRlci5jYWxsKHNlbGYsIHZhbCk7XG5cbiAgICAgICAgLy8gbm93IHdlIG5lZWQgdG8gcmVtb3ZlIGBhcmdzW2luZGV4XWAgc2luY2UgaXQncyBpbmxpbmVkIGluIHRoZSBgZm9ybWF0YFxuICAgICAgICBhcmdzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGluZGV4LS07XG4gICAgICB9XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG5cbiAgICAvLyBhcHBseSBlbnYtc3BlY2lmaWMgZm9ybWF0dGluZyAoY29sb3JzLCBldGMuKVxuICAgIGV4cG9ydHMuZm9ybWF0QXJncy5jYWxsKHNlbGYsIGFyZ3MpO1xuXG4gICAgdmFyIGxvZ0ZuID0gZGVidWcubG9nIHx8IGV4cG9ydHMubG9nIHx8IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG4gICAgbG9nRm4uYXBwbHkoc2VsZiwgYXJncyk7XG4gIH1cblxuICBkZWJ1Zy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG4gIGRlYnVnLmVuYWJsZWQgPSBleHBvcnRzLmVuYWJsZWQobmFtZXNwYWNlKTtcbiAgZGVidWcudXNlQ29sb3JzID0gZXhwb3J0cy51c2VDb2xvcnMoKTtcbiAgZGVidWcuY29sb3IgPSBzZWxlY3RDb2xvcihuYW1lc3BhY2UpO1xuXG4gIC8vIGVudi1zcGVjaWZpYyBpbml0aWFsaXphdGlvbiBsb2dpYyBmb3IgZGVidWcgaW5zdGFuY2VzXG4gIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZXhwb3J0cy5pbml0KSB7XG4gICAgZXhwb3J0cy5pbml0KGRlYnVnKTtcbiAgfVxuXG4gIHJldHVybiBkZWJ1Zztcbn1cblxuLyoqXG4gKiBFbmFibGVzIGEgZGVidWcgbW9kZSBieSBuYW1lc3BhY2VzLiBUaGlzIGNhbiBpbmNsdWRlIG1vZGVzXG4gKiBzZXBhcmF0ZWQgYnkgYSBjb2xvbiBhbmQgd2lsZGNhcmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGVuYWJsZShuYW1lc3BhY2VzKSB7XG4gIGV4cG9ydHMuc2F2ZShuYW1lc3BhY2VzKTtcblxuICBleHBvcnRzLm5hbWVzID0gW107XG4gIGV4cG9ydHMuc2tpcHMgPSBbXTtcblxuICB2YXIgc3BsaXQgPSAodHlwZW9mIG5hbWVzcGFjZXMgPT09ICdzdHJpbmcnID8gbmFtZXNwYWNlcyA6ICcnKS5zcGxpdCgvW1xccyxdKy8pO1xuICB2YXIgbGVuID0gc3BsaXQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoIXNwbGl0W2ldKSBjb250aW51ZTsgLy8gaWdub3JlIGVtcHR5IHN0cmluZ3NcbiAgICBuYW1lc3BhY2VzID0gc3BsaXRbaV0ucmVwbGFjZSgvXFwqL2csICcuKj8nKTtcbiAgICBpZiAobmFtZXNwYWNlc1swXSA9PT0gJy0nKSB7XG4gICAgICBleHBvcnRzLnNraXBzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzLnN1YnN0cigxKSArICckJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBleHBvcnRzLm5hbWVzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzICsgJyQnKSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRGlzYWJsZSBkZWJ1ZyBvdXRwdXQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkaXNhYmxlKCkge1xuICBleHBvcnRzLmVuYWJsZSgnJyk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBtb2RlIG5hbWUgaXMgZW5hYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBlbmFibGVkKG5hbWUpIHtcbiAgdmFyIGksIGxlbjtcbiAgZm9yIChpID0gMCwgbGVuID0gZXhwb3J0cy5za2lwcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChleHBvcnRzLnNraXBzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgZm9yIChpID0gMCwgbGVuID0gZXhwb3J0cy5uYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChleHBvcnRzLm5hbWVzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ29lcmNlIGB2YWxgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBjb2VyY2UodmFsKSB7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBFcnJvcikgcmV0dXJuIHZhbC5zdGFjayB8fCB2YWwubWVzc2FnZTtcbiAgcmV0dXJuIHZhbDtcbn1cbiIsIi8qKlxuICogSGVscGVycy5cbiAqL1xuXG52YXIgcyA9IDEwMDA7XG52YXIgbSA9IHMgKiA2MDtcbnZhciBoID0gbSAqIDYwO1xudmFyIGQgPSBoICogMjQ7XG52YXIgeSA9IGQgKiAzNjUuMjU7XG5cbi8qKlxuICogUGFyc2Ugb3IgZm9ybWF0IHRoZSBnaXZlbiBgdmFsYC5cbiAqXG4gKiBPcHRpb25zOlxuICpcbiAqICAtIGBsb25nYCB2ZXJib3NlIGZvcm1hdHRpbmcgW2ZhbHNlXVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gdmFsXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAdGhyb3dzIHtFcnJvcn0gdGhyb3cgYW4gZXJyb3IgaWYgdmFsIGlzIG5vdCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSBudW1iZXJcbiAqIEByZXR1cm4ge1N0cmluZ3xOdW1iZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odmFsLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWw7XG4gIGlmICh0eXBlID09PSAnc3RyaW5nJyAmJiB2YWwubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBwYXJzZSh2YWwpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmIGlzTmFOKHZhbCkgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMubG9uZyA/IGZtdExvbmcodmFsKSA6IGZtdFNob3J0KHZhbCk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICd2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIHZhbGlkIG51bWJlci4gdmFsPScgK1xuICAgICAgSlNPTi5zdHJpbmdpZnkodmFsKVxuICApO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYHN0cmAgYW5kIHJldHVybiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2Uoc3RyKSB7XG4gIHN0ciA9IFN0cmluZyhzdHIpO1xuICBpZiAoc3RyLmxlbmd0aCA+IDEwMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbWF0Y2ggPSAvXigoPzpcXGQrKT9cXC4/XFxkKykgKihtaWxsaXNlY29uZHM/fG1zZWNzP3xtc3xzZWNvbmRzP3xzZWNzP3xzfG1pbnV0ZXM/fG1pbnM/fG18aG91cnM/fGhycz98aHxkYXlzP3xkfHllYXJzP3x5cnM/fHkpPyQvaS5leGVjKFxuICAgIHN0clxuICApO1xuICBpZiAoIW1hdGNoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuID0gcGFyc2VGbG9hdChtYXRjaFsxXSk7XG4gIHZhciB0eXBlID0gKG1hdGNoWzJdIHx8ICdtcycpLnRvTG93ZXJDYXNlKCk7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3llYXJzJzpcbiAgICBjYXNlICd5ZWFyJzpcbiAgICBjYXNlICd5cnMnOlxuICAgIGNhc2UgJ3lyJzpcbiAgICBjYXNlICd5JzpcbiAgICAgIHJldHVybiBuICogeTtcbiAgICBjYXNlICdkYXlzJzpcbiAgICBjYXNlICdkYXknOlxuICAgIGNhc2UgJ2QnOlxuICAgICAgcmV0dXJuIG4gKiBkO1xuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdob3VyJzpcbiAgICBjYXNlICdocnMnOlxuICAgIGNhc2UgJ2hyJzpcbiAgICBjYXNlICdoJzpcbiAgICAgIHJldHVybiBuICogaDtcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdtaW51dGUnOlxuICAgIGNhc2UgJ21pbnMnOlxuICAgIGNhc2UgJ21pbic6XG4gICAgY2FzZSAnbSc6XG4gICAgICByZXR1cm4gbiAqIG07XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnc2Vjb25kJzpcbiAgICBjYXNlICdzZWNzJzpcbiAgICBjYXNlICdzZWMnOlxuICAgIGNhc2UgJ3MnOlxuICAgICAgcmV0dXJuIG4gKiBzO1xuICAgIGNhc2UgJ21pbGxpc2Vjb25kcyc6XG4gICAgY2FzZSAnbWlsbGlzZWNvbmQnOlxuICAgIGNhc2UgJ21zZWNzJzpcbiAgICBjYXNlICdtc2VjJzpcbiAgICBjYXNlICdtcyc6XG4gICAgICByZXR1cm4gbjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIFNob3J0IGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGZtdFNob3J0KG1zKSB7XG4gIGlmIChtcyA+PSBkKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBkKSArICdkJztcbiAgfVxuICBpZiAobXMgPj0gaCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gaCkgKyAnaCc7XG4gIH1cbiAgaWYgKG1zID49IG0pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIG0pICsgJ20nO1xuICB9XG4gIGlmIChtcyA+PSBzKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBzKSArICdzJztcbiAgfVxuICByZXR1cm4gbXMgKyAnbXMnO1xufVxuXG4vKipcbiAqIExvbmcgZm9ybWF0IGZvciBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZm10TG9uZyhtcykge1xuICByZXR1cm4gcGx1cmFsKG1zLCBkLCAnZGF5JykgfHxcbiAgICBwbHVyYWwobXMsIGgsICdob3VyJykgfHxcbiAgICBwbHVyYWwobXMsIG0sICdtaW51dGUnKSB8fFxuICAgIHBsdXJhbChtcywgcywgJ3NlY29uZCcpIHx8XG4gICAgbXMgKyAnIG1zJztcbn1cblxuLyoqXG4gKiBQbHVyYWxpemF0aW9uIGhlbHBlci5cbiAqL1xuXG5mdW5jdGlvbiBwbHVyYWwobXMsIG4sIG5hbWUpIHtcbiAgaWYgKG1zIDwgbikge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAobXMgPCBuICogMS41KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IobXMgLyBuKSArICcgJyArIG5hbWU7XG4gIH1cbiAgcmV0dXJuIE1hdGguY2VpbChtcyAvIG4pICsgJyAnICsgbmFtZSArICdzJztcbn1cbiJdfQ==
