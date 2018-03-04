import { combineReducers } from 'redux';
import * as actions from '../actions';

export const ids = (state = [], action) => {
  switch (action.type) {
    case actions.FETCH_TOP_SITES_SUCCESS:
      return action.payload.result;
    default:
      return state;
  }
};

export const entities = (state = {}, action) => {
  switch (action.type) {
    case actions.FETCH_TOP_SITES_SUCCESS:
      return action.payload.entities.topSites;
    default:
      return state;
  }
};

export default combineReducers({
  ids,
  entities
});
