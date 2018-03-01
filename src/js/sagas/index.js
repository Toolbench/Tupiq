/* eslint-disable */
import { call, put, takeLatest } from 'redux-saga/effects';
import * as actions from '../actions';
import { imageifier, unsplash, calendar } from '../services';

function* fetchBackground(action) {
  try {
    const randomBackgroundCall = yield call(unsplash.fetchRandom, action.payload);
    const randomBackground =
      randomBackgroundCall.response.entities.backgrounds[randomBackgroundCall.response.result];

    randomBackground.dataURL = yield call(
      imageifier.getImageDataURL,
      randomBackground.urls.full
    );

    yield put({ type: actions.SHUFFLE_BACKGROUND_SUCCESS, payload: randomBackground });
  } catch (error) {
    yield put({ type: actions.SHUFFLE_BACKGROUND_FAIL, error });
  }
}

function* fetchCalendar(action) {
  try {
    const fetchCalendarsCall = yield call(calendar.fetchCalendars);
    const fetchEventsCall = yield call(calendar.fetchEvents, Object.keys(fetchCalendarsCall.response.entities.calendars));

    yield put({ type: actions.FETCH_CALENDAR_SUCCESS, payload: { calendars: fetchCalendarsCall.response, events: fetchEventsCall.response }});
  } catch (error) {
    yield put({ type: actions.FETCH_CALENDAR_FAIL, error });
  }
}

function* sagas() {
  yield takeLatest(actions.SHUFFLE_BACKGROUND, fetchBackground);
  yield takeLatest(actions.FETCH_CALENDAR, fetchCalendar);
}

export default sagas;
