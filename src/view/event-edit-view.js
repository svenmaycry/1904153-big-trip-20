import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDateForEdit } from '../utils/event.js';
import { WAYPOINT_TYPES, DESTINATIONS_NAMES } from '../const.js';

const BLANK_EVENT = {
  id: '',
  basePrice: null,
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavorite: false,
  offers: [
    ''
  ],
  type: 'taxi'
};

const createTypesTemplate = (currentType) => WAYPOINT_TYPES.map((type) => `
    <div class="event__type-item">
      <input
        id="event-type-${type}-1"
        class="event__type-input  visually-hidden"
        type="radio" name="event-type"
        value="${type}"
        ${currentType === type ? 'checked' : ''}
      >
      <label
        class="event__type-label  event__type-label--${type}"
        for="event-type-${type}-1"
      >${type}</label>
    </div>
  `).join('');

const createDestinationsTemplate = () => DESTINATIONS_NAMES.map((destination) => `<option value="${destination}"></option>`);

function createEventEditTemplate(event, destination, offers) {

  const { basePrice, dateFrom, dateTo, type } = event;
  const dateFromFull = humanizeDateForEdit(dateFrom);
  const dateToFull = humanizeDateForEdit(dateTo);

  const picturesList = destination.pictures
    .map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)
    .join('');


  const isChecked = (offer) => event.offers.includes(offer.id) ? 'checked' : '';

  const concreteOffers = offers.find((offer) => offer.type === type).offers;

  const offersList = concreteOffers
    .map((offer) => `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${isChecked(offer)}>
        <label class="event__offer-label" for="event-offer-luggage-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`)
    .join('');

  const typesTemplate = createTypesTemplate(type);

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typesTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createDestinationsTemplate()}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFromFull}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateToFull}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;${basePrice}
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersList}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${picturesList}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`
  );
}

export default class EventEditView extends AbstractView {
  #event = null;
  #destination = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleRollupButtonClick = null;

  constructor({ event = BLANK_EVENT, destination, offers, onFormSubmit, onRollupButtonClick }) {
    super();
    this.#event = event;
    this.#destination = destination;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupButtonClick = onRollupButtonClick;

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupButtonClickHandler);
  }

  get template() {
    return createEventEditTemplate(this.#event, this.#destination, this.#offers);
  }

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupButtonClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#event);
  };
}
