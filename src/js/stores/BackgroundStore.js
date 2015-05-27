var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var Persist = require('../utils/Persist');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var backgroundImage = Persist.getItem(AppConstants.LOCAL_BACKGROUND_IMAGE, false) || {
	post_url: 'https://www.flickr.com/photos/ilovegreenland/13187636953/in/set-72157632226028027',
	data: 'images/bg.jpg'
};

var isLoading = false;

var hasErrored = false;

var BackgroundStore = assign({}, EventEmitter.prototype, {
  getCurrent: function() {
    return backgroundImage;
  },

  getLoading: function() {
    return isLoading;
  },

  getErrored: function() {
  	return hasErrored;
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
      hasErrored = false;
      BackgroundStore.emitChange();
      break;

    case AppConstants.BACKGROUND_SHUFFLE_SUCCESS:
      backgroundImage = action.backgroundImage;
      isLoading = false;
      hasErrored = false;
      BackgroundStore.emitChange();
      break;

    case AppConstants.BACKGROUND_SHUFFLE_FAIL:
      isLoading = false;
      hasErrored = true;
      BackgroundStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = BackgroundStore;
