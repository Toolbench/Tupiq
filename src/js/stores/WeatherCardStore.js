var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var Persist = require('../utils/Persist');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var isRefreshing = false;
var error = null;

var WeatherCardStore = assign({}, EventEmitter.prototype, {
	getForecast: function() {
		return Persist.getItem(AppConstants.LOCAL_WEATHER_FORECAST, false);
	},

	// This will be set to either '' if auto, 'c', or 'f'.
	// Setting it at this level so we can check if settings have been
	// changed since and/or a new forecast is required.
	getUnitUsed: function() {
		return Persist.getItem(AppConstants.LOCAL_WEATHER_FORECAST_UNIT, false) || '';
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
				Persist.removeItem(AppConstants.LOCAL_WEATHER_FORECAST);
			}
			WeatherCardStore.emitChange();
			break;

		case AppConstants.WEATHER_REFRESH_SUCCESS:
			isRefreshing = false;
			error = null;
			Persist.setItem(AppConstants.LOCAL_WEATHER_FORECAST_UNIT, action.unitUsed, false);
			Persist.setItem(AppConstants.LOCAL_WEATHER_FORECAST, action.forecast, false);
			WeatherCardStore.emitChange();
			break;

		case AppConstants.WEATHER_REFRESH_ERROR:
			isRefreshing = false;
			error = action.error;
			Persist.removeItem(AppConstants.LOCAL_WEATHER_FORECAST);
			WeatherCardStore.emitChange();
	}
});

module.exports = WeatherCardStore;
