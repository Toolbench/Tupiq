/**
 * Libs
 */
var React = require('react');
var Analytics = require('../utils/Analytics');
var Persist = require('../utils/Persist');
var moment = require('moment');

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
    var now = moment();
  	console.info('App:componentDidMount:', now.diff(window.startTime));

    BackgroundStore.addChangeListener(this._onChange);

    // This will be fired from the context menu background script.
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  		if ('getBackgroundInfo' in request) {
				chrome.tabs.create({
					url: this.state.backgroundImage.post_url
				});

				Analytics.trackEvent('Button', 'Click', 'Download Background');
  		} else if ('reset' in request) {
  			Persist.clear();

  			window.location.reload();

  			Analytics.trackEvent('Button', 'Click', 'Reset');
  		} else if ('settings' in request) {
				if (chrome.runtime.openOptionsPage) {
					// New way to open options pages, if supported (Chrome 42+).
					chrome.runtime.openOptionsPage();
				} else {
					// Reasonable fallback.
					window.open(chrome.runtime.getURL('options.html'));
				}

  			Analytics.trackEvent('Button', 'Click', 'Settings');
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

        <div className="tupiq-wrapper">
        	<div className="inner">
        		<TupiqContainer />
        	</div>
        </div>
      </div>
    )
  }
});

module.exports = App;
