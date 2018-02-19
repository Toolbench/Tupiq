import { schema } from 'normalizr';

export const calendarSchema = new schema.Entity('calendars', { idAttribute: 'id' });
export const arrayOfCalendars = [calendarSchema];
