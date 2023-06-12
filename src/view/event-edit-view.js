import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDateForEdit, parseDateFromEditFormat, capitalizeFirstLetter } from '../utils/event.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const DEFAULT_EVENT = {
  basePrice: '',
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'taxi'
};

function createEventEditTemplate(state, destinations, offers) {
  const { event, isDisabled, isSaving, isDeleting } = state;
  const { basePrice, dateFrom, dateTo, type } = event;
  const dateFromFull = humanizeDateForEdit(dateFrom);
  const dateToFull = humanizeDateForEdit(dateTo);
  const isEventNew = !state.event.id;

  const isEventJustOpen = (event.destination === '');
  const destination = isEventJustOpen ? '' : destinations.find((dest) => dest.id === event.destination);
  const picturesList = isEventJustOpen ? '' : destination.pictures
    .map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)
    .join('');

  const isChecked = (offer) => event.offers.includes(offer.id) ? 'checked' : '';
  const concreteOffers = offers.find((offer) => offer.type === type).offers;

  const offersList = concreteOffers
    .map((offer) => `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer" ${isChecked(offer)}>
        <label class="event__offer-label" for="${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`)
    .join('');

  const WAYPOINT_TYPES = offers.map((offer) => offer.type);

  const createTypesTemplate = (currentType) => WAYPOINT_TYPES.map((concreteType) => `
    <div class="event__type-item">
      <input
        id="event-type-${concreteType}-1"
        class="event__type-input  visually-hidden"
        type="radio" name="event-type"
        value="${concreteType}"
        ${currentType === concreteType ? 'checked' : ''}
      >
      <label
        class="event__type-label  event__type-label--${concreteType}"
        for="event-type-${concreteType}-1"
      >${capitalizeFirstLetter(concreteType)}</label>
    </div>
  `).join('');

  const DESTINATIONS_NAMES = destinations.map((dest) => dest.name);
  const createDestinationsTemplate = () => DESTINATIONS_NAMES.map((dest) => `<option value="${dest}"></option>`);

  const typesTemplate = createTypesTemplate(type);

  const buttonsTemplate = isEventNew ? `
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>`
    : `
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
    <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}><span class="visually-hidden">Open event</span></button>
  `;

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${isEventJustOpen ? '' : destination.name}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-1">
            ${createDestinationsTemplate()}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFromFull}" required ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateToFull}" required ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}" required ${isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        ${buttonsTemplate}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersList}
          </div>
        </section>

        <section class="event__section  event__section--destination ${isEventJustOpen ? 'visually-hidden' : ''}">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>

          <div class="event__photos-container" >
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
  #datepickers = null;
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleRollupButtonClick = null;
  #handleCancelClick = null;
  #handleDeleteClick = null;

  constructor({ event = DEFAULT_EVENT, destinations, offers, onFormSubmit, onRollupButtonClick, onCancelClick, onDeleteClick }) {
    super();
    this._setState(EventEditView.parseEventToState({ event }));

    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupButtonClick = onRollupButtonClick;
    this.#handleCancelClick = onCancelClick;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemplate(this._state, this.#destinations, this.#offers);
  }

  removeElement() {
    super.removeElement();
    this.#datepickers.forEach((datepicker) => datepicker.destroy());
  }

  reset = (event) => this.updateElement({ event });

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    const rollupButton = this.element.querySelector('.event__rollup-btn');
    if (rollupButton) {
      rollupButton.addEventListener('click', this.#rollupButtonClickHandler);
    }

    const resetButton = this.element.querySelector('.event__reset-btn');
    switch (false) {
      case true:
        resetButton.addEventListener('click', this.#cancelClickHandler);
        break;
      case false:
        resetButton.addEventListener('click', this.#deleteClickHandler);
        break;
    }

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

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EventEditView.parseStateToEvent(this._state));
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
        offers: [],
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
          offers: [...offers, evt.target.id],
        }
      });
    } else {
      const updatedOffers = offers.filter((offer) => offer !== evt.target.id);
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

    this.#datepickers = [...dateInputs].map((dateinput, id) => {
      const minDate = id ? dateInputs[0].value : null;
      return flatpickr(dateinput,
        {
          dateFormat: 'd/m/y H:i',
          enableTime: true,
          'time_24hr': true,
          minDate,
          allowInput: true,
        });
    });
  }

  static parseEventToState(event) {
    return {
      ...event,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToEvent(state) {
    const event = state.event;

    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;

    return event;
  }
}
