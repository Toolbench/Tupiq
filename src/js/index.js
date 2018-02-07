/*
import LZString from 'lz-string';

const persistedState = localStorage.getItem('state');
const serializedState = (persistedState) ?
  JSON.parse(LZString.decompress(persistedState)) : undefined;

const quickie = document.getElementById('quickie');
quickie.style.backgroundImage = `url(${serializedState.backgrounds.current.dataURL})`;
quickie.style.position = 'absolute';
quickie.style.top = 0;
quickie.style.left = 0;
quickie.style.height = '100%';
quickie.style.width = '100%';
quickie.style.backgroundSize = 'cover';
quickie.style.backgroundPosition = 'center center';
*/

import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
// import LZString from 'lz-string';
import App from './areas/app';
import reducer from './reducers';
import sagas from './sagas';

// localStorage.clear();

const persistMiddleware = store => next => (action) => {
  next(action);
  localStorage.setItem('state', JSON.stringify(store.getState()));
  // localStorage.setItem('state', LZString.compress(JSON.stringify(store.getState())));
};

const persistedState = localStorage.getItem('state');
const serializedState = (persistedState) ?
  JSON.parse(persistedState) : undefined;
  // JSON.parse(LZString.decompress(persistedState)) : undefined;

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  serializedState,
  applyMiddleware(sagaMiddleware, persistMiddleware, logger)
);

const views = chrome.extension.getViews();
const backgroundPage = chrome.extension.getBackgroundPage();
console.log('VIEWS', views);
console.log('BACKGROUNDPAGE', backgroundPage);

chrome.runtime.sendMessage({ type: 'GimmeImage' }, (response) => {
  console.log(response);
});

sagaMiddleware.run(sagas);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
