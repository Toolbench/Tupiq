import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import LZString from 'lz-string';
import logger from 'redux-logger';
import App from './areas/app';
import reducer from './reducers';
import sagas from './sagas';

/* eslint-disable */
let transaction;

const request = indexedDB.open('tupiq', 1);

request.onupgradeneeded = event => {
  const db = event.target.result;

  db.createObjectStore('state');
}

request.onsuccess = event => {
  const db = event.target.result;
  const objectStore = db.transaction(['state'], 'readwrite').objectStore('state');

  const persistMiddleware = store => next => (action) => {
    next(action);

    const objectStore = db.transaction(['state'], 'readwrite').objectStore('state');
    const request = objectStore.put(LZString.compressToUint8Array(JSON.stringify(store.getState())), 'theState');

    request.onsuccess = event => {
      console.log('great success');
    }
  };

  const getPersistedStateRequest = objectStore.get('theState');

  getPersistedStateRequest.onsuccess = event => {
    const persistedState = event.target.result;
    const serializedState = (persistedState) ? JSON.parse(LZString.decompressFromUint8Array(persistedState)) : undefined;
    const sagaMiddleware = createSagaMiddleware();
    
    const store = createStore(
      reducer,
      serializedState,
      applyMiddleware(sagaMiddleware, persistMiddleware, logger)
    );
    
    sagaMiddleware.run(sagas);
    
    render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    );  
  }

  getPersistedStateRequest.onerror = error => {
    //debugger;
  }
}
