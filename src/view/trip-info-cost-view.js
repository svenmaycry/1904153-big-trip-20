import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoCostTemplate() {
  return `<p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
          </p>`;
}

export default class TripInfoCostView extends AbstractView {
  get template() {
    return createTripInfoCostTemplate();
  }
}
