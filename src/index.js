// core
import _TimeEngine from './core/TimeEngine';
import _PriorityQueue from './core/PriorityQueue';
import _SchedulingQueue from './core/SchedulingQueue';

// masters
import _PlayControl from './masters/PlayControl';
import _Transport from './masters/Transport';
import _Scheduler from './masters/Scheduler';
import _SimpleScheduler from './masters/SimpleScheduler';

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
