import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(relativeTime);

const DATE_FORMAT_FOR_EDIT = 'DD/MM/YY HH:mm';
const DATE_FORMAT_FOR_EVENT_DATE = 'MMM DD';
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
const humanizeTimeFrom = (date) => date ? dayjs(date).utc().format(DATE_FORMAT_FOR_EVENT_TIME) : '';
const humanizeTimeTo = (date) => date ? dayjs(date).utc().format(DATE_FORMAT_FOR_EVENT_TIME) : '';

function isEventPast(dateFrom, dateTo) {
  return (dayjs().diff(dayjs(dateFrom)) > 0 && dayjs().diff(dayjs(dateTo)) > 0);
}
function isEventPresent(dateFrom, dateTo) {
  return (dayjs().diff(dayjs(dateFrom)) > 0 && dayjs().diff(dayjs(dateTo)) < 0);
}
function isEventFuture(dateFrom, dateTo) {
  return (dayjs().diff(dayjs(dateFrom)) < 0 && dayjs().diff(dayjs(dateTo)) < 0);
}

const findTripConcreteOffers = (eventType, offers) => offers.find((offer) => offer.type === eventType).offers;

const mapIdToOffers = (offers, ids, eventType) => {
  const concreteOffers = findTripConcreteOffers(eventType, offers);
  return ids.map((offerId) => concreteOffers.find((offer) => offer.id === offerId));
};

export { humanizeDateForEdit, humanizeDateForEvent, humanizeTimeFrom, humanizeTimeTo, getTimeGap, isEventPast, isEventPresent, isEventFuture, mapIdToOffers };
