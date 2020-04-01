# `waves-masters`

> Low level components for transport and scheduling

_note: while implemented toward WebAudio applications, `waves-masters` components can be used in any contexts as they can use arbitrary clocks._

## Documentation

[http://wavesjs.github.io/waves-masters/](http://wavesjs.github.io/waves-masters/)

## Installation

```sh
npm install [--save] waves-masters
```

## Usage

```js
// explicit default export
import masters from 'waves-masters';
// or named exports
import { Scheduler } from 'waves-masters';

// create the scheduler with an arbitrary clock
const getTime = () => new Date().getTime();
const scheduler = new Scheduler(getTime);
// create a time engine that will log the scheduled time every second
const engine = {
  period: 1,
  advanceTime(time) {
    console.log(time);
    return time + this.period;
  }
}

// add egine to scheduler
const startTime = Math.ceil(getTime());
scheduler.add(engine, startTime);
```

## Available Components

#### core

- `PriorityQueue`
- `SchedulingQueue`
- `TimeEngine`

#### masters

- `PlayControl`
- `SimpleScheduler`
- `Scheduler`
- `Transport`      

## Credits

This library has been initiated (formerly in the context of the [waves-audio](https://github.com/wavesjs/waves-audio) library) in the framework of the WAVE (ANR-12-CORD-0027) and CoSiMa (ANR-13-CORD-0010) research projects, funded by the French National Research Agency (ANR). 

## License

[BSD-3-Clause](./LICENSE)
