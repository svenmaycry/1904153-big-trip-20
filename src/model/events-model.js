import { getMockEvent, mockDestinations, mockOffers } from '../mock/mock-objects';

const EVENTS_COUNT = 8;

export default class EventsModel {
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
}

