var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var backgroundImage = localStorage.getItem('backgroundImage');
var isLoading = false;

var BackgroundStore = assign({}, EventEmitter.prototype, {
  getCurrent: function() {
    return backgroundImage;
  },

  getLoading: function() {
    return isLoading;
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
    case AppConstants.BACKGROUND_SHUFFLE:
      isLoading = true;
      BackgroundStore.emitChange();
      break;

    case AppConstants.BACKGROUND_SHUFFLE_SUCCESS:
      localStorage.setItem('backgroundImage', action.imageData);
      backgroundImage = action.imageData;
      isLoading = false;
      BackgroundStore.emitChange();
      break;

    case AppConstants.BACKGROUND_SHUFFLE_FAIL:
      isLoading = false;
      BackgroundStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = BackgroundStore;
