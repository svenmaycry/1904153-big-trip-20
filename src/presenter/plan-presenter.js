import { render, RenderPosition } from '../framework/render.js';
import PlanView from '../view/plan-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NoEventView from '../view/no-event-view.js';
import EventPresenter from './event-presenter.js';
import { updateItem } from '../utils/common.js';

export default class PlanPresenter {
  #planContainer = null;
  #eventsModel = null;

  #planComponent = new PlanView();
  #eventsListComponent = new EventsListView();
  #sortComponent = new SortView();
  #noEventComponent = new NoEventView();

  #events = [];
  #destinations = [];
  #offers = [];

  #eventPresenters = new Map();

  constructor({ planContainer, eventsModel }) {
    this.#planContainer = planContainer;
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#destinations = [...this.#eventsModel.destinations];
    this.#offers = [...this.#eventsModel.offers];

    this.#renderPlan();
  }

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleEventChange = (updatedEvent) => {
    this.#events = updateItem(this.#events, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };


  #renderSort() {
    render(this.#sortComponent, this.#planComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderEvent({ event, destination, offers }) {
    const eventPresenter = new EventPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange,
      destination, offers,
    });
    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderEvents() {
    this.#events
      .forEach((event) => this.#renderEvent({
        event,
        destination: this.#destinations.find((dest) => dest.id === event.destination),
        offers: this.#offers
      }));
  }

  #renderNoEvents() {
    render(this.#noEventComponent, this.#planComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearEventsList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #renderEventsList() {
    render(this.#eventsListComponent, this.#planComponent.element);
    this.#renderEvents();
  }

  #renderPlan() {
    render(this.#planComponent, this.#planContainer);

    if (!this.#events) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    this.#renderEventsList();
  }
}
