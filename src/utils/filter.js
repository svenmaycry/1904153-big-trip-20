import { isEventPast, isEventFuture, isEventPresent } from './event.js';
import { FilterType } from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (events) => events.filter((event) => event),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event.dateFrom, event.dateTo)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isEventPresent(event.dateFrom, event.dateTo)),
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event.dateFrom, event.dateTo)),
};

export { filter };
