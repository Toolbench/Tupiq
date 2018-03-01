import { combineReducers } from 'redux';
import backgrounds from './backgrounds';
import events from './events';
import calendars from './calendars';

export default combineReducers({
  backgrounds,
  events,
  calendars
});
