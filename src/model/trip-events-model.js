import { getMockTripEvent, mockTripDestinations, mockTripOffers } from '../mock/task.js';

const EVENTS_COUNT = 8;

export default class TripEventsModel {
  #tripEvents = Array.from({ length: EVENTS_COUNT }, getMockTripEvent);

  get tripEvents() {
    return this.#tripEvents;
  }

  #tripDestinations = mockTripDestinations;

  get tripDestinations() {
    return this.#tripDestinations;
  }

  #tripOffers = mockTripOffers;

  get tripOffers() {
    return this.#tripOffers;
  }

  #findTripConcreteOffers(type) {
    return this.tripOffers.find((offer) => offer.type === type).offers;
  }

  mapIdToOffers(ids, type) {
    const offers = this.#findTripConcreteOffers(type);
    return ids.map((offerId) => offers.find((offer) => offer.id === offerId));
  }
}
