import * as masters from 'waves-masters';
import * as controllers from '@ircam/basic-controllers';
import PositionDisplay from './PositionDisplay';

controllers.setTheme('dark');

class EventEngine extends masters.TimeEngine {
  constructor() {
    super();

    this.triggerPosition = null;
  }

  syncPosition(time, position, speed) {
    console.log('> EventEngine::syncPosition', time, position, speed);

    let nextPosition = Infinity;

    if (this.triggerPosition !== null) {
      if (speed > 0 && this.triggerPosition > position) {
        nextPosition = this.triggerPosition;
      } else if (speed < 0 && this.triggerPosition < position) {
        nextPosition = this.triggerPosition;
      }
    }

    console.log('> EventEngine::scheduleNextPositionAt', nextPosition);
    return nextPosition;
  }

  advancePosition(time, position, speed) {
    console.log('> EventEngine::advancePosition', time, position, speed);
    console.log('triggerPosition', position, this.triggerPosition);

    return Infinity;
  }
}

const scheduler = new masters.Scheduler(() => performance.now() / 1000);
const transport = new masters.Transport(scheduler);
const playControl = new masters.PlayControl(scheduler, transport);

const eventEngine = new EventEngine();
transport.add(eventEngine);

// controls
const $playControl = new controllers.SelectButtons({
  label: '&nbsp;',
  options: ['start', 'pause', 'stop'],
  default: 'stop',
  container: '.controllers',
  callback: value => playControl[value](),
});

const $triggerPositions = new controllers.TriggerButtons({
  label: 'trigger event at',
  options: [2, 4, 6, 8, 10],
  container: '.controllers',
  callback: value => {
    console.log('should trigger event at', value);
    eventEngine.triggerPosition = value;
    transport.resetEnginePosition(eventEngine, value);
  }
});

// display current position
const $positionDisplay = new controllers.Slider({
  label: 'position',
  min: 0,
  max: 12,
  step: 0.01,
  default: 0,
  size: 'large',
  container: '.controllers',
  callback: value => playControl.seek(value),
});

const positionDisplay = new PositionDisplay($positionDisplay);
transport.add(positionDisplay);

playControl.setLoopBoundaries(0, 12);
playControl.loop = true;

const $loopStart = new controllers.NumberBox({
  label: 'loop start',
  min: 0,
  max: 12,
  step: 0.01,
  default: 0,
  container: '.controllers',
  callback: value => playControl.loopStart = value,
});

const $loopEnd = new controllers.NumberBox({
  label: 'loop end',
  min: 0,
  max: 12,
  step: 0.01,
  default: 12,
  container: '.controllers',
  callback: value => playControl.loopEnd = value,
});

const $speed = new controllers.Slider({
  label: 'speed',
  min: -1,
  max: 1,
  step: 0.01,
  default: 1,
  size: 'large',
  container: '.controllers',
  callback: value => playControl.speed = value,
});
