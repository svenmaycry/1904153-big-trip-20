import { remove, render, RenderPosition } from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import { UserAction, UpdateType } from '../const.js';

export default class NewEventPresenter {
  #eventsListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #handleModeChange = null;

  #eventEditComponent = null;

  #destinations = null;
  #offers = null;

  constructor({ eventsListContainer, onDataChange, onDestroy, destinations, offers, onModeChange }) {
    this.#eventsListContainer = eventsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#handleModeChange = onModeChange;

    this.#destinations = destinations;
    this.#offers = offers;
  }

  init() {
    if (this.#eventEditComponent !== null) {
      return;
    }

    this.#eventEditComponent = new EventEditView({
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      destinations: this.#destinations,
      offers: this.#offers,
    });

    render(this.#eventEditComponent, this.#eventsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#eventEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#eventEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#eventEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (event) => {
    this.#handleDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
    this.#handleModeChange();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
      this.#handleModeChange();
    }
  };
}
