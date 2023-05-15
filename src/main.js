import { render } from './framework/render.js';
import FilterView from './view/filter-view.js';
import PlanPresenter from './presenter/plan-presenter.js';
import InfoPresenter from './presenter/info-presenter.js';
import EventsModel from './model/events-model.js';
import { generateFilter } from './mock/filter.js';

const tripMainContainer = document.querySelector('.trip-main');
const filtersContainer = tripMainContainer.querySelector('.trip-controls__filters');
const planContainer = document.querySelector('.trip-events');
const eventsModel = new EventsModel();

const planPresenter = new PlanPresenter({ planContainer, eventsModel });

const infoPresenter = new InfoPresenter({
  infoContainer: tripMainContainer,
  eventsModel: eventsModel,
});

infoPresenter.init();

const filters = generateFilter(eventsModel.events);
render(new FilterView({ filters }), filtersContainer);

planPresenter.init();
