/**
 * Libs
 */
var React = require('react');
var objectAssign = require('object-assign');
var classNames = require('classnames');

/**
 * Child components
 */
var TupiqHeaderContainer = require('./TupiqHeaderContainer');
var TupiqBodyContainer = require('./TupiqBodyContainer');
// Not using this for now
// var TupiqFooterContainer = require('./TupiqFooterContainer');

/**
 * Tupiq
 */
var Tupiq = React.createClass({
  render: function(){
    var tupiqClassName = classNames({
    	'tupiq': true,
    	'is-dragging': this.props.isDragging
    });

    var style = {
      left: this.props.coordinates.x,
      top: this.props.coordinates.y,
      transform: this.props.coordinates.transform
    };

    return (
      <div className={tupiqClassName} style={style}>
        <TupiqHeaderContainer onMouseDown={this.props.onMouseDown} />
        <TupiqBodyContainer />
      </div>
    )
  }
});

module.exports = Tupiq;
