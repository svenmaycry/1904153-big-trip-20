import PageFilterView from './view/page-filter.js';
import TripInfoView from './view/trip-info.js';
import TripInfoMainView from './view/trip-info-main.js';
import TripInfoCostView from './view/trip-info-cost.js';
import TripPlanPresenter from './presenter/trip-presenter.js';
import { RenderPosition, render } from './render.js';
import TripEventsModel from './model/trip-events-model.js';

const tripMainContainer = document.querySelector('.trip-main');
const filtersContainer = tripMainContainer.querySelector('.trip-controls__filters');
const tripPlanContainer = document.querySelector('.trip-events');
const tripEventsModel = new TripEventsModel();

const tripPlanPresenter = new TripPlanPresenter({
  tripPlanContainer: tripPlanContainer,
  tripEventsModel,
});


render(new TripInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);
const tripInfoContainer = document.querySelector('.trip-main__trip-info');
render(new TripInfoMainView, tripInfoContainer);
render(new TripInfoCostView, tripInfoContainer);
render(new PageFilterView(), filtersContainer);

tripPlanPresenter.init();
