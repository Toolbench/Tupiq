/**
 * Libs
 */
var React = require('react');
var objectAssign = require('object-assign');

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
    var className = 'tupiq';

    var style = {
      left: this.props.coordinates.x,
      top: this.props.coordinates.y,
      transform: this.props.coordinates.transform
    };

    if (this.props.isDragging) {
      className += ' isDragging';
    }

    return (
      <div className={className} style={style}>
        <TupiqHeaderContainer onMouseDown={this.props.onMouseDown} />
        <TupiqBodyContainer />
        <TupiqFooterContainer />
      </div>
    )
  }
});

module.exports = Tupiq;
