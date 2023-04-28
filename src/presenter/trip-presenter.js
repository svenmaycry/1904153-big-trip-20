import TripEventsList from '../view/trip-events-list.js';
import TripSort from '../view/trip-sort.js';
import NewEventItem from '../view/trip-new-event-item.js';
import EventItem from '../view/trip-item.js';
import { TRIP_COUNT } from '../const.js';
import { render } from '../render.js';


export default class TripPresenter {
  sortComponent = new TripSort();
  pointComponent = new TripEventsList();

  constructor({ sortContainer }) {
    this.sortContainer = sortContainer;
  }

  init() {
    render(this.sortComponent, this.sortContainer);
    render(this.pointComponent, this.sortContainer);
    render(new NewEventItem(), this.pointComponent.getElement());
    for (let i = 0; i < TRIP_COUNT; i++) {
      render(new EventItem(), this.pointComponent.getElement());
    }
  }
}
