import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDateForEvent, humanizeTimeFrom, humanizeTimeTo, getTimeGap, mapIdToOffers } from '../utils/event.js';

function createEventTemplate(event, destination, offers) {
  const { basePrice, dateFrom, dateTo, isFavorite, type } = event;

  const eventOffers = mapIdToOffers(offers, event.offers, event.type);

  const date = humanizeDateForEvent(dateFrom);
  const timeFrom = humanizeTimeFrom(dateFrom);
  const timeTo = humanizeTimeTo(dateTo);

  const time = getTimeGap(dateFrom, dateTo);

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  const offersList = eventOffers
    .map((offer) => `
  <li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`)
    .join('');

  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime=${dateFrom}>${date}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime=${dateFrom}>${timeFrom}</time>
          &mdash;
          <time class="event__end-time" datetime=${dateTo}>${timeTo}</time>
        </p>
        <p class="event__duration">${time}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersList}
      </ul>
      <button class="${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
}

export default class EventView extends AbstractView {
  #event = null;
  #destination = null;
  #offers = null;
  #handleEditClick = null;

  constructor({ event, destination, offers, onEditClick }) {
    super();
    this.#event = event;
    this.#destination = destination;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createEventTemplate(this.#event, this.#destination, this.#offers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
