import { render, replace, remove } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #eventsListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #event = null;
  #destination = null;
  #destinations = null;
  #offers = null;
  #mode = Mode.DEFAULT;

  constructor({ eventsListContainer, onDataChange, onModeChange, destination, destinations, offers }) {
    this.#eventsListContainer = eventsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;

    this.#destination = destination;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init(event) {
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventView({
      event: this.#event,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });
    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      destination: this.#destination,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onRollupButtonClick: this.#handleRollupButtonClick,
      onCancelClick: this.#handleCancelClick,
    });

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditComponent.reset(this.#event);
      this.#replaceRedactorToEvent();
    }
  }

  #replaceEventToRedactor() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceRedactorToEvent() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#eventEditComponent.reset(this.#event);
      this.#replaceRedactorToEvent();
    }
  };

  #handleCancelClick = () => {
    this.#eventEditComponent.reset(this.#event);
    this.#replaceRedactorToEvent();
  };

  #handleEditClick = () => {
    this.#replaceEventToRedactor();
  };

  #handleRollupButtonClick = () => {
    this.#eventEditComponent.reset(this.#event);
    this.#replaceRedactorToEvent();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({ ...this.#event, isFavorite: !this.#event.isFavorite });
  };

  #handleFormSubmit = (event) => {
    this.#handleDataChange(event);
    this.#replaceRedactorToEvent();
  };
}
