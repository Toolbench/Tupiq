import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as actions from '../actions';
import { getAllBackgroundIDs, getRandomBackground } from '../selectors';
import { picsum, unsplash } from '../services';

function* fetchBackground(action) {
  try {
    let allBackgroundIDs = yield select(getAllBackgroundIDs);

    if (allBackgroundIDs.length === 0) {
      const backgroundList = yield call(picsum.fetchList, action);

      yield put({ type: actions.UPDATE_ALL_BACKGROUNDS, payload: backgroundList.response });

      allBackgroundIDs = yield select(getAllBackgroundIDs);
    }

    const randomBackground = yield select(getRandomBackground);
    randomBackground.dataURL = yield call(unsplash.getImageDataURL, randomBackground.postUrl);

    yield put({ type: actions.SHUFFLE_BACKGROUND_SUCCESS, payload: randomBackground });
  } catch (error) {
    yield put({ type: actions.SHUFFLE_BACKGROUND_FAIL, error });
  }
}

function* sagas() {
  yield takeLatest(actions.SHUFFLE_BACKGROUND, fetchBackground);
}

export default sagas;
