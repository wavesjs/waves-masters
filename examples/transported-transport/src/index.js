import * as masters from 'waves-masters';
import * as controllers from '@ircam/basic-controllers';
import PositionDisplay from './PositionDisplay';

controllers.setTheme('dark');

class BeatEngine extends masters.TimeEngine {
  constructor() {
    super();
  }

  syncPosition(time, position, speed) {
    console.log(this);
    console.log('syncPosition', time, position, speed);
    let nextPosition = Infinity;

    if (this.triggerPosition !== null) {
      if (speed > 0) {
        nextPosition = Math.ceil(position);
      } else if (speed < 0) {
        nextPosition = Math.floor(position);
      }
    }

    return nextPosition;
  }

  advancePosition(time, position, speed) {
    console.log('beat engine', position);
    position += speed > 0 ? 1 : -1;

    return position;
  }
}

const scheduler = new masters.Scheduler(() => performance.now() / 1000);
const transport = new masters.Transport(scheduler);
const transportedTransport = new masters.Transport(scheduler);
const playControl = new masters.PlayControl(scheduler, transport);

const beatEngine = new BeatEngine();
transportedTransport.add(beatEngine);

const transportedTransported = transport.add(transportedTransport);

// controls
const $playControl = new controllers.SelectButtons({
  label: '&nbsp;',
  options: ['start', 'pause', 'stop'],
  default: 'stop',
  container: '.controllers',
  callback: value => playControl[value](),
});

// display current position
const $positionDisplay = new controllers.Slider({
  label: 'position',
  min: 0,
  max: 20,
  step: 0.01,
  default: 0,
  size: 'large',
  container: '.controllers',
  callback: value => playControl.seek(value),
});

const positionDisplay = new PositionDisplay($positionDisplay);
transport.add(positionDisplay);

playControl.setLoopBoundaries(0, 20);
playControl.loop = true;

const $startBoundary = new controllers.NumberBox({
  label: 'transported start',
  min: 0,
  max: 10,
  step: 0.01,
  default: 0,
  container: '.controllers',
  callback: updateBoudaries,
});

const $durationBoundary = new controllers.NumberBox({
  label: 'transported duration',
  min: 0,
  max: 10,
  step: 0.01,
  default: 10,
  size: 'large',
  container: '.controllers',
  callback: updateBoudaries,
});

const $offsetBoundary = new controllers.NumberBox({
  label: 'transported offset',
  min: -10,
  max: 10,
  step: 0.01,
  default: 0,
  container: '.controllers',
  callback: updateBoudaries,
});

function updateBoudaries() {
  const start = $startBoundary.value;
  const duration = $durationBoundary.value;
  const offset = $offsetBoundary.value;

  console.log('start', start, '- duration', duration, '- offset', offset);
  transportedTransported.setBoundaries(start, duration, offset);
}



