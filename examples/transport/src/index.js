import * as masters from 'waves-masters';
import * as controllers from '@ircam/basic-controllers';

class PositionDisplay extends masters.TimeEngine {
  constructor($slider) {
    super();

    this.$slider = $slider;
    this.period = 0.02;
  }

  syncPosition(time, position, speed) {
    let nextPosition = Math.floor(position / this.period) * this.period;

    if (speed > 0 && nextPosition < position)
      nextPosition += this.period;
    else if (speed < 0 && nextPosition > position)
      nextPosition -= this.period;

    this.$slider.value = position.toFixed(2);

    return nextPosition;
  }

  advancePosition(time, position, speed) {
    this.$slider.value = position.toFixed(2);

    if (speed < 0)
      return position - this.period;
    else
      return position + this.period;
  }
}

const getTimeFunction = () => performance.now() / 1000;
const scheduler = new masters.Scheduler(getTimeFunction);
const transport = new masters.Transport(scheduler);
const playControl = new masters.PlayControl(scheduler, transport);

const $slider = new controllers.Slider({
  label: 'position',
  min: 0,
  max: 10,
  step: 0.01,
  default: 0,
  size: 'large',
  container: '.controllers',
  callback: value => playControl.seek(value),
});

new controllers.SelectButtons({
  label: '&nbsp;',
  options: ['start', 'pause', 'stop'],
  default: 'stop',
  container: '.controllers',
  callback: value => playControl[value](),
});

new controllers.Slider({
  label: 'speed',
  min: -1,
  max: 1,
  default: 1,
  size: 'large',
  container: '.controllers',
  callback: value => playControl.speed = value,
});


const positionDisplay = new PositionDisplay($slider);
transport.add(positionDisplay);

playControl.setLoopBoundaries(0, 10);
playControl.loop = true;
