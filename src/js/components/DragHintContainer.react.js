/**
 * Libs
 */
var React = require('react');

/**
 * Stores
 */
var TupiqStore = require('../stores/TupiqStore');

/**
 * Pure component
 */
var DragHint = require('./DragHint.react');

/**
 * Private
 */
function getStateFromStores() {
  return {
    isDragging: TupiqStore.getDragging()
  }
}

/**
 * DragHintContainer
 */
var DragHintContainer = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    TupiqStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TupiqStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  },

  render: function(){
    return (
      <DragHint isDragging={this.state.isDragging} />
    );
  }
});

module.exports = DragHintContainer;
