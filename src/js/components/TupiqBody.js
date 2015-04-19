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
    	'tupiq__body': true
    });
    var addCalendarLabel = (this.props.isCalendarConnecting) ? 'Connecting...' : 'Add calendar';

    var tupiqConnectPromptClass = classNames({
		'tupiq__body__connect-prompt': true,
		'connecting': this.props.isCalendarConnecting
    });

  	return (
      <div className={tupiqBodyClass}>
        <span className={tupiqConnectPromptClass} onClick={this.props.onAddCalendarClick}>{addCalendarLabel}</span>
      </div>
    )
  }
});

module.exports = TupiqBody;
