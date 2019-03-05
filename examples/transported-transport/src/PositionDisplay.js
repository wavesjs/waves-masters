import * as masters from 'waves-masters';

class PositionDisplay extends masters.TimeEngine {
  constructor($slider) {
    super();

    this.$slider = $slider;
    this.period = 0.05;
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

export default PositionDisplay;
