import { combineReducers } from 'redux';
import backgrounds from './backgrounds';
import events from './events';

export default combineReducers({
  backgrounds,
  events
});
