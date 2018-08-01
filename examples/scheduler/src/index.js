import * as masters from 'waves-masters';
import * as controllers from '@ircam/basic-controllers';

localStorage.debug = 'wavesjs:masters';

class Metro extends masters.TimeEngine {
  constructor(period = 1) {
    super();

    this.period = period;
    this.$log = document.querySelector('.example');
  }

  advanceTime(time) {
    // `time` is a logical time at which the event should be scheduled
    // advance according to the lookahead of the scheduler
    const now = performance.now() / 1000;
    const dt = time - now;
    const log = `> time: ${time} (called ${dt}s in advance)`;

    console.log(log);
    this.$log.textContent = log;

    return time + this.period;
  }
}

const getTimeFunction = () => performance.now() / 1000; // get time in sec.
const scheduler = new masters.Scheduler(getTimeFunction);
const simpleScheduler = new masters.SimpleScheduler(getTimeFunction);

const ticker = new Metro();

const $schedulerToggle = new controllers.Toggle({
  label: 'scheduler - start / stop',
  container: '.controllers',
  callback: value => {
    if (value)
      scheduler.add(ticker, Math.ceil(scheduler.currentTime));
    else
      scheduler.remove(ticker);
  }
});

const $simpleSchedulerToggle = new controllers.Toggle({
  label: 'simple scheduler - start / stop',
  container: '.controllers',
  callback: value => {
    if (value)
      simpleScheduler.add(ticker, Math.ceil(scheduler.currentTime));
    else
      simpleScheduler.remove(ticker);
  }
});
