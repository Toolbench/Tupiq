var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var Persist = require('../utils/Persist');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var stage = Persist.getItem(AppConstants.LOCAL_WELCOME_STAGE, false) || 0;

var WelcomeStore = assign({}, EventEmitter.prototype, {
	getStage: function() {
		return stage;
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

function bumpStage() {
	stage += 1;
	WelcomeStore.emitChange();
}

AppDispatcher.register(function(action) {
	switch(action.actionType) {
		case AppConstants.WELCOME_PROGRESS:
			stage = action.forceStage !== undefined ? action.forceStage : stage + 1;
			Persist.setItem(AppConstants.LOCAL_WELCOME_STAGE, stage, false);
			WelcomeStore.emitChange();
			break;

		case AppConstants.CALENDAR_CONNECT:
			if (stage === 0) {
				bumpStage();
			}
			break;

		case AppConstants.CALENDAR_CONNECT_ERROR:
		case AppConstants.CALENDAR_REFRESH_SUCCESS:
		case AppConstants.CALENDAR_REFRESH_ERROR:
			if (stage === 1) {
				bumpStage();
			}
			break;

		case AppConstants.BACKGROUND_SHUFFLE:
			if (stage === 2) {
				bumpStage();
			}
			break;

		case AppConstants.BACKGROUND_SHUFFLE_SUCCESS:
		case AppConstants.BACKGROUND_SHUFFLE_FAIL:
			if (stage === 3) {
				bumpStage();
			}
			break;
	}
});

module.exports = WelcomeStore;
