import { createElement } from '../render.js';

function createTripInfoView() {
  return (
    `<section class="trip-main__trip-info  trip-info">
  </section>`
  );
}

export default class TripInfoView {
  getTemplate() {
    return createTripInfoView();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
