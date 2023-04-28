import TripInfoPresenter from './presenter/trip-info-presenter.js';
import TripFilterPresenter from './presenter/trip-filters-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';

const body = document.querySelector('.page-body');
const tripHeaderInfo = body.querySelector('.trip-main');
const tripHeaderFilter = body.querySelector('.trip-controls__filters');
const mainContent = body.querySelector('.trip-events');

const tripPresenter = new TripPresenter({ sortContainer: mainContent });
const tripFilterPresenter = new TripFilterPresenter({ sortContainer: tripHeaderFilter });
const tripInfoPresenter = new TripInfoPresenter({ sortContainer: tripHeaderInfo });

tripInfoPresenter.init();
tripFilterPresenter.init();
tripPresenter.init();
