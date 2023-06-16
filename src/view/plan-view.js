import AbstractView from '../framework/view/abstract-view.js';

const createTripPlanTemplate = () => '<section class="trip-events container"></section>';

export default class PlanView extends AbstractView {
  get template() {
    return createTripPlanTemplate();
  }
}
