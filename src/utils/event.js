import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';


dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

const ALERT_SHOW_TIME = 3000;
const DATE_FORMAT_FOR_EDIT = 'DD/MM/YY HH:mm';
const DATE_FORMAT_FOR_EVENT_DATE = 'MMM DD';
const DATE_FORMAT_FOR_SAME_EVENT_DATE = 'DD';
const DATE_FORMAT_FOR_EVENT_TIME = 'HH:mm';

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;
const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = MS_IN_SECOND * SECONDS_IN_MINUTE;
const MS_IN_HOUR = MS_IN_MINUTE * MINUTES_IN_HOUR;
const MS_IN_DAY = MS_IN_HOUR * HOURS_IN_DAY;

const getTimeGap = (dateFrom, dateTo) => {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));
  let timeGap = 0;
  switch (true) {
    case (timeDiff >= MS_IN_DAY):
      timeGap = dayjs.duration(timeDiff).format('DD[d] HH[H] mm[M]');
      break;
    case (timeDiff >= MS_IN_HOUR):
      timeGap = dayjs.duration(timeDiff).format('HH[H] mm[M]');
      break;
    case (timeDiff < MS_IN_HOUR):
      timeGap = dayjs.duration(timeDiff).format('mm[M]');
      break;
  }
  return timeGap;
};

const humanizeDateForEdit = (date) => date ? dayjs(date).utc().format(DATE_FORMAT_FOR_EDIT) : '';
const humanizeDateForEvent = (date) => date ? dayjs(date).utc().format(DATE_FORMAT_FOR_EVENT_DATE) : '';
const humanizeDateForSameEvent = (date) => date ? dayjs(date).utc().format(DATE_FORMAT_FOR_SAME_EVENT_DATE) : '';
const humanizeTimeFrom = (date) => date ? dayjs(date).utc().format(DATE_FORMAT_FOR_EVENT_TIME) : '';
const humanizeTimeTo = (date) => date ? dayjs(date).utc().format(DATE_FORMAT_FOR_EVENT_TIME) : '';

const parseDateFromEditFormat = (dateString) => dayjs.utc(dateString, DATE_FORMAT_FOR_EDIT).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

const isEventPast = (dateFrom, dateTo) => (dayjs().isAfter(dayjs(dateFrom)) && dayjs().isAfter(dayjs(dateTo)));

const isEventPresent = (dateFrom, dateTo) => (dayjs().isAfter(dayjs(dateFrom)) && dayjs().isBefore(dayjs(dateTo)));

const isEventFuture = (dateFrom, dateTo) => (dayjs().isBefore(dayjs(dateFrom)) && dayjs().isBefore(dayjs(dateTo)));

const findTripConcreteOffers = (eventType, offers) => offers.find((offer) => offer.type === eventType).offers;

const mapIdToOffers = (offers, ids, eventType) => {
  const concreteOffers = findTripConcreteOffers(eventType, offers);
  return ids.map((offerId) => concreteOffers.find((offer) => offer.id === offerId));
};

const sortByDay = (eventA, eventB) => {
  if (dayjs(eventA.dateFrom).isAfter(dayjs(eventB.dateFrom))) {
    return 1;
  }

  if (dayjs(eventA.dateFrom) === dayjs(eventB.dateFrom)) {
    return 0;
  }

  if (dayjs(eventA.dateFrom).isBefore(dayjs(eventB.dateFrom))) {
    return -1;
  }
};

const sortByTime = (eventA, eventB) => dayjs(eventB.dateTo).diff(dayjs(eventB.dateFrom)) - dayjs(eventA.dateTo).diff(dayjs(eventA.dateFrom));

const sortByPrice = (eventA, eventB) => eventB.basePrice - eventA.basePrice;

const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '50px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};

export { humanizeDateForEdit, humanizeDateForEvent, humanizeDateForSameEvent, humanizeTimeFrom, humanizeTimeTo, getTimeGap, isEventPast, isEventPresent, isEventFuture, mapIdToOffers, sortByDay, sortByTime, sortByPrice, parseDateFromEditFormat, capitalizeFirstLetter, showAlert };
