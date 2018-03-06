/* eslint-disable */
import 'isomorphic-fetch';
import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import moment from 'moment';
import { createBatchBody, parseBatchResponse } from 'google-api-batch-utils';
import { arrayOfCalendars, array, arrayOfEvents } from '../schemas';
import { toQueryString } from '../util';

const URL = 'https://www.googleapis.com/calendar/v3';
const BATCH_URL = 'https://www.googleapis.com/batch/calendar/v3';

// chrome://identity-internals/

function getAuthToken(interactive = false) {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive }, (authToken) => {
      debugger;
      
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }

      resolve(authToken);
    });
  });
}

function callApi(endpoint, schema, interactive) {
  const isBatch = Array.isArray(endpoint);
  let response;
  
  return getAuthToken(interactive)
    .then(authToken => {
      const url = isBatch ? BATCH_URL : `${URL}${endpoint}`;
      const options = !isBatch ? { headers: { Authorization: `Bearer ${authToken}` } } : {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/mixed; boundary="batch_tupiq"'
        },
        body: createBatchBody(endpoint, 'batch_tupiq')
      };
      
      return fetch(url, options);
    })
    .then(response => {
      if (!response.ok) {
        // chrome.identity.removeCachedAuthToken
        return Promise.reject(new Error(response.statusText || 'Something bad happened'));
      }
      
      const parser = isBatch ? response.text.bind(response) : response.json.bind(response);

      return parser();
    })
    .then(parsed => parsed )
    .then(parsed => {
      if (isBatch) {
        parsed = parseBatchResponse(parsed).reduce((a, b) => {
          return [...a, ...b.items];
        }, []);
      } else {
        parsed = parsed.items;
      }

      const camelizedJson = camelizeKeys(parsed);
      const normalizedData = normalize(camelizedJson, schema);

      return normalizedData;
    })
    .then(response => ({ response }))
    .catch(error => { error: error.message || 'Something bad happened' });
}

export const fetchEvents = calendarIds => {
  const today = moment();
  const queryStringObject = {
    timeMin: today.format('YYYY-MM-DD[T]HH:mm:ssZ'),
    timeMax: today.add(1, 'days').endOf('day').format('YYYY-MM-DD[T]HH:mm:ssZ'),
    fields: 'items(status,description,attendees,htmlLink,hangoutLink,summary,location,start,end,id)',
    maxResults: 500,
    orderBy: 'startTime',
    singleEvents: 'true'
  };
  const uris = calendarIds.map(calendarId => ({ uri: `/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${toQueryString(queryStringObject)}` }));
  
  return callApi(uris, arrayOfEvents);
};

export const fetchCalendars = (interactive) => callApi('/users/me/calendarList?fields=items(id,summary,timeZone,selected)', arrayOfCalendars, interactive);
