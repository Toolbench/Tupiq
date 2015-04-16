var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var upcomingEvents = JSON.parse(localStorage.getItem('upcomingEvents'));
var isConnected = upcomingEvents !== null;
var isConnecting = false;
var isRefreshing = false;
var refreshedTime = null;

function reset() {
  localStorage.removeItem('upcomingEvents');
  upcomingEvents = refreshedTime = null;
  isConnecting = isConnected = isRefreshing = false;
}

var CalendarStore = assign({}, EventEmitter.prototype, {
  getUpcomingEvents: function() {
    return upcomingEvents;
  },

  getConnected: function() {
    return isConnected;
  },

  getConnecting: function() {
    return isConnecting;
  },

  getRefreshing: function() {
    return isRefreshing;
  },

  getRefreshedTime: function() {
    return refreshedTime;
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
    case AppConstants.CALENDAR_CONNECT:
      isConnecting = true;
      CalendarStore.emitChange();
      break;

    case AppConstants.CALENDAR_CONNECT_SUCCESS:
      isConnecting = false;
      isConnected = true;
      CalendarStore.emitChange();
      break;

    case AppConstants.CALENDAR_CONNECT_ERROR:
      reset();
      CalendarStore.emitChange();
      break;

    case AppConstants.CALENDAR_REFRESH:
      isRefreshing = true;
      refreshedTime = Date.now();
      CalendarStore.emitChange();
      break;

    case AppConstants.CALENDAR_REFRESH_ERROR:
      reset();
      CalendarStore.emitChange();
      break;

    case AppConstants.CALENDAR_REFRESH_SUCCESS:
      localStorage.setItem('upcomingEvents', JSON.stringify(action.upcomingEvents));
      upcomingEvents = action.upcomingEvents;
      isRefreshing = false;
      CalendarStore.emitChange();
      break;

    case AppConstants.CALENDAR_DISCONNECT:
      reset();
      CalendarStore.emitChange();
      break;
  }
});

module.exports = CalendarStore;
