/**
 * Libs
 */
var React = require('react');

/**
 * Pure component
 */
var TupiqHeader = require('./TupiqHeader');

/**
 * TupiqHeaderContainer
 */
var TupiqHeaderContainer = React.createClass({
  render: function(){
    return (
      <TupiqHeader onMouseDown={this.props.onMouseDown} />
    )
  }
});

module.exports = TupiqHeaderContainer;
