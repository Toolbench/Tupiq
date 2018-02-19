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

export default combineReducers({
  ids,
  entities
});
