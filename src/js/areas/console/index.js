import React from 'react';
import Terminal from './terminal';
import Agenda from './agenda';
import TopSites from './topSites';
import styles from './index.scss';

const Console = () => (
  <div id={styles.console}>
    <Terminal />
    <Agenda />
    <TopSites />
  </div>
);

export default Console;
