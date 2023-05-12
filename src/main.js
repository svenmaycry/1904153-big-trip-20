import TripPlanPresenter from './presenter/trip-presenter.js';
import TripEventsModel from './model/trip-events-model.js';

const tripPlanContainer = document.querySelector('.trip-events');
const tripEventsModel = new TripEventsModel();

const tripPlanPresenter = new TripPlanPresenter({
  tripPlanContainer: tripPlanContainer,
  tripEventsModel,
});

tripPlanPresenter.init();
