/* eslint-disable */
import { normalize } from 'normalizr';
import { arrayOfTopSites } from '../schemas/topSites';

export const fetchTopSites = () => new Promise((resolve) => {
  debugger;
  chrome.topSites.get((topSites) => {
    debugger;
    resolve(normalize(topSites, arrayOfTopSites));
  });
});
