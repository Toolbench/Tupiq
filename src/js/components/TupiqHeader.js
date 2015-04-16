/**
 * Libs
 */
var React = require('react');

/**
 * TupiqHeader
 */
var TupiqHeader = React.createClass({
  render: function(){
    return (
      <div className="tupiq__header" onMouseDown={this.props.onMouseDown}>
        <img src="images/tupiq-v3.svg" />
      </div>
    )
  }
});

module.exports = TupiqHeader;
