import { combineReducers } from 'redux';
import * as actions from '../actions';

export const ids = (state = [], action) => {
  switch (action.type) {
    case actions.FETCH_CALENDAR_SUCCESS:
      return action.payload.events.result || [];
    default:
      return state;
  }
};

export const entities = (state = {}, action) => {
  switch (action.type) {
    case actions.FETCH_CALENDAR_SUCCESS:
      return action.payload.events.entities.events || {};
    default:
      return state;
  }
};

export default combineReducers({
  ids,
  entities
});
