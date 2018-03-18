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
    case actions.UPDATE_ALL_BACKGROUNDS:
      return action.payload.entities.backgrounds;
    default:
      return state;
  }
};

export const used = (state = [], action) => {
  switch (action.type) {
    case actions.SHUFFLE_BACKGROUND_SUCCESS:
      return [...state, action.payload.id];
    default:
      return state;
  }
};

export const current = (state = {}, action) => {
  switch (action.type) {
    case actions.SHUFFLE_BACKGROUND_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  ids,
  entities,
  used,
  current
});
