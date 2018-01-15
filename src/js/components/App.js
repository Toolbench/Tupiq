/* eslint-disable no-debugger */
import React, { Component } from 'react';

// const currentVersion = chrome.runtime.getManifest().version;

class App extends Component {
  onLoadClick() {
    console.log(this);

    debugger;
  }

  render() {
    return (
      <div>
        <button onClick={this.onLoadClick}>Loadit!!</button>
      </div>
    );
  }
}

export default App;
