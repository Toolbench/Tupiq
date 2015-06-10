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

	componentDidMount: function() {
		// Must call this so positioning is set based
		// on dom node measurements.
		this.forceUpdate();
	},

  render: function(){
    var tupiqClassName = classNames({
    	'tupiq': true,
    	'is-dragging': this.props.isDragging,
    	'is-minimised': this.props.isMinimised
    });

    var xPos = 0;
    var yPos = 0;

    if (this.isMounted()) {
    	var elementWidth = this.getDOMNode().offsetWidth,
				elementHeight = this.getDOMNode().offsetHeight,
				padding = 10;

    	xPos = padding + ((window.innerWidth - (elementWidth) - (padding*2)) * this.props.coordinates.x);
    	yPos = padding + ((window.innerHeight - (elementHeight) - (padding*2)) * this.props.coordinates.y);
    }

    var style = this.props.isMinimised ? {} : {
      left: xPos,
      top: yPos
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
