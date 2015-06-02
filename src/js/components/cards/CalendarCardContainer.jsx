/**
 * Libs
 */
var React = require('react');
var TupiqTools = require('../../utils/TupiqTools');
var Analytics = require('../../utils/Analytics');

/**
 * Stores
 */
var CalendarStore = require('../../stores/CalendarStore');

/**
 * Actions
 */
var CalendarActions = require('../../actions/CalendarActions');

/**
 * Pure component
 */
var CalendarCardBody = require('./CalendarCardBody.jsx');
var CalendarCard = require('./CalendarCard.jsx');

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
 * CalendarCardContainer
 */
var CalendarCardContainer = React.createClass({
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

  	Analytics.trackEvent('Button', 'Click', 'Connect Calendar');
  },

  onCloseButtonClick: function() {
  	CalendarActions.disconnect();

  	Analytics.trackEvent('Button', 'Click', 'Disconnect Calendar');
  },

  onEventClick: function(event) {
  	// Rough way to determine we're clicking on the event name
  	if(event.target.classList.contains('event-name')) {
			chrome.tabs.create({
				url: this.state.upcomingEvents[0].htmlLink
			});

			Analytics.trackEvent('Button', 'Click', 'Upcoming Event Info');
  	}
  },

  render: function() {
    // If we're connected and not awaiting events
    if (this.state.isCalendarConnected && this.state.upcomingEvents !== null) {
	    var agenda = TupiqTools.agenda(this.state.upcomingEvents);

	    return (
	      <CalendarCard
	      	onCloseButtonClick={this.onCloseButtonClick}
	      	onEventClick={this.onEventClick}
	      	primaryNote={agenda.primaryNote}
	        secondaryNote={agenda.secondaryNote}
	        upcomingEvents={this.state.upcomingEvents} />
	    )
    } else {
	    return (
	      <CalendarCardBody
	      	// If we're connecting, or already connected but still awaiting events
	      	isCalendarConnecting={this.state.isCalendarConnecting || (this.state.isCalendarConnected && this.state.upcomingEvents === null)}
	      	onAddCalendarClick={this.onAddCalendarClick} />
	    )
    }
  }
});

module.exports = CalendarCardContainer;
