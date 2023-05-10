import { createElement } from '../render.js';

function createTripPlanTemplate() {
  return `<section class="trip-events container">
  </section>`;
}

export default class TripPlanView {
  getTemplate() {
    return createTripPlanTemplate();
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
