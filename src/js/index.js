import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import App from './areas/app';
import reducer from './reducers';
import sagas from './sagas';

const persistMiddleware = store => next => (action) => {
  next(action);
  localStorage.setItem('state', JSON.stringify(store.getState()));
};

const persistedState = localStorage.getItem('state');
const serializedState = (persistedState) ? JSON.parse(persistedState) : undefined;

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
