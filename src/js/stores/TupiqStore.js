var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var isDragging = false;
var coordinates = JSON.parse(localStorage.getItem('tupiqCoordinates')) || { x: '50%', y: '50%', transform: 'translate(-50%, -50%)' };
var dragOriginData = { scrollOriginX: null, scrollOriginY: null, elementOriginX: null, elementOriginY: null };

var TupiqStore = assign({}, EventEmitter.prototype, {
  getDragging: function() {
    return isDragging;
  },

  getCoordinates: function() {
    return coordinates;
  },

  getDragOriginData: function() {
    return dragOriginData;
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
    case AppConstants.TUPIQ_DRAG_START:
      isDragging = true;
      dragOriginData = action.dragOriginData;
      TupiqStore.emitChange();
      break;

    case AppConstants.TUPIQ_DRAG_STOP:
      isDragging = false;
      TupiqStore.emitChange();
      break;

    case AppConstants.TUPIQ_REPOSITION:
      coordinates = action.coordinates;
      localStorage.setItem('tupiqCoordinates', JSON.stringify(coordinates));
      TupiqStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = TupiqStore;
