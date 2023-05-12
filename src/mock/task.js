import { getRandomArrayElement, getRandomInteger } from '../utils/common.js';
import { WAYPOINT_TYPES, DESTINATIONS_DESCRIPTIONS, DESTINATIONS_NAMES } from '../const.js';

const mockTripDestinations = [
  {
    id: 1,
    description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS),
    name: getRandomArrayElement(DESTINATIONS_NAMES),
    pictures: Array.from({ length: getRandomInteger(1, 5) }, () => ({
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 30)}`,
      description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS)
    }))
  },
  {
    id: 2,
    description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS),
    name: getRandomArrayElement(DESTINATIONS_NAMES),
    pictures: Array.from({ length: getRandomInteger(1, 5) }, () => ({
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 30)}`,
      description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS)
    }))
  },
  {
    id: 3,
    description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS),
    name: getRandomArrayElement(DESTINATIONS_NAMES),
    pictures: Array.from({ length: getRandomInteger(1, 5) }, () => ({
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 30)}`,
      description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS)
    }))
  },
  {
    id: 4,
    description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS),
    name: getRandomArrayElement(DESTINATIONS_NAMES),
    pictures: Array.from({ length: getRandomInteger(1, 5) }, () => ({
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 30)}`,
      description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS)
    }))
  }
];

const mockTripOffers = [
  {
    type: 'flight',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120
      },
      {
        id: 2,
        title: 'Switch seats',
        price: 80
      },
      {
        id: 3,
        title: 'Add meal',
        price: 100
      }
    ]
  },
  {
    type: 'taxi',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 320
      },
      {
        id: 2,
        title: 'Can smoke',
        price: 80
      }
    ]
  },
  {
    type: 'bus',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a higher class',
        price: 50
      },
      {
        id: 2,
        title: 'Choose seats',
        price: 60
      },
    ]
  }
];

const getMockTripEvent = () => ({
  id: getRandomInteger(1, 4),
  basePrice: getRandomInteger(1000, 2000),
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T23:22:13.375Z',
  destination: getRandomInteger(1, 4),
  isFavorite: getRandomInteger(0, 1),
  offers: [
    1, 2
  ],
  type: getRandomArrayElement(WAYPOINT_TYPES)
});


export { getMockTripEvent, mockTripDestinations, mockTripOffers };
