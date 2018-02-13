/* eslint-disable no-debugger */
import React from 'react';
import Background from '../background';
import Console from '../console';

// const currentVersion = chrome.runtime.getManifest().version;

const App = () => (
  <div id="app">
    <Background />
    <Console />
  </div>
);

export default App;
