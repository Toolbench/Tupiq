/**
 * Libs
 */
var React = require('react');
var TupiqTools = require('../utils/TupiqTools');
var Analytics = require('../utils/Analytics');

/**
 * Stores
 */
var TupiqStore = require('../stores/TupiqStore');

/**
 * Actions
 */
var TupiqActions = require('../actions/TupiqActions');

/**
 * Pure component
 */
var Tupiq = require('./Tupiq.react');

/**
 * Private
 */
var padding = 10;

function getStateFromStores() {
  return {
    isDragging: TupiqStore.getDragging(),
    isMinimised: TupiqStore.getMinimised(),
    coordinates: TupiqStore.getCoordinates(),
    dragOriginData: TupiqStore.getDragOriginData()
  }
}

/**
 * TupiqContainer
 */
var TupiqContainer = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    TupiqStore.addChangeListener(this._onChange);

    window.addEventListener('resize', this.onWindowResize);

    // This will be fired from the context menu background script.
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  		if ('minimisePanel' in request) {
				TupiqActions.minimise();

				Analytics.trackEvent('button', 'click', 'minimisePanel');
  		}
  	}.bind(this));
  },

  componentWillUnmount: function() {
    TupiqStore.removeChangeListener(this._onChange);

    window.removeEventListener('resize', this.onWindowResize);
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  },

  respectWidth: function(targetX) {
    var width = this.getDOMNode().offsetWidth;

    targetX = Math.max(targetX, padding);
    targetX = Math.min(targetX, window.innerWidth - width - padding);

    return targetX;
  },

  respectHeight: function(targetY) {
    var height = this.getDOMNode().offsetHeight;

    targetY = Math.max(targetY, padding);
    targetY = Math.min(targetY, window.innerHeight - height - padding);

    return targetY;
  },

  onWindowResize: function(event) {
    if (this.state.isMinimised === true) {
    	return;
    }

    var targetX = this.respectWidth(this.state.coordinates.x);
    var targetY = this.respectHeight(this.state.coordinates.y);

    if (targetX !== this.state.coordinates.x || targetY !== this.state.coordinates.y) {
      TupiqActions.reposition({
        x: targetX,
        y: targetY,
        transform: 'none'
      });
    }
  },

  onMouseDown: function(event) {
    if (this.state.isMinimised === true || event.target.className === 'tupiq__header__logo-container' || event.target.className === 'tupiq__header__logo-container__tupiq-logo') {
    	event.preventDefault();

    	return;
    }

    if (event.button === 0) {
      event.stopPropagation();

      this.addEvents();

      var pageOffset = this.getDOMNode().getBoundingClientRect();

      TupiqActions.startDrag({
        scrollOriginX: event.pageX,
        scrollOriginY: event.pageY,
        elementOriginX: pageOffset.left,
        elementOriginY: pageOffset.top
      });

      Analytics.trackEvent('tupiq', 'drag');
    }
  },

  onMouseMove: function(event) {
    var deltaX = event.pageX - this.state.dragOriginData.scrollOriginX,
				deltaY = event.pageY - this.state.dragOriginData.scrollOriginY,
				targetX = this.state.dragOriginData.elementOriginX + deltaX,
				targetY = this.state.dragOriginData.elementOriginY + deltaY,
				elementWidthCenter = this.getDOMNode().offsetWidth / 2,
				elementHeightCenter = this.getDOMNode().offsetHeight / 2,
				windowWidthCenter = window.innerWidth / 2,
				windowHeightCenter = window.innerHeight / 2,
				snapBuffer = 15;

    if (this.state.isDragging) {
      targetX = this.respectWidth(targetX);
      targetY = this.respectHeight(targetY);

      if (TupiqTools.isNumberBetween(targetX + elementWidthCenter, windowWidthCenter - snapBuffer, windowWidthCenter + snapBuffer) && TupiqTools.isNumberBetween(targetY + elementHeightCenter, windowHeightCenter - snapBuffer, windowHeightCenter + snapBuffer)) {
      	targetX = windowWidthCenter - elementWidthCenter;
      	targetY = windowHeightCenter - elementHeightCenter;
      }

      TupiqActions.reposition({
        x: targetX,
        y: targetY,
        transform: 'none'
      });
    }
  },

  onMouseUp: function(event) {
    this.removeEvents();

    TupiqActions.stopDrag();
  },

  addEvents: function() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  },

  removeEvents: function() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  },

  render: function(){
    return (
      <Tupiq
      	isMinimised={this.state.isMinimised}
        isDragging={this.state.isDragging}
        coordinates={this.state.coordinates}
        onMouseDown={this.onMouseDown} />
    )
  }
});

module.exports = TupiqContainer;
