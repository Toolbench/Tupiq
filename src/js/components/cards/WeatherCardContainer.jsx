/**
 * Libs
 */
var React = require('react');
var TupiqTools = require('../../utils/TupiqTools');
var Analytics = require('../../utils/Analytics');
var moment = require('moment');

/**
 * Stores
 */
var WeatherCardStore = require('../../stores/WeatherCardStore');

/**
 * Actions
 */
var WeatherCardActions = require('../../actions/WeatherCardActions');

/**
 * Pure component
 */
var WeatherCard = require('./WeatherCard.jsx');

/**
 * Private
 */
function getStateFromStores() {
	return {
		forecast: WeatherCardStore.getForecast(),
		isRefreshing: WeatherCardStore.getRefreshing(),
		error: WeatherCardStore.getError()
	}
}

/**
 * WeatherCardContainer
 */
var WeatherCardContainer = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		WeatherCardStore.addChangeListener(this._onChange);

		if (this.state.forecast === null || moment().diff(moment.unix(this.state.forecast.lastUpdated), 'hours') > 2) {
			WeatherCardActions.refresh();
		} else if (this.state.forecast !== null) {
			// If unit settings have changed, flag it in the refresh action so that current forecasts get wiped out
			var unitChange = this.state.forecast.forecasts.length > 0 && this.state.forecast.forecasts[0].units.temperature.toLowerCase() !== window.TupiqOptions.optsTempUnit.charAt(0);

			if (unitChange) {
				WeatherCardActions.refresh(unitChange);
			}
		}
	},

	componentWillUnmount: function() {
		WeatherCardStore.removeChangeListener(this._onChange);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	},

	render: function() {
		return (
			<WeatherCard
				forecast={this.state.forecast}
				isRefreshing={this.state.isRefreshing}
				error={this.state.error} />
		)
	}
});

module.exports = WeatherCardContainer;
