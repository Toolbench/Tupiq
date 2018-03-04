import React from 'react';
import Terminal from './terminal';
import Agenda from './agenda';
import TopSites from './topSites';

const Console = () => (
  <div id="console">
    <Terminal />
    <Agenda />
    <TopSites />
  </div>
);

export default Console;
