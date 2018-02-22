/* eslint-disable */
import 'isomorphic-fetch';
import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import { createBatchBody, parseBatchResponse } from 'google-api-batch-utils';
import { arrayOfCalendars } from '../schemas';

const URL = 'https://www.googleapis.com/calendar/v3';
const BATCH_URL = 'https://www.googleapis.com/batch/calendar/v3';
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
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (authToken) => {
      let uris = calendarIds.map(calendarId => ({ uri: `/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events` }));

      fetch(BATCH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/mixed; boundary="batch_tupiq"',
          Authorization: `Bearer ${authToken}`
        },
        body: createBatchBody(uris, 'batch_tupiq')
      }).then((response) => {
        readStream(response.body).then(raw => {
          debugger;
        });
      }).catch(function(error) {
        debugger;
        console.log("error");
      });
    });
  });
};

export const fetchCalendars = () => callApi('/users/me/calendarList', arrayOfCalendars);

function readStream(stream) {
  const reader = stream.getReader();
  let result = '';

  // read() returns a promise that resolves
  // when a value has been received
  return new Promise((resolve, reject) => {
    reader.read().then(function processText({ done, value }) {
      if (done) {
        resolve(result);
      }

      result += value;

      // Read some more, and call this function again
      return reader.read().then(processText);
    });
  });
}