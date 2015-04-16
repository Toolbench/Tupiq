/**
 * Libs
 */
var React = require('react');

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
    }
  },

  onMouseMove: function(event) {
    var deltaX = event.pageX - this.state.dragOriginData.scrollOriginX;
    var deltaY = event.pageY - this.state.dragOriginData.scrollOriginY;
    var targetX = this.state.dragOriginData.elementOriginX + deltaX;
    var targetY = this.state.dragOriginData.elementOriginY + deltaY;

    if (this.state.isDragging) {
      targetX = this.respectWidth(targetX);
      targetY = this.respectHeight(targetY);

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
        isDragging={this.state.isDragging}
        coordinates={this.state.coordinates}
        onMouseDown={this.onMouseDown} />
    )
  }
});

module.exports = TupiqContainer;
