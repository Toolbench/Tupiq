/* eslint-disable */
import { combineReducers } from 'redux';
import * as actions from '../actions';

export const ids = (state = [], action) => {
  switch (action.type) {
    case actions.UPDATE_ALL_BACKGROUNDS:
      return action.payload.result;
      break;
    default:
      return state;
  }
};

export const entities = (state = {}, action) => {
  switch (action.type) {
    case actions.UPDATE_ALL_BACKGROUNDS:
      return action.payload.entities.backgrounds;
      break;
    default:
      return state;
  }
};

export const used = (state = [], action) => {
  switch (action.type) {
    case actions.SHUFFLE_BACKGROUND_SUCCESS:
      return [...state, action.payload.id];
      break;
    default:
      return state;
  }
};

export const current = (state = {}, action) => {
  switch (action.type) {
    case actions.SHUFFLE_BACKGROUND_SUCCESS:
      return action.payload;
      break;
    default:
      return state;
  }
};

export default combineReducers({
  backgrounds: combineReducers({
    ids,
    entities,
    used,
    current
  })
});
