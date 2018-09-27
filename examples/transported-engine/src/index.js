import * as masters from 'waves-masters';
import * as controllers from '@ircam/basic-controllers';
import PositionDisplay from './PositionDisplay';

class TransportEngine extends masters.TimeEngine {
  constructor() {
    super();

    this.triggerPosition = null;
  }

  syncPosition(time, position, speed) {
    console.log('> TransportEngine::syncPosition', time, position, speed);

    // don't trigger in the past
    if (position > this.triggerPosition) {
      this.triggerPosition = null;
    }

    let nextPosition = Infinity;

    if (this.triggerPosition !== null) {
      nextPosition = this.triggerPosition;
    }

    console.log('> TransportEngine::nextPosition', nextPosition);
    return nextPosition;
  }

  advancePosition(time, position, speed) {
    console.log('> TransportEngine::advancePosition', time, position, speed);
    console.log('triggerPosition', position, this.triggerPosition);

    this.triggerPosition = null;
    return Infinity;
  }
}

const scheduler = new masters.Scheduler(() => performance.now() / 1000);
const transport = new masters.Transport(scheduler);
const playControl = new masters.PlayControl(scheduler, transport);

const engine = new TransportEngine();
const transported = transport.add(engine);

// controls
const $playControl = new controllers.SelectButtons({
  label: '&nbsp;',
  options: ['start', 'pause', 'stop'],
  default: 'stop',
  container: '.controllers',
  callback: value => playControl[value](),
});

const $triggerPositions = new controllers.SelectButtons({
  label: 'trigger',
  options: [2, 4, 6, 8, 10],
  container: '.controllers',
  callback: value => {
    console.log('should trigger event at', value);
    engine.triggerPosition = value;
    transport.resetEnginePosition(transported, value);
  }
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

// const positionDisplay = new PositionDisplay($positionDisplay);
// transport.add(positionDisplay);

playControl.setLoopBoundaries(0, 20);
playControl.loop = true;
