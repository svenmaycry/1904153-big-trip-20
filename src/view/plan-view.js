import AbstractView from '../framework/view/abstract-view.js';

function createTripPlanTemplate() {
  return '<section class="trip-events container"></section>';
}

export default class TripPlanView extends AbstractView {
  get template() {
    return createTripPlanTemplate();
  }
}
