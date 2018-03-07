// import moment from 'moment';

export const getUsedBackgroundIDs = state => state.backgrounds.used;
export const getCurrentBackground = state => state.backgrounds.current;

export const getEvents = state => state.events.ids.map(id => state.events.entities[id]);
export const getAreCalendarsConnected = state => state.calendars.areConnected;

export const getChitChat = (state) => {
  const events = state.events.ids.map(id => state.events.entities[id]);

  let bigTalk = '';
  let smallTalk = '';

  if (events.length === 0) {
    bigTalk = 'Today and tomorrow look clear';
    smallTalk = 'And there are no events on the horizon';
  } else {
    // const now = moment();
    // const tomorrow = moment().add(1, 'days').endOf('day');
    const upcomingEvent = events[0];
    const nextEventName = upcomingEvent.summary || 'Untitled';

    bigTalk = `${nextEventName} in 5`;
    smallTalk = 'And three other events on today';
  }

  return { bigTalk, smallTalk };
};

export const getTopSites = state => state.topSites.ids.map(id => state.topSites.entities[id]);
