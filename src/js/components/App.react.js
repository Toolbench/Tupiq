/**
 * Libs
 */
var React = require('react');
var Analytics = require('../utils/Analytics');

/**
 * Components
 */
var Background = require('./Background.react'),
    TupiqContainer = require('./TupiqContainer.react'),
    DragHintContainer = require('./DragHintContainer.react');

/**
 * Stores
 */
var BackgroundStore = require('../stores/BackgroundStore');

/**
 * Actions
 */
var BackgroundActions = require('../actions/BackgroundActions');

function getStateFromStores() {
  return {
    backgroundImage: BackgroundStore.getCurrent(),
    isBackgroundLoading: BackgroundStore.getLoading()
  }
}

/**
 * Start me up
 */
var App = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    BackgroundStore.addChangeListener(this._onChange);

    // This will be fired from the context menu background script.
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  		if ('getBackgroundInfo' in request) {
				chrome.tabs.create({
					url: this.state.backgroundImage.post_url
				});

				Analytics.trackEvent('button', 'click', 'download background');
  		}
  	}.bind(this));

    Analytics.trackPageview('/');
  },

  componentWillUnmount: function() {
    BackgroundStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  },

  render: function() {
    return(
      <div className="app-wrapper">
        <Background backgroundImage={this.state.backgroundImage} isBackgroundLoading={this.state.isBackgroundLoading} />

        <DragHintContainer />

        <TupiqContainer />
      </div>
    )
  }
});

module.exports = App;
