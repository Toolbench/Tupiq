/* eslint-disable */
import 'isomorphic-fetch';
import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import { arrayOfCalendars } from '../schemas';

const URL = 'https://www.googleapis.com/calendar/v3';
const queryStringObject = {};
const toQueryString = object => Object.keys(object).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`).join('&');

function callApi(endpoint, schema) {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (authToken) => {
      if (chrome.runtime.lastError) {
        console.log('Chrome Runtime Error', chrome.runtime.lastError.message);
      }

      fetch(URL + endpoint, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        })
        .then(response =>
          response.json().then(json => ({ json, response }))).then(({ json, response }) => {
          if (!response.ok) {
            reject(json);
          }

          const camelizedJson = camelizeKeys(json.items);
          const normalizedData = normalize(camelizedJson, schema);

          return normalizedData;
        })
        .then(
          response => resolve({ response }),
          error => reject({ error: error.message || 'Something bad happened' })
        );
    });
  });
}

export const fetchEvents = calendarIds => {
  //const queryString = toQueryString(query ? {...queryStringObject, ...{query}} : {...queryStringObject});

  //return callApi(`/events?${queryString}`);

  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (authToken) => {
      // batch
    });
  });

  //return callApi('/calendars/{calendarId}/events');
};

export const fetchCalendars = () => callApi('/users/me/calendarList', arrayOfCalendars);
