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

function callApi(endpoint, schema) {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (authToken) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      }

      const isBatch = Array.isArray(endpoint);
      const url = isBatch ? BATCH_URL : `${URL}${endpoint}`;
      const options = !isBatch ? { headers: { Authorization: `Bearer ${authToken}` } } : {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/mixed; boundary="batch_tupiq"'
        },
        body: createBatchBody(endpoint, 'batch_tupiq')
      };
      
      fetch(url, options)
        .then(response => {
          const parser = isBatch ? response.text.bind(response) : response.json.bind(response);

          return parser().then(parsed => ({ parsed, response })).then(({ parsed, response }) => {
            if (!response.ok) {
              return reject(parsed);
            }

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
          });
        })
        .then(
          response => resolve({ response }),
          error => ({ error: error.message || 'Something bad happened' })
        );
    });
  });
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

export const fetchCalendars = () => callApi('/users/me/calendarList?fields=items(id,summary,timeZone,selected)', arrayOfCalendars);
