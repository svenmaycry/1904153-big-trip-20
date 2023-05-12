import { render, replace } from '../framework/render.js';
import TripPlanView from '../view/trip-plan-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripEventView from '../view/trip-event-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventEditView from '../view/trip-event-edit-view.js';
import NoEventView from '../view/no-event-view.js';

export default class TripPlanPresenter {
  #tripPlanContainer = null;
  #tripEventsModel = null;

  #tripPlanComponent = new TripPlanView();
  #tripEventsListComponent = new TripEventsListView();

  #tripEvents = [];
  #tripDestinations = [];
  #tripOffers = [];

  constructor({ tripPlanContainer, tripEventsModel }) {
    this.#tripPlanContainer = tripPlanContainer;
    this.#tripEventsModel = tripEventsModel;
  }

  init() {
    this.#tripEvents = [...this.#tripEventsModel.tripEvents];
    this.#tripDestinations = [...this.#tripEventsModel.tripDestinations];
    this.#tripOffers = [...this.#tripEventsModel.tripOffers];

    this.#renderTripPlan();
  }

  #renderEvent({ tripEvent, destination, offers }) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceRedactorToEvent();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const eventComponent = new TripEventView({
      tripEvent,
      destination,
      offers,
      onEditClick: () => {
        replaceEventToRedactor();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });
    const eventEditComponent = new TripEventEditView({
      tripEvent,
      destination,
      offers,
      onFormSubmit: () => {
        replaceRedactorToEvent();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onRollupButtonClick: () => {
        replaceRedactorToEvent();
      }
    });

    function replaceEventToRedactor() {
      replace(eventEditComponent, eventComponent);
    }

    function replaceRedactorToEvent() {
      replace(eventComponent, eventEditComponent);
    }

    render(eventComponent, this.#tripEventsListComponent.element);
  }

  #renderTripPlan() {
    render(this.#tripPlanComponent, this.#tripPlanContainer);

    if (!this.#tripEvents) {
      render(new NoEventView(), this.#tripPlanComponent.element);
      return;
    }

    render(new TripSortView(), this.#tripPlanComponent.element);
    render(this.#tripEventsListComponent, this.#tripPlanComponent.element);

    for (let i = 0; i < this.#tripEvents.length; i++) {
      const event = this.#tripEvents[i];
      const eventDestination = this.#tripDestinations.find((dest) => dest.id === event.destination);
      const eventOffers = this.#tripOffers;
      this.#renderEvent({ tripEvent: event, destination: eventDestination, offers: eventOffers });
    }
  }
}
