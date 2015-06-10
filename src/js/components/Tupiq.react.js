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
    var xPos = 0,
    		yPos = 0,
    		padding = 10,
    		isMounted = this.isMounted();

    if (isMounted) {
			var element = this.getDOMNode(),
					elementWidth = element.offsetWidth,
					elementHeight = element.offsetHeight;

			// Calculate left and top based on percentage props
    	xPos = padding + ((window.innerWidth - elementWidth - (padding * 2)) * this.props.coordinates.x);
    	yPos = padding + ((window.innerHeight - elementHeight - (padding * 2)) * this.props.coordinates.y);
    }

    var style = this.props.isMinimised ? {} : {
      left: xPos,
      top: yPos
    };

    var tupiqClassName = classNames({
    	'tupiq': true,
    	'is-dragging': this.props.isDragging,
    	'is-minimised': this.props.isMinimised,
    	'hidden': !isMounted
    });

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
