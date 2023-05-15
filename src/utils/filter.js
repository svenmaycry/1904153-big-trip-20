import { isEventPast, isEventFuture, isEventPresent } from './event.js';

const filter = {
  everything: (events) => events.filter((event) => event),
  past: (events) => events.filter((event) => isEventPast(event.dateFrom, event.dateTo)),
  present: (events) => events.filter((event) => isEventPresent(event.dateFrom, event.dateTo)),
  future: (events) => events.filter((event) => isEventFuture(event.dateFrom, event.dateTo)),
};

export { filter };
