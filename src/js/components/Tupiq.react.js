/**
 * Libs
 */
var React = require('react');
var objectAssign = require('object-assign');
var classNames = require('classnames');
var PureMixin = require('react-pure-render/mixin');

/**
 * Child components
 */
var TupiqHeaderContainer = require('./TupiqHeaderContainer');
var TupiqBodyContainer = require('./TupiqBodyContainer');
var TupiqWelcomeContainer = require('./TupiqWelcomeContainer.react');

/**
 * Tupiq
 */
var Tupiq = React.createClass({
	mixins: [PureMixin],

  render: function(){
    var tupiqClassName = classNames({
    	'tupiq': true,
    	'is-dragging': this.props.isDragging,
    	'is-minimised': this.props.isMinimised
    });

    var style = this.props.isMinimised ? {} : {
      left: this.props.coordinates.x,
      top: this.props.coordinates.y,
      transform: this.props.coordinates.transform
    };

    return (
      <div className={tupiqClassName} style={style}>
        <TupiqHeaderContainer onMouseDown={this.props.onMouseDown} />
        <TupiqBodyContainer />
        <TupiqWelcomeContainer />
      </div>
    )
  }
});

module.exports = Tupiq;
