import debug from 'debug';
import TimeEngine from '../core/TimeEngine';

const log = debug('wavesjs:masters');

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
 * {@link https://rawgit.com/wavesjs/waves-masters/master/examples/scheduler}
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
class SimpleScheduler {
  constructor(getTimeFunction, options = {}) {
    if (!isFunction(getTimeFunction))
      throw new Error('Invalid argument `getTimeFunction`');

    this.getTimeFunction = getTimeFunction;

    this.__engines = new Set();

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
  }

  __scheduleEngine(engine, time) {
    this.__schedEngines.push(engine);
    this.__schedTimes.push(time);
  }

  __rescheduleEngine(engine, time) {
    const index = this.__schedEngines.indexOf(engine);

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

  __unscheduleEngine(engine) {
    const index = this.__schedEngines.indexOf(engine);

    if (index >= 0) {
      this.__schedEngines.splice(index, 1);
      this.__schedTimes.splice(index, 1);
    }
  }

  __resetTick() {
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

  __tick() {
    const currentTime = this.getTimeFunction();
    let i = 0;

    while (i < this.__schedEngines.length) {
      const engine = this.__schedEngines[i];
      let time = this.__schedTimes[i];

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
      this.__timeout = setTimeout(() => {
        this.__tick();
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
  get currentTime() {
    return this.__currentTime || this.getTimeFunction() + this.lookahead;
  }

  get currentPosition() {
    return undefined;
  }

  // call a function at a given time
  /**
   * Defer the execution of a function at a given time.
   *
   * @param {Function} fun - Function to defer
   * @param {Number} [time=this.currentTime] - Schedule time
   */
  defer(fun, time = this.currentTime) {
    if (!(fun instanceof Function))
      throw new Error("object cannot be defered by scheduler");

    this.add({
      advanceTime: function(time) { fun(time); }, // make sur that the advanceTime method does not returm anything
    }, time);
  }

  /**
   * Add a TimeEngine function to the scheduler at an optionally given time.
   *
   * @param {TimeEngine} engine - Engine to add to the scheduler
   * @param {Number} [time=this.currentTime] - Schedule time
   */
  add(engine, time = this.currentTime) {
    if (!TimeEngine.implementsScheduled(engine))
      throw new Error("object cannot be added to scheduler");

    if (engine.master)
      throw new Error("object has already been added to a master");

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
  remove(engine) {
    if (!engine.master || engine.master !== this)
      throw new Error("engine has not been added to this scheduler");

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
  resetEngineTime(engine, time = this.currentTime) {
    this.__rescheduleEngine(engine, time);
    this.__resetTick();
  }

  /**
   * Check whether a given engine is scheduled.
   *
   * @param {TimeEngine} engine - Engine to check
   */
  has(engine) {
    return this.__engines.has(engine);
  }

  /**
   * Remove all engines from the scheduler.
   */
  clear() {
    if (this.__timeout) {
      clearTimeout(this.__timeout);
      this.__timeout = null;
    }

    this.__schedEngines.length = 0;
    this.__schedTimes.length = 0;
  }
}

export default SimpleScheduler;
