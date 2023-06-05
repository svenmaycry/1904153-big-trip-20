import Observable from '../framework/observable.js';
import { getMockEvent, mockDestinations, mockOffers } from '../mock/mock-objects';

const EVENTS_COUNT = 8;

export default class EventsModel extends Observable {
  #events = Array.from({ length: EVENTS_COUNT }, getMockEvent);

  get events() {
    return this.#events;
  }

  #destinations = mockDestinations;

  get destinations() {
    return this.#destinations;
  }

  #offers = mockOffers;

  get offers() {
    return this.#offers;
  }

  updateEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      update,
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this.#events = [
      update,
      ...this.#events,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
