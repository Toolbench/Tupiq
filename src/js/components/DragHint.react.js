/**
 * Libs
 */
var React = require('react');
var classNames = require('classnames');

/**
 * DragHint
 */
var DragHint = React.createClass({
  render: function(){
    var dragHintClassName = classNames({
    	'drag-hint': true,
    	'is-dragging': this.props.isDragging
    });

    return (
      <div className={dragHintClassName}>
      	<div className="drag-hint__crosshair"></div>
      </div>
    );
  }
});

module.exports = DragHint;
