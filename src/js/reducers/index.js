/* eslint-disable */
import { combineReducers } from 'redux';
import * as actions from '../actions';

export const ids = (state = [], action) => {
  switch (action.type) {
    case actions.UPDATE_ALL_BACKGROUNDS:
      return action.payload.result;
    default:
      return state;
  }
};

export const entities = (state = {}, action) => {
  switch (action.type) {
    case action.SHUFFLE_BACKGROUND_SUCCESS:
      debugger;
    case actions.UPDATE_ALL_BACKGROUNDS:
      return action.payload.entities.backgrounds;
    default:
      return state;
  }
};

export const used = (state = [], action) => {
  switch (action.type) {
    case action.SHUFFLE_BACKGROUND_SUCCESS:
      debugger;
      return [...state, action.payload.id];
    default:
      return state;
  }
};

export const current = (state = {}, action) => {
  switch (action.type) {
    case action.SHUFFLE_BACKGROUND_SUCCESS:
      debugger;
      return action.payload;
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
