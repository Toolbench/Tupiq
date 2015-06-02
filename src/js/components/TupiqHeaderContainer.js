/**
 * Libs
 */
var React = require('react');
var Analytics = require('../utils/Analytics');

/**
 * Pure component
 */
var TupiqHeader = require('./TupiqHeader');

/**
 * Stores
 */
var BackgroundStore = require('../stores/BackgroundStore');

/**
 * Actions
 */
var BackgroundActions = require('../actions/BackgroundActions');

/**
 * Private
 */
function getStateFromStores() {
  return {
  	isBackgroundLoading: BackgroundStore.getLoading(),
  	backgroundShuffleProgress: BackgroundStore.getShuffleProgress(),
  	hasBackgroundErrored: BackgroundStore.getErrored()
  }
}

/**
 * TupiqHeaderContainer
 */
var TupiqHeaderContainer = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    BackgroundStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    BackgroundStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  },

  onClick: function(event) {
  	Analytics.trackEvent('Button', 'Click', 'Shuffle Background');

    if (this.state.isBackgroundLoading === false && this.state.hasBackgroundErrored === false) {
      BackgroundActions.backgroundShuffle();
    }
  },

  render: function(){
    return (
      <TupiqHeader
      	onMouseDown={this.props.onMouseDown}
      	onClick={this.onClick}
      	isBackgroundLoading={this.state.isBackgroundLoading}
      	backgroundShuffleProgress={this.state.backgroundShuffleProgress}
      	hasBackgroundErrored={this.state.hasBackgroundErrored} />
    )
  }
});

module.exports = TupiqHeaderContainer;
