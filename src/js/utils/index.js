import moment from 'moment';
import escaper from 'js-string-escape';
import numberToWords from 'written-number';
import pluralize from 'pluralize';

export const canvasToDataURL = (image, compress) => {
  const canvas = document.createElement('canvas');

  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL('image/webp', compress);
};

export const toQueryString = object => Object.keys(object).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`).join('&');

/* eslint-disable no-param-reassign */
const eventDecorator = (event) => {
  const decoration = {
    startMoment: moment(event.start.dateTime || event.start.date),
    endMoment: moment(event.end.dateTime || event.end.date)
  };

  decoration.fromNow = decoration.startMoment.fromNow();

  return { ...event, ...decoration };
};
/* eslint-enable */

export const generateChitChat = (events) => {
  let bigTalk = '';
  let smallTalk = '';

  if (events.length === 0) {
    bigTalk = 'Today and tomorrow look clear';
    smallTalk = 'And there are no events on the horizon';
  } else {
    const nowMoment = moment();
    const tomorrowMoment = moment().add(1, 'days').endOf('day');
    const nextEvent = eventDecorator(events[0]);
    const nextEventName = escaper(nextEvent.summary) || 'Untitled';
    const isNextEventToday = nextEvent.startMoment.isSame(nowMoment, 'day');
    const isNextEventTomorrow = nextEvent.startMoment.isAfter(nowMoment, 'day') && nextEvent.startMoment.isBefore(tomorrowMoment);
    const isNextEventRightNow = nextEvent.startMoment.isBefore(nowMoment) &&
      nextEvent.endMoment.isAfter(nowMoment);

    let eventsRemaining;
    let eventsRemainingTodayNumber;
    let eventsRemainingTomorrowNumber;
    let eventsRemainingToday;
    let eventsRemainingTomorrow;

    if (events.length > 1 && (isNextEventToday || isNextEventTomorrow)) {
      eventsRemaining = events.slice(1).filter(event => moment(event.start.dateTime || event.start.date).isSame(nowMoment, 'day'));
      eventsRemainingTodayNumber = eventsRemaining.length;
      eventsRemainingTomorrowNumber = events.length - 1;
      eventsRemainingToday = numberToWords(eventsRemainingTodayNumber);
      eventsRemainingTomorrow = numberToWords(eventsRemainingTomorrowNumber);
    }

    // If upcoming event is today...
    if (isNextEventToday) {
      // The event is happening right now
      if (isNextEventRightNow) {
        bigTalk = `<span class="event-name">${nextEventName}</span> started ${nextEvent.fromNow} and goes until ${nextEvent.endMoment.format('h:mma')}.`;

      // The event is yet to happen
      } else {
        bigTalk = `You've got <span class="event-name">${nextEventName}</span> ${nextEvent.fromNow}.`;
      }

      if (eventsRemainingTodayNumber > 0) {
        smallTalk = `Plus ${eventsRemainingToday} other upcoming ${pluralize('event', eventsRemainingTodayNumber)} today.`;
      } else if (eventsRemainingTomorrowNumber > 0) {
        smallTalk = 'And then you\'re clear till tomorrow.';
      } else {
        smallTalk = 'After that you\'re clear for the next few days.';
      }

    // If upcoming event is tomorrow...
    } else if (isNextEventTomorrow) {
      bigTalk = `Tomorrow your day starts with <span class="event-name">${nextEventName}</span> at ${nextEvent.startMoment.format('h:mma')}.`;

      if (eventsRemainingTomorrowNumber > 0) {
        smallTalk = `Plus ${eventsRemainingTomorrow} other ${pluralize('event', eventsRemainingTomorrowNumber)}.`;
      } else {
        smallTalk = 'After that you\'re clear for the rest of the day.';
      }

    // If upcoming event is in the future...
    } else {
      bigTalk = 'Today and tomorrow look clear.';
      smallTalk = `Your next event is <span class="event-name">${nextEventName}</span> ${nextEvent.fromNow}.`;
    }
  }

  return { bigTalk, smallTalk };
};
