const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];
const getRandomInteger = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + min;

export { getRandomArrayElement, getRandomInteger };
