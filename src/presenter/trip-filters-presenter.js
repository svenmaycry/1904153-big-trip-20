import PageFilter from '../view/page-filter.js';
import { render } from '../render.js';


export default class TripFilterPresenter {
  filterComponent = new PageFilter();

  constructor({ sortContainer }) {
    this.sortContainer = sortContainer;
  }

  init() {
    render(this.filterComponent, this.sortContainer);
  }
}
