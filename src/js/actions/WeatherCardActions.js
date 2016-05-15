var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Persist = require('../utils/Persist');
var request = require('superagent');
var moment = require('moment');

function refresh() {
	getCoordinates(function(err, coords) {
		if (err) {
			dispatchError(err);
		} else {
			getLocationID(coords, function(err, res) {
				if (err) {
					dispatchError(err);
				} else {
					var query = res.body.query;

					if (query.count === 0) {

					} else {
						var location = (query.results.isArray) ? query.results[0].place : query.results.place;

						getForecast(location, function(err, res) {
							if (err) {
								dispatchError(err);
							} else {
								var query = res.body.query;

								if (query.count === 0) {

								} else {
									var forecast = {
										location: location,
										lastUpdated: moment().unix(),
										forecasts: query.results.channel
									};

									AppDispatcher.dispatch({
										actionType: AppConstants.WEATHER_REFRESH_SUCCESS,
										// Read the store's desc on why this is needed
										unitUsed: window.TupiqOptions.optsTempUnit,
										forecast: forecast
									});
								}
							}
						});
					}
				}
			});
		}
	});
}

function dispatchError(err) {
	AppDispatcher.dispatch({
		actionType: AppConstants.WEATHER_REFRESH_ERROR,
		error: err
	});
}

function getForecast(location, callback) {
	var unit;

	// If no unit has been set assume auto and base on countrycode
	if (window.TupiqOptions.optsTempUnit.length === 0) {
		unit = location.country.code === 'US' ? 'f' : 'c';
	} else {
		unit = window.TupiqOptions.optsTempUnit === 'celcius' ? 'c' : 'f';
	}

	request
		.get('https://query.yahooapis.com/v1/public/yql')
		.query({ q: "select units,item.forecast from weather.forecast where woeid='" + location.woeid + "' and u='" + unit + "'", format: 'json' })
		.end(callback);
}

function getLocationID(coords, callback) {
	request
		.get('https://query.yahooapis.com/v1/public/yql')
		.query({ q: "SELECT city,country,countrycode,latitude,longitude,woeid,woetype FROM geo.places WHERE text='(" + coords.latitude + "," + coords.longitude + ")'", format: 'json' })
		.end(callback);
}

function getCoordinates(callback) {
	navigator.geolocation.getCurrentPosition(function(position) {
		callback(null, position.coords);
	}, function(err) {
		callback(err);
	});
}

var WeatherCardActions = {
	refresh: function(unitChange) {
		unitChange = unitChange || false;

		refresh();

		AppDispatcher.dispatch({
			actionType: AppConstants.WEATHER_REFRESH,
			unitChange: unitChange
		});
	}
};

module.exports = WeatherCardActions;
