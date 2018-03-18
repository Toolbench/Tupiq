import { normalize } from 'normalizr';
import { arrayOfTopSites } from '../schemas/topSites';

export const fetchTopSites = () => new Promise((resolve) => {
  chrome.topSites.get((topSites) => {
    resolve(normalize(topSites, arrayOfTopSites));
  });
});
