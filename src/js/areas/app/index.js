/* eslint-disable no-debugger */
import React from 'react';
import Background from '../background';
import Terminal from '../terminal';

// const currentVersion = chrome.runtime.getManifest().version;

const App = () => (
  <div>
    <Background />
    <Terminal />
  </div>
);

export default App;
