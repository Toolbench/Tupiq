var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var Persist = require('../utils/Persist');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var forecast = Persist.getItem(AppConstants.LOCAL_WEATHER_FORECAST, false);
var isRefreshing = false;
var error = null;

var WeatherCardStore = assign({}, EventEmitter.prototype, {
	getForecast: function() {
		return forecast;
	},

	getRefreshing: function() {
		return isRefreshing;
	},

	getError: function() {
		return error;
	},

	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}
});

AppDispatcher.register(function(action) {
	switch(action.actionType) {
		case AppConstants.WEATHER_REFRESH:
			isRefreshing = true;
			error = null;
			if (action.unitChange) {
				Persist.removeItem(AppConstants.LOCAL_WEATHER_FORECAST, forecast, false);
				forecast = null;
			}
			WeatherCardStore.emitChange();
			break;

		case AppConstants.WEATHER_REFRESH_SUCCESS:
			forecast = action.forecast;
			isRefreshing = false;
			error = null;
			Persist.setItem(AppConstants.LOCAL_WEATHER_FORECAST, forecast, false);
			WeatherCardStore.emitChange();
			break;

		case AppConstants.WEATHER_REFRESH_ERROR:
			forecast = null;
			isRefreshing = false;
			error = action.error;
			Persist.removeItem(AppConstants.LOCAL_WEATHER_FORECAST, forecast, false);
			WeatherCardStore.emitChange();
	}
});

module.exports = WeatherCardStore;
