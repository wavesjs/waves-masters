import debug from 'debug';
import SchedulingQueue from '../core/SchedulingQueue';

const log = debug('wavesjs:masters');

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
class Scheduler extends SchedulingQueue {
  constructor(getTimeFunction, options = {}) {
    super();

    if (!isFunction(getTimeFunction))
      throw new Error('Invalid argument `getTimeFunction`');

    this.getTimeFunction = getTimeFunction;

    this.__currentTime = null;
    this.__nextTime = Infinity;
    this.__timeout = null;

    /**
     * scheduler (setTimeout) period
     * @type {Number}
     * @name period
     * @memberof Scheduler
     * @instance
     */
    this.period = options.period ||  0.025;

    /**
     * scheduler lookahead time (> period)
     * @type {Number}
     * @name lookahead
     * @memberof Scheduler
     * @instance
     */
    this.lookahead = options.lookahead ||  0.1;
  }

  // setTimeout scheduling loop
  __tick() {
    const currentTime = this.getTimeFunction();
    let time = this.__nextTime;

    this.__timeout = null;

    while (time <= currentTime + this.lookahead) {
      this.__currentTime = time;
      time = this.advanceTime(time);
    }

    this.__currentTime = null;
    this.resetTime(time);
  }

  resetTime(time = this.currentTime) {
    if (this.master) {
      this.master.reset(this, time);
    } else {
      if (this.__timeout) {
        clearTimeout(this.__timeout);
        this.__timeout = null;
      }

      if (time !== Infinity) {
        if (this.__nextTime === Infinity)
          log('Scheduler Start');

        const timeOutDelay = Math.max((time - this.lookahead - this.getTimeFunction()), this.period);

        this.__timeout = setTimeout(() => {
          this.__tick();
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
  get currentTime() {
    if (this.master)
      return this.master.currentTime;

    return this.__currentTime || this.getTimeFunction() + this.lookahead;
  }

  get currentPosition() {
    const master = this.master;

    if (master && master.currentPosition !== undefined)
      return master.currentPosition;

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
}

export default Scheduler;
