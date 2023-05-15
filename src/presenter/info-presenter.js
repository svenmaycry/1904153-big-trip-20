import { render, RenderPosition } from '../framework/render.js';
import InfoView from '../view/info-view.js';

export default class InfoPresenter {
  #infoContainer = null;
  #eventsModel = null;

  #events = [];
  #destinations = [];
  #offers = [];

  constructor({ infoContainer, eventsModel }) {
    this.#infoContainer = infoContainer;
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#destinations = [...this.#eventsModel.destinations];
    this.#offers = [...this.#eventsModel.offers];

    this.#renderInfo();
  }

  #renderInfo() {
    const events = this.#events;
    const destinations = this.#destinations;
    const offers = this.#offers;
    const infoView = new InfoView({ events, destinations, offers });
    render(infoView, this.#infoContainer, RenderPosition.AFTERBEGIN);
  }
}
