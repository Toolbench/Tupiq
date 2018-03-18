/* eslint-disable no-debugger */
import React from 'react';
import Background from '../background';
import Console from '../console';
import styles from './index.scss';

// const currentVersion = chrome.runtime.getManifest().version;

const App = () => (
  <div id={styles.app}>
    <Background />
    <Console />
  </div>
);

export default App;