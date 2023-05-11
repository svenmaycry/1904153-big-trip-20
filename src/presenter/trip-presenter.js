import TripPlanView from '../view/trip-plan.js';
import TripSortView from '../view/trip-sort.js';
import TripEventView from '../view/trip-event-view.js';
import TripEventsListView from '../view/trip-events-list.js';
import TripEventEditView from '../view/trip-event-edit-view.js';
import { render } from '../render.js';

export default class TripPlanPresenter {
  tripPlanComponent = new TripPlanView();
  tripEventsListComponent = new TripEventsListView();

  constructor({ tripPlanContainer, tripEventsModel }) {
    this.tripPlanContainer = tripPlanContainer;
    this.tripEventsModel = tripEventsModel;
  }

  init() {
    this.tripEvents = [...this.tripEventsModel.getTripEvents()];
    this.tripDestinations = [...this.tripEventsModel.getTripDestinations()];
    this.tripOffers = [...this.tripEventsModel.getTripOffers()];


    render(this.tripPlanComponent, this.tripPlanContainer);
    render(new TripSortView(), this.tripPlanComponent.getElement());
    render(this.tripEventsListComponent, this.tripPlanComponent.getElement());

    const redactingEvent = this.tripEvents[0];
    const destination = this.tripDestinations.find((dest) => dest.id === redactingEvent.destination);
    render(new TripEventEditView({ tripEvent: redactingEvent, destination: destination, offers: this.tripOffers }), this.tripEventsListComponent.getElement());

    for (let i = 1; i < this.tripEvents.length; i++) {
      const event = this.tripEvents[i];
      const eventDestination = this.tripDestinations.find((dest) => dest.id === event.destination);
      const eventOffers = this.tripEventsModel.mapIdToOffers(event.offers, event.type);

      render(new TripEventView({ tripEvent: event, destination: eventDestination, offers: eventOffers }), this.tripEventsListComponent.getElement());
    }

  }
}
