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
      	<div className="drag-hint__boundaries">
      		<div className="drag-hint__boundaries__crosshair"></div>
      	</div>
      </div>
    );
  }
});

module.exports = DragHint;
