import React from 'react';
import Terminal from '../terminal';

const Console = () => (
  <div id="console">
    <Terminal />
    <div id="calendar">
      <div>
        <p>You got Design Review in 5 minutes.</p>
        <p>And three more events today.</p>
      </div>
    </div>
  </div>
);

export default Console;
