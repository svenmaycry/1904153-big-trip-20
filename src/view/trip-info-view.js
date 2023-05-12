import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoTemplate() {
  return '<section class="trip-main__trip-info  trip-info"></section>';
}

export default class TripInfoView extends AbstractView {
  get template() {
    return createTripInfoTemplate();
  }
}
