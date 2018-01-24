/* eslint-disable */
import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as actions from '../actions';
import { getAllBackgroundIDs, getUsedBackgroundIDs, getRandomUnusedBackground } from '../selectors';
import { picsum, unsplash } from '../services';

function* fetchBackground(action) {
  try {
    let allBackgroundIDs = yield select(getAllBackgroundIDs);
    let usedBackgroundIDs = yield select(getUsedBackgroundIDs);

    if (allBackgroundIDs.length === 0) {
      const backgroundList = yield call(picsum.fetchList, action);
      
      yield put({ type: actions.UPDATE_ALL_BACKGROUNDS, payload: backgroundList.response });
      
      allBackgroundIDs = yield select(getAllBackgroundIDs);
    }

    let randomBackground = yield select(getRandomUnusedBackground);
    const backgroundImageDataURL = yield call(unsplash.getImageDataURL, randomBackground.postUrl);

    //randomBackground.dataURL = backgroundImageDataURL;

    debugger;

    yield put({ type: actions.SHUFFLE_BACKGROUND_SUCCESS, payload: randomBackground });
  } catch (error) {
    yield put({ type: actions.SHUFFLE_BACKGROUND_FAIL, error });
  }
}

function* sagas() {
  yield takeLatest(actions.SHUFFLE_BACKGROUND, fetchBackground);
}

export default sagas;
