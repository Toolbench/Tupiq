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
var TupiqFooterContainer = require('./TupiqFooterContainer');

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
        <TupiqFooterContainer />
      </div>
    )
  }
});

module.exports = Tupiq;
