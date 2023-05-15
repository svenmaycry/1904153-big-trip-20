import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDateForEvent, mapIdToOffers } from '../utils/event.js';

function createTripInfoMainTemplate(events, destinations) {
  const firstDestination = destinations.find((dest) => dest.id === events[0].destination).name;
  const lastDestination = destinations.find((dest) => dest.id === events[events.length - 1].destination).name;
  const firstDate = humanizeDateForEvent(events[0].dateFrom);
  const lastDate = humanizeDateForEvent(events[0].dateTo);
  return `<div class="trip-info__main">
            <h1 class="trip-info__title">${firstDestination} &mdash; ${lastDestination}</h1>

            <p class="trip-info__dates">${firstDate}&nbsp;&mdash;&nbsp;${lastDate}</p>
          </div>`;
}

function createTripInfoCostTemplate(events, offers) {
  const sumBasePrice = (objects) => {
    let sum = 0;
    for (let i = 0; i < objects.length; i++) {
      sum += objects[i].basePrice;
    }
    return sum;
  };

  const allIncludedOffers = [];
  for (let i = 0; i < events.length; i++) {
    const offersForEvent = mapIdToOffers(offers, events[i].offers, events[i].type);
    allIncludedOffers.push(...offersForEvent);
  }

  const sumIncludedOffersPrice = (objects) => {
    let sum = 0;
    for (let i = 0; i < objects.length; i++) {
      sum += objects[i].price;
    }
    return sum;
  };
  const price = sumBasePrice(events) + sumIncludedOffersPrice(allIncludedOffers);

  return `<p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
          </p>`;
}

function createTripInfoTemplate(events, destinations, offers) {
  return `
    <section class="trip-main__trip-info  trip-info">
      ${createTripInfoMainTemplate(events, destinations)}
      ${createTripInfoCostTemplate(events, offers)}
    </section>`;
}

export default class InfoView extends AbstractView {
  #events = null;
  #destinations = null;
  #offers = null;

  constructor({ events, destinations, offers }) {
    super();
    this.#events = events;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoTemplate(this.#events, this.#destinations, this.#offers);
  }
}
