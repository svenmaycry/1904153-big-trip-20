import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const NoEventTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

function createNoEventTemplate(filterType) {
  const noEventText = NoEventTextType[filterType];
  return /*HTML*/ `<p class="trip-events__msg">${noEventText}</p>`;
}

export default class NoEventView extends AbstractView {
  #filterType = null;

  constructor({ filterType, isEmpty }) {
    super();
    this.#filterType = isEmpty ? FilterType.EVERYTHING : filterType;

  }

  get template() {
    return createNoEventTemplate(this.#filterType);
  }
}
