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

    // Handcrafted DOM resize handler
    // http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
    var object = document.createElement('object');
    object.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
    object.onload = function() {
    	object.contentDocument.defaultView.addEventListener('resize', this.onDomNodeResize.bind(this));
    }.bind(this);
    object.type = 'text/html';
    object.data = 'about:blank';

    var domNode = this.getDOMNode();
    domNode.appendChild(object);

    // This will be fired from the context menu background script.
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  		if ('minimisePanel' in request) {
				TupiqActions.minimise();

				Analytics.trackEvent('Button', 'Click', 'Minimise Panel');
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
    var width = this.getDOMNode().offsetWidth,
    		elementWidthCenter = width / 2;

    targetX = Math.max(targetX - elementWidthCenter, padding);
    targetX = Math.min(targetX + elementWidthCenter, window.innerWidth - elementWidthCenter - padding);

    return targetX;
  },

  respectHeight: function(targetY) {
    var height = this.getDOMNode().offsetHeight,
        elementHeightCenter = height / 2,

    targetY = Math.max(targetY - elementHeightCenter, padding);
    targetY = Math.min(targetY + elementHeightCenter, window.innerHeight - elementHeightCenter - padding);

    return targetY;
  },

  onDomNodeResize: function(event) {
  	this.onWindowResize();
  },

  onWindowResize: function(event) {
  	// If we're minimised, or it's the initial x position of 50%
    if (this.state.isMinimised === true || this.state.coordinates.x === '50%') {
    	return;
    }

    var targetX = this.respectWidth(this.state.coordinates.x);
    var targetY = this.respectHeight(this.state.coordinates.y);

    if (targetX !== this.state.coordinates.x || targetY !== this.state.coordinates.y) {
      TupiqActions.reposition({
        x: targetX,
        y: targetY,
        transform: 'translate(-50%, -50%)'
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

      Analytics.trackEvent('Tupiq', 'Drag');
    }
  },

  onMouseMove: function(event) {
    var elementWidthCenter = this.getDOMNode().offsetWidth / 2,
				elementHeightCenter = this.getDOMNode().offsetHeight / 2,
				windowWidthCenter = window.innerWidth / 2,
				windowHeightCenter = window.innerHeight / 2,
				deltaX = event.pageX - this.state.dragOriginData.scrollOriginX,
				deltaY = event.pageY - this.state.dragOriginData.scrollOriginY,
				targetX = this.state.dragOriginData.elementOriginX + deltaX + elementWidthCenter,
				targetY = this.state.dragOriginData.elementOriginY + deltaY + elementHeightCenter,
				snapBuffer = 15;

    if (this.state.isDragging) {
      targetX = this.respectWidth(targetX);
      targetY = this.respectHeight(targetY);

      if (TupiqTools.isNumberBetween(targetX, windowWidthCenter - snapBuffer, windowWidthCenter + snapBuffer) && TupiqTools.isNumberBetween(targetY, windowHeightCenter - snapBuffer, windowHeightCenter + snapBuffer)) {
      	targetX = windowWidthCenter;
      	targetY = windowHeightCenter;
      }

      TupiqActions.reposition({
        x: targetX,
        y: targetY,
        transform: 'translate(-50%, -50%)'
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
