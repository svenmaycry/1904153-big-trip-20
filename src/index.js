import PlanPresenter from './presenter/plan-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';
import EventsApiService from './events-api-service.js';

const AUTHORIZATION = 'Basic G451leet1984PzYVs';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const tripMainContainer = document.querySelector('.trip-main');
const filtersContainer = tripMainContainer.querySelector('.trip-controls__filters');
const planContainer = document.querySelector('.trip-events');

const main = async () => {
  const eventsModel = new EventsModel({
    eventsApiService: new EventsApiService(END_POINT, AUTHORIZATION)
  });

  await eventsModel.init();

  const filterModel = new FilterModel();

  const planPresenter = new PlanPresenter({
    planContainer,
    eventsModel,
    filterModel,
  });

  const filterPresenter = new FilterPresenter({
    filterContainer: filtersContainer,
    filterModel,
    eventsModel,
  });

  filterPresenter.init();
  planPresenter.init();
  eventsModel.init();
};

main();
