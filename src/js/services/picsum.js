/* eslint-disable */
import 'isomorphic-fetch';

const URL = 'https://picsum.photos/';

function callApi(endpoint) {
  return fetch(URL + endpoint)
    .then(response =>
      response.json().then(json => ({ json, response }))).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json);
      }

      return json;
    })
    .then(
      response => ({ response }),
      error => ({ error: error.message || 'Something bad happened' })
    );
}

// api services
export const fetchList = () => callApi('list');
