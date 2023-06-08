const WAYPOINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DESTINATIONS_NAMES = ['Chamonix', 'Geneva', 'Amsterdam', 'Helsinki', 'Oslo', 'Kopenhagen', 'Den Haag', 'Rotterdam', 'Saint Petersburg', 'Moscow', 'Sochi', 'Tokio', 'Kioto', 'Nagasaki', 'Hiroshima', 'Berlin', 'Munich', 'Frankfurt', 'Vien', 'Rome', 'Naples', 'Venice', 'Milan', 'Monaco', 'Paris', 'Barcelona', 'Valencia', 'Madrid'];
const DESTINATIONS_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  'Cras aliquet varius magna, non porta ligula feugiat eget',
  'Fusce tristique felis at fermentum pharetra',
  'Aliquam id orci ut lectus varius viverra',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum',
];

const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export { WAYPOINT_TYPES, DESTINATIONS_NAMES, DESTINATIONS_DESCRIPTIONS, FilterType, SortType, UserAction, UpdateType };
