import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as actions from '../actions';
import { getAllBackgrounds } from '../selectors';

function* fetchBackground(action) {
  try {
    const allBackgrounds = yield select(getAllBackgrounds);
    console.log(allBackgrounds);
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
