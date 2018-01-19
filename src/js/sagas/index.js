/* eslint-disable */
import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as actions from '../actions';
import { getAllBackgrounds, getUsedBackgrounds } from '../selectors';
import { picsum } from '../services';

function* fetchBackground(action) {
  try {
    let allBackgrounds = yield select(getAllBackgrounds);
    let usedBackgrounds = yield select(getUsedBackgrounds);

    if (allBackgrounds.length === 0) {
      allBackgrounds = yield call(picsum.fetchList, action).response;
      yield put({ type: actions.UPDATE_ALL_BACKGROUNDS, payload: allBackgrounds });
    }

    const background = yield call(() => {}, action);
    yield put({ type: actions.SHUFFLE_BACKGROUND_SUCCESS, background });
  } catch (error) {
    yield put({ type: actions.SHUFFLE_BACKGROUND_FAIL, error });
  }
}

function* sagas() {
  yield takeLatest(actions.SHUFFLE_BACKGROUND, fetchBackground);
}

export default sagas;
