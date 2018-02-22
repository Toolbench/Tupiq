/* eslint-disable */
import 'isomorphic-fetch';
import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import { backgroundSchema } from '../schemas';
import { toQueryString } from '../util';

const URL = 'https://api.unsplash.com';
const queryStringObject = {
  'orientation': 'landscape',
  'client_id': ''
};

function callApi(endpoint) {
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
}

export const fetchRandom = query => {
  const queryString = toQueryString(query ? {...queryStringObject, ...{query}} : {...queryStringObject});

  return callApi(`/photos/random?${queryString}`);
};
