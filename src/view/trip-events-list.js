import { createElement } from '../render.js';

function createTripEventsListView() {
  return `<ul class="trip-events__list">
  </ul>`;
}

export default class TripEventsListView {
  getTemplate() {
    return createTripEventsListView();
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
