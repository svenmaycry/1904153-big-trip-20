const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];
const getRandomInteger = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + min;
const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

export { getRandomArrayElement, getRandomInteger, updateItem };
