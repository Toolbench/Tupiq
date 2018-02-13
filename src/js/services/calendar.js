/* eslint-disable */
import 'isomorphic-fetch';
import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import { backgroundSchema } from '../schemas';

const URL = 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}';
const queryStringObject = {
  'orientation': 'landscape',
  'client_id': ''
};
const toQueryString = object => Object.keys(object).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`).join('&');

function callApi(endpoint) {
  chrome.identity.getAuthToken({'interactive': true}, (authToken) => {
    if (chrome.runtime.lastError) {
        console.log('Chrome Runtime Error', chrome.runtime.lastError.message);
    }
    
    debugger;
  });
  
  /*
  return fetch(URL + endpoint)
    .then(response =>
      response.json().then(json => ({ json, response }))).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json);
      }

      const camelizedJson = camelizeKeys(json);
      const normalizedData = normalize(camelizedJson, backgroundSchema);

      return normalizedData;
    })
    .then(
      response => ({ response }),
      error => ({ error: error.message || 'Something bad happened' })
    );
  */
}

export const fetchEvents = query => {
  //const queryString = toQueryString(query ? {...queryStringObject, ...{query}} : {...queryStringObject});

  //return callApi(`/events?${queryString}`);

  return callApi('/events');
};
