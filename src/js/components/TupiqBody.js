/**
 * Libs
 */
var React = require('react');
var classNames = require('classnames');

/**
 * TupiqBody
 */
var TupiqBody = React.createClass({
  render: function(){
    var tupiqBodyClass = classNames({
    	'tupiq__body': true,
    	'connected': this.props.isCalendarConnected
    });

    return (
      <div className={tupiqBodyClass}>
        <p className="primary">{this.props.primaryNote}</p>
        <p className="secondary">{this.props.secondaryNote}</p>
      </div>
    )
  }
});

module.exports = TupiqBody;
