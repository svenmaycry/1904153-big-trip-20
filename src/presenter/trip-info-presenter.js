import TripInfo from '../view/trip-info.js';
import { render } from '../render.js';


export default class TripInfoPresenter {
  infoComponent = new TripInfo();

  constructor({ sortContainer }) {
    this.sortContainer = sortContainer;
  }

  init() {
    render(this.infoComponent, this.sortContainer, 'afterbegin');
  }
}
