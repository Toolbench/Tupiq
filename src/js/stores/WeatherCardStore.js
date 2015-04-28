var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var Persist = require('../utils/Persist');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var forecast = Persist.getItem(AppConstants.LOCAL_WEATHER_FORECAST, false);

var WeatherCardStore = assign({}, EventEmitter.prototype, {
	getForecast: function() {
		return forecast;
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
		case AppConstants.WEATHER_REFRESH_SUCCESS:
			forecast = action.forecast;
			Persist.setItem(AppConstants.LOCAL_WEATHER_FORECAST, forecast, false);
			WeatherCardStore.emitChange();
			break;
	}
});

module.exports = WeatherCardStore;
