import { combineReducers } from 'redux';
import * as actions from '../actions';

export const ids = (state = [], action) => {
  switch (action.type) {
    case actions.FETCH_CALENDAR_SUCCESS:
      return action.payload.calendars.result || [];
    default:
      return state;
  }
};

export const entities = (state = {}, action) => {
  switch (action.type) {
    case actions.FETCH_CALENDAR_SUCCESS:
      return action.payload.calendars.entities.calendars || {};
    default:
      return state;
  }
};

export const areConnected = (state = false, action) => {
  switch (action.type) {
    case actions.FETCH_CALENDAR_SUCCESS:
      return true;
    default:
      return state;
  }
};

export default combineReducers({
  ids,
  entities,
  areConnected
});
