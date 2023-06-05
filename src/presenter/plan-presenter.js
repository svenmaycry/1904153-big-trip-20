import { render, RenderPosition, remove } from '../framework/render.js';
import PlanView from '../view/plan-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NoEventView from '../view/no-event-view.js';
import EventPresenter from './event-presenter.js';
import NewEventPresenter from './new-event-presenter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { sortByDay, sortByTime, sortByPrice } from '../utils/event.js';
import { filter } from '../utils/filter.js';

export default class PlanPresenter {
  #planContainer = null;
  #eventsModel = null;
  #filterModel = null;

  #planComponent = new PlanView();
  #eventsListComponent = new EventsListView();
  #sortComponent = null;
  #noEventComponent = null;

  #eventPresenters = new Map();
  #newEventPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor({ planContainer, eventsModel, filterModel, onNewEventDestroy }) {
    this.#planContainer = planContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#newEventPresenter = new NewEventPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewEventDestroy,
      destinations: this.destinations,
      offers: this.offers,
    });

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    this.#filterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[this.#filterType](events);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredEvents.sort(sortByDay);
      case SortType.TIME:
        return filteredEvents.sort(sortByTime);
      case SortType.PRICE:
        return filteredEvents.sort(sortByPrice);
    }

    return filteredEvents;
  }

  get destinations() {
    return this.#eventsModel.destinations;
  }

  get offers() {
    return this.#eventsModel.offers;
  }

  init() {
    this.#renderPlan();
  }

  createEvent() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
  }

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPlan();
        this.#renderPlan();
        break;
      case UpdateType.MAJOR:
        this.#clearPlan({ resetSortType: true });
        this.#renderPlan();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPlan();
    this.#renderPlan();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#planComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderEvent({ event, destinations, offers }) {
    const eventPresenter = new EventPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      destinations, offers,
    });
    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderEvents(events, destinations, offers) {
    events
      .forEach((event) => this.#renderEvent({
        event,
        destinations: destinations,
        offers: offers
      }));
  }

  #renderNoEvents() {
    const events = this.#eventsModel.events;
    const isEmpty = (events.length === 0);
    this.#noEventComponent = new NoEventView({
      filterType: this.#filterType,
      isEmpty,
    });

    render(this.#noEventComponent, this.#planComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderEventsList() {
    const events = this.events;
    const destinations = this.destinations;
    const offers = this.offers;

    render(this.#eventsListComponent, this.#planComponent.element);
    this.#renderEvents(events, destinations, offers);
  }

  #clearPlan({ resetSortType = false } = {}) {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);

    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderPlan() {
    render(this.#planComponent, this.#planContainer);

    if (this.events.length === 0) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    this.#renderEventsList();
  }
}
