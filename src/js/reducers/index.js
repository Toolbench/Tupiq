import { combineReducers } from 'redux';
import * as actions from '../actions';

export const backgrounds = (state = { all: [], used: [] }, action) => {
  switch (action.type) {
    case actions.UPDATE_ALL_BACKGROUNDS:
      return {
        all: action.payload,
        used: []
      };
    default:
      return state;
  }
};

export default combineReducers({
  backgrounds
});


/*
{
    background: {
        isFetching: true,
        url: 'https://www.flickr.com/photos/ilovegreenland/13187636953/in/set-72157632226028027',
        data:
    }
}
*/
