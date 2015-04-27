/**
 * Libs
 */
var React = require('react');
var TupiqTools = require('../../utils/TupiqTools');
var Analytics = require('../../utils/Analytics');

/**
 * Stores
 */
//var CalendarStore = require('../stores/CalendarStore');

/**
 * Actions
 */
//var CalendarActions = require('../actions/CalendarActions');

/**
 * Pure component
 */
var WeatherCard = require('./WeatherCard.jsx');

/**
 * Private
 */
function getStateFromStores() {
	return {}
}

/**
 * WeatherCardContainer
 */
var WeatherCardContainer = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		//CalendarStore.addChangeListener(this._onChange);

		var request = new XMLHttpRequest();
		//request.open('GET', "https://query.yahooapis.com/v1/public/yql?q=select wind from weather.forecast where woeid in (select woeid from geo.places(1) where text='chicago, il')&format=json", true);
		request.open('GET', "https://query.yahooapis.com/v1/public/yql?q=SELECT * FROM geo.placefinder WHERE text='-36.8925443, 174.86995869999998' and gflags='R'&format=json", true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    debugger;
		    var data = JSON.parse(request.responseText);
		  } else {
		    debugger;
		  }
		};

		request.onerror = function() {
		  debugger;
		};

		request.send();

		navigator.geolocation.getCurrentPosition(function(position) {
		    console.log(position);
		}, function(error) {
		    console.error(error);
		});

		// Get WOEID
		// https://query.yahooapis.com/v1/public/yql?q=SELECT * FROM geo.placefinder WHERE text='-36.8925443, 174.86995869999998' and gflags='R'&format=json

		// Auckland WOEID: 29344269

		//https://query.yahooapis.com/v1/public/yql?q=select wind from weather.forecast where woeid in (select woeid from geo.places(1) where text='chicago, il')&format=json
	},

	componentWillUnmount: function() {
		//CalendarStore.removeChangeListener(this._onChange);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	},

	render: function() {
		return (
			<WeatherCard />
		)
	}
});

module.exports = WeatherCardContainer;
