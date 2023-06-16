import { render, RenderPosition, remove } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import PlanView from '../view/plan-view.js';
import SortView from '../view/sort-view.js';
import InfoView from '../view/info-view.js';
import EventsListView from '../view/events-list-view.js';
import NoEventView from '../view/no-event-view.js';
import LoadingView from '../view/loading-view.js';
import ErrorView from '../view/error-view.js';
import EventPresenter from './event-presenter.js';
import NewEventPresenter from './new-event-presenter.js';
import NewEventButtonView from '../view/new-event-button-view.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { sortByDay, sortByTime, sortByPrice } from '../utils/event.js';
import { filter } from '../utils/filter.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
export default class PlanPresenter {
  #planContainer = null;
  #eventsModel = null;
  #filterModel = null;

  #planComponent = new PlanView();
  #mainComponent = document.querySelector('.trip-main');
  #eventsListComponent = new EventsListView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #infoComponent = null;
  #noEventComponent = null;
  #newEventButtonComponent = null;
  #eventPresenters = new Map();
  #newEventPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  constructor({ planContainer, eventsModel, filterModel }) {
    this.#planContainer = planContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#newEventPresenter = new NewEventPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewEventFormClose,
      destinations: this.destinations,
      offers: this.offers,
      onModeChange: this.#handleModeChange,
    });

    this.#newEventButtonComponent = new NewEventButtonView({
      onClick: this.#handleNewEventButtonClick,
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
    if (this.events.length === 0) {
      remove(this.#noEventComponent);
    }
  }

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    if (this.events.length === 0) {
      this.#renderNoEvents();
    }
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenters.get(update.id).setSaving();
        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch (err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch (err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenters.get(update.id).setDeleting();
        try {
          await this.#eventsModel.deleteEvent(updateType, update);
        } catch (err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderPlan();
        render(this.#newEventButtonComponent, document.querySelector('.trip-main'));
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderError('Can\'t reach server. Please, try again.');
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

  #handleNewEventButtonClick = () => {
    this.createEvent();
    this.#newEventButtonComponent.element.disabled = true;
  };

  #handleNewEventFormClose = () => {
    this.#newEventButtonComponent.element.disabled = false;
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#planComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderInfo() {
    const events = this.#eventsModel.events.sort(sortByDay);
    const destinations = this.destinations;
    const offers = this.offers;
    this.#infoComponent = new InfoView({ events, destinations, offers });

    render(this.#infoComponent, this.#mainComponent, RenderPosition.AFTERBEGIN);
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

  #renderLoading() {
    render(this.#loadingComponent, this.#planComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderError(error) {
    const errorComponent = new ErrorView({ message: error });
    render(errorComponent, this.#planComponent.element, RenderPosition.AFTERBEGIN);
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
    remove(this.#loadingComponent);

    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderPlan() {
    render(this.#planComponent, this.#planContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.events.length === 0) {
      this.#renderNoEvents();
      return;
    }

    if (this.#infoComponent) {
      remove(this.#infoComponent);
    }
    this.#renderInfo();
    this.#renderSort();
    this.#renderEventsList();
  }
}
