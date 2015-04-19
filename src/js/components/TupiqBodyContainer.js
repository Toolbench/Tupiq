/**
 * Libs
 */
var React = require('react');
var TupiqTools = require('../utils/TupiqTools');

/**
 * Stores
 */
var CalendarStore = require('../stores/CalendarStore');

/**
 * Actions
 */
var CalendarActions = require('../actions/CalendarActions');

/**
 * Pure component
 */
var TupiqBody = require('./TupiqBody');
var TupiqCalendar = require('./TupiqCalendar');

/**
 * Private
 */
function getStateFromStores() {
  return {
    isCalendarConnected: CalendarStore.getConnected(),
    isCalendarConnecting: CalendarStore.getConnecting(),
    isCalendarRefreshing: CalendarStore.getRefreshing(),
    refreshedTime: CalendarStore.getRefreshedTime(),
    upcomingEvents: CalendarStore.getUpcomingEvents()
  }
}

/**
 * TupiqBodyContainer
 */
var TupiqBodyContainer = React.createClass({
  intervalID: null,

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    CalendarStore.addChangeListener(this._onChange);

    this.onIntervalTick();

    this.checkInterval();
  },

  componentWillUnmount: function() {
    CalendarStore.removeChangeListener(this._onChange);

    this.resetInterval();
  },

  _onChange: function() {
    this.setState(getStateFromStores());

    setTimeout(this.checkInterval);
  },

  checkInterval: function() {
    if (this.state.isCalendarConnected && this.intervalID === null) {
      this.intervalID = setInterval(this.onIntervalTick, 60000);
    } else if (!this.state.isCalendarConnected) {
      this.resetInterval();
    }
  },

  resetInterval: function() {
    if (this.intervalID !== null) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }
  },

  onIntervalTick: function() {
    if (this.state.isCalendarConnected) {
      if (this.state.refreshedTime === null || (Date.now() - this.state.refreshedTime) / 1000 > 300) {
        CalendarActions.refresh();
      } else {
        this.forceUpdate();
      }
    }
  },

  onAddCalendarClick: function() {
  	if (!this.state.isCalendarConnected && !this.state.isCalendarConnecting) {
  		CalendarActions.connect();
  	}
  },

  render: function() {
    var agenda = TupiqTools.agenda(this.state.upcomingEvents);

    // If we're connected and not awaiting events
    if (this.state.isCalendarConnected && this.state.upcomingEvents !== null) {
	    return (
	      <TupiqCalendar
	      	primaryNote={agenda.primaryNote}
	        secondaryNote={agenda.secondaryNote} />
	    )
    } else {
	    return (
	      <TupiqBody
	      	// If we're connecting, or already connected but still awaiting events
	      	isCalendarConnecting={this.state.isCalendarConnecting || (this.state.isCalendarConnected && this.state.upcomingEvents === null)}
	      	onAddCalendarClick={this.onAddCalendarClick} />
	    )
    }
  }
});

module.exports = TupiqBodyContainer;
