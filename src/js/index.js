import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import idb from 'idb-keyval';
import App from './areas/app';
import reducer from './reducers';
import sagas from './sagas';

/* eslint-disable */
const persistMiddleware = store => next => (action) => {
  next(action);

  idb.set('state', store.getState());
};

idb.get('state')
  .then(persistedState => {
    const serializedState = (persistedState) ? persistedState : undefined;
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
  })
  .catch(err => console.log('It failed!', err));
