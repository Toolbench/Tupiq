/* eslint-disable */
import { call, put, takeLatest } from 'redux-saga/effects';
import * as actions from '../actions';
import { imageifier, unsplash, calendar, topSites } from '../services';

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
    const fetchCalendarsCall = yield call(calendar.fetchCalendars, action.payload.interactive);
    const fetchEventsCall = yield call(calendar.fetchEvents, Object.keys(fetchCalendarsCall.response.entities.calendars));

    yield put({ type: actions.FETCH_CALENDAR_SUCCESS, payload: { calendars: fetchCalendarsCall.response, events: fetchEventsCall.response }});
  } catch (error) {
    yield put({ type: actions.FETCH_CALENDAR_FAIL, error });
  }
}

function* fetchTopSites() {
  try {
    const fetchTopSitesCall = yield call(topSites.fetchTopSites);
    yield put({ type: actions.FETCH_TOP_SITES_SUCCESS, payload: fetchTopSitesCall});
  } catch (error) {
    debugger;
  }
}

function* sagas() {
  yield takeLatest(actions.SHUFFLE_BACKGROUND, fetchBackground);
  yield takeLatest(actions.FETCH_CALENDAR, fetchCalendar);
  yield takeLatest(actions.FETCH_TOP_SITES, fetchTopSites);
}

export default sagas;
