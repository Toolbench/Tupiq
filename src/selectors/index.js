import { generateChitChat } from '../utils';

export const getUsedBackgroundIDs = state => state.backgrounds.used;
export const getCurrentBackground = state => state.backgrounds.current;

export const getEvents = state => state.events.ids.map(id => state.events.entities[id]);
export const getAreCalendarsConnected = state => state.calendars.areConnected;

export const getChitChat = (state) => {
  const events = state.events.ids.map(id => state.events.entities[id]);

  return generateChitChat(events);
};

export const getTopSites = state => state.topSites.ids.map(id => state.topSites.entities[id]);
