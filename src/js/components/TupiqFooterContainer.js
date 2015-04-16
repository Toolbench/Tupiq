/**
 * Libs
 */
var React = require('react');

/**
 * Pure component
 */
var TupiqFooter = require('./TupiqFooter');

/**
 * Stores
 */
var BackgroundStore = require('../stores/BackgroundStore');
var CalendarStore = require('../stores/CalendarStore');

/**
 * Actions
 */
var BackgroundActions = require('../actions/BackgroundActions');
var CalendarActions = require('../actions/CalendarActions');

/**
 * Private
 */
function getStateFromStores() {
  return {
    isBackgroundLoading: BackgroundStore.getLoading(),
    isCalendarConnected: CalendarStore.getConnected(),
    isCalendarConnecting: CalendarStore.getConnecting(),
    isCalendarRefreshing: CalendarStore.getRefreshing()
  }
}

/**
 * TupiqFooterContainer
 */
var TupiqFooterContainer = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    BackgroundStore.addChangeListener(this._onChange);
    CalendarStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    BackgroundStore.removeChangeListener(this._onChange);
    CalendarStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  },

  onShuffleBackgroundClick: function() {
    if (this.state.isBackgroundLoading === false) {
      BackgroundActions.backgroundShuffle();
    }
  },

  onToggleCalendarClick: function() {
    if (this.state.isCalendarConnected) {
      CalendarActions.disconnect();
    } else {
      CalendarActions.connect();
    }
  },

  render: function(){
    return (
      <TupiqFooter
        onToggleCalendarClick={this.onToggleCalendarClick}
        onShuffleBackgroundClick={this.onShuffleBackgroundClick}
        isCalendarConnecting={this.state.isCalendarConnecting}
        isCalendarRefreshing={this.state.isCalendarRefreshing}
        isCalendarConnected={this.state.isCalendarConnected}
      	isBackgroundLoading={this.state.isBackgroundLoading} />
    )
  }
});

module.exports = TupiqFooterContainer;
