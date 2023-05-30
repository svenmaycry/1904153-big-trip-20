import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDateForEdit, parseDateFromEditFormat } from '../utils/event.js';
import { WAYPOINT_TYPES, DESTINATIONS_NAMES } from '../const.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

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

function createEventEditTemplate(state, destinations, offers) {
  const { event } = state;
  const { basePrice, dateFrom, dateTo, type } = event;
  const dateFromFull = humanizeDateForEdit(dateFrom);
  const dateToFull = humanizeDateForEdit(dateTo);
  const destination = destinations.find((dest) => dest.id === event.destination);
  const picturesList = destination.pictures
    .map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)
    .join('');

  const isChecked = (offer) => event.offers.includes(offer.id) ? 'checked' : '';

  const concreteOffers = offers.find((offer) => offer.type === type).offers;

  const offersList = concreteOffers
    .map((offer) => `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-luggage" ${isChecked(offer)}>
        <label class="event__offer-label" for="${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`)
    .join('');

  const typesTemplate = createTypesTemplate(type);

  const isSubmitDisabled = false;

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
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? 'disabled' : ''}>Save</button>
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

export default class EventEditView extends AbstractStatefulView {
  #datepicker = null;
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleRollupButtonClick = null;
  #handleCancelClick = null;

  constructor({ event = BLANK_EVENT, destinations, offers, onFormSubmit, onRollupButtonClick, onCancelClick }) {
    super();
    this._setState(EventEditView.parseEventToState({ event }));

    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupButtonClick = onRollupButtonClick;
    this.#handleCancelClick = onCancelClick;

    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemplate(this._state, this.#destinations, this.#offers);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset = (event) => this.updateElement({ event });

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupButtonClickHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#cancelClickHandler);

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceChangeHandler);

    this.element.querySelectorAll('.event__offer-checkbox')
      .forEach((offer) => offer.addEventListener('change', this.#offerChangeHandler));

    this.element.querySelectorAll('.event__input--time')
      .forEach((date) => date.addEventListener('change', this.#dateChangeHandler));

    this.#setDatepicker();
  }

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupButtonClick();
  };

  #cancelClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancelClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EventEditView.parseStateToEvent(this._state));
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      event: {
        ...this._state.event,
        type: evt.target.value,
      }
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const dest = this.#destinations.find((destination) => destination.name === evt.target.value);
    if (dest) {
      this.updateElement({
        event: {
          ...this._state.event,
          destination: dest.id,
        }
      });
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      event: {
        ...this._state.event,
        basePrice: evt.target.value,
      }
    });
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    const { offers } = this._state.event;
    if (evt.target.checked) {
      this._setState({
        event: {
          ...this._state.event,
          offers: [...offers, Number(evt.target.id)],
        }
      });
    } else {
      const updatedOffers = offers.filter((offer) => offer !== Number(evt.target.id));
      this._setState({
        event: {
          ...this._state.event,
          offers: updatedOffers,
        }
      });
    }
  };

  #dateChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.name === 'event-start-time') {
      this.updateElement({
        event: {
          ...this._state.event,
          dateFrom: parseDateFromEditFormat(evt.target.value),
          dateTo: parseDateFromEditFormat(evt.target.value)
        }
      });
    } else {
      this.updateElement({
        event: {
          ...this._state.event,
          dateTo: parseDateFromEditFormat(evt.target.value),
        }
      });
    }
  };

  #setDatepicker() {
    const dateInputs = this.element.querySelectorAll('.event__input--time');

    this.#datepicker = dateInputs.forEach((dateinput) => {
      let minDate = null;
      if (dateinput === dateInputs[1]) {
        minDate = dateInputs[0].value;
      }

      flatpickr(dateinput,
        {
          dateFormat: 'd/m/y H:i',
          enableTime: true,
          'time_24hr': true,
          minDate: minDate
        });
    });
  }

  static parseEventToState = ({ event }) => ({ event });

  static parseStateToEvent = (state) => state.event;
}
