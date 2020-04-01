// core
import _TimeEngine from './core/TimeEngine.js';
import _PriorityQueue from './core/PriorityQueue.js';
import _SchedulingQueue from './core/SchedulingQueue.js';

// masters
import _PlayControl from './masters/PlayControl.js';
import _Transport from './masters/Transport.js';
import _Scheduler from './masters/Scheduler.js';
import _SimpleScheduler from './masters/SimpleScheduler.js';

// explicit default export
export default {
  TimeEngine: _TimeEngine,
  PriorityQueue: _PriorityQueue,
  SchedulingQueue: _SchedulingQueue,
  PlayControl: _PlayControl,
  Transport: _Transport,
  Scheduler: _Scheduler,
  SimpleScheduler: _SimpleScheduler,
};

// allow specific imports
export const TimeEngine = _TimeEngine;
export const PriorityQueue = _PriorityQueue;
export const SchedulingQueue = _SchedulingQueue;
export const PlayControl = _PlayControl;
export const Transport = _Transport;
export const Scheduler = _Scheduler;
export const SimpleScheduler = _SimpleScheduler;
