import { getRandomArrayElement, getRandomInteger } from '../utils/common.js';
import { WAYPOINT_TYPES, DESTINATIONS_DESCRIPTIONS } from '../const.js';
import { nanoid } from 'nanoid';

const mockDestinations = [
  {
    id: 1,
    description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS),
    name: 'Paris',
    pictures: Array.from({ length: getRandomInteger(1, 5) }, () => ({
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 30)}`,
      description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS)
    }))
  },
  {
    id: 2,
    description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS),
    name: 'New York',
    pictures: Array.from({ length: getRandomInteger(1, 5) }, () => ({
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 30)}`,
      description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS)
    }))
  },
  {
    id: 3,
    description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS),
    name: 'Moscow',
    pictures: Array.from({ length: getRandomInteger(1, 5) }, () => ({
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 30)}`,
      description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS)
    }))
  },
  {
    id: 4,
    description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS),
    name: 'Warsaw',
    pictures: Array.from({ length: getRandomInteger(1, 5) }, () => ({
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 30)}`,
      description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS)
    }))
  }
];

const mockOffers = [
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
  },
  {
    type: 'train',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a higher class',
        price: 100
      },
      {
        id: 2,
        title: 'Choose seats',
        price: 90
      },
    ]
  },
  {
    type: 'ship',
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
    type: 'drive',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120
      },
      {
        id: 2,
        title: 'Add music',
        price: 180
      },
      {
        id: 3,
        title: 'Add additional stop',
        price: 200
      }
    ]
  },
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
    type: 'check-in',
    offers: [
      {
        id: 1,
        title: 'Add more room',
        price: 250
      },
      {
        id: 2,
        title: 'Upgrade to a higher class',
        price: 400
      },
      {
        id: 3,
        title: 'Add breakfast',
        price: 50
      },
      {
        id: 4,
        title: 'Add cleaning',
        price: 150
      }
    ]
  },
  {
    type: 'sightseeing',
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
    ]
  },
  {
    type: 'restaurant',
    offers: [
      {
        id: 1,
        title: 'Add Michelenne Star',
        price: 300
      },
      {
        id: 2,
        title: 'Add More Michelenne Star',
        price: 500
      }
    ]
  }
];

const getMockEvent = () => ({
  id: nanoid(),
  basePrice: getRandomInteger(1000, 2000),
  dateFrom: `2019-07-1${getRandomInteger(0, 1)}T${getRandomInteger(11, 23)}:55:56.845Z`,
  dateTo: `20${getRandomInteger(1, 2)}9-07-1${getRandomInteger(1, 2)}T23:22:13.375Z`,
  destination: getRandomInteger(1, 4),
  isFavorite: false,
  offers: [
    1, 2
  ],
  type: getRandomArrayElement(WAYPOINT_TYPES)
});


export { getMockEvent, mockDestinations, mockOffers };
