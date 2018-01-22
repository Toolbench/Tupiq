import 'isomorphic-fetch';
import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import arrayOfBackgrounds from '../schemas';

const URL = 'https://picsum.photos/';

function callApi(endpoint) {
  return fetch(URL + endpoint)
    .then(response =>
      response.json().then(json => ({ json, response }))).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json);
      }

      const camelizedJson = camelizeKeys(json);
      const normalizedData = normalize(camelizedJson, arrayOfBackgrounds);

      console.log(normalizedData);
      return normalizedData;
    })
    .then(
      response => ({ response }),
      error => ({ error: error.message || 'Something bad happened' })
    );
}

// api services
export const fetchList = () => callApi('list');
