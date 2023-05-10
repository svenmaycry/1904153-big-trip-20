import { getMockTripEvent, mockTripDestinations, mockTripOffers } from '../mock/task.js';

const EVENTS_COUNT = 4;

export default class TripEventsModel {
  tripEvents = Array.from({ length: EVENTS_COUNT }, getMockTripEvent);

  getTripEvents() {
    return this.tripEvents;
  }

  tripDestinations = mockTripDestinations;

  getTripDestinations() {
    return this.tripDestinations;
  }

  tripOffers = mockTripOffers;

  getTripOffers() {
    return this.tripOffers;
  }

  getTripConcreteOffers(type) {
    return this.tripOffers.find((offer) => offer.type === type).offers;
  }

  mapIdToOffers(ids, type) {
    const offers = this.getTripConcreteOffers(type);
    return ids.map((offerId) => offers.find((offer) => offer.id === offerId));
  }
}
