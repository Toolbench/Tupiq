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

AppDispatcher.register(function(action) {
	switch(action.actionType) {
		case AppConstants.WELCOME_PROGRESS:
			stage ++;
			Persist.setItem(AppConstants.LOCAL_WELCOME_STAGE, stage, false);
			WelcomeStore.emitChange();
			break;
	}
});

module.exports = WelcomeStore;
