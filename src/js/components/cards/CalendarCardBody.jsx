/**
 * Libs
 */
var React = require('react');
var classNames = require('classnames');

/**
 * CalendarCardBody
 */
var CalendarCardBody = React.createClass({
  render: function(){
    var tupiqBodyClass = classNames({
    	'card tupiq__body--calendar': true
    });
    var addCalendarLabel = (this.props.isCalendarConnecting) ? 'Connecting...' : 'Connect to your Google Calendar';

    var tupiqConnectPromptClass = classNames({
		'tupiq__body--calendar__connect-prompt': true,
		'connecting': this.props.isCalendarConnecting
    });

  	return (
      <div className={tupiqBodyClass}>
        <span className={tupiqConnectPromptClass} onClick={this.props.onAddCalendarClick}>{addCalendarLabel}</span>
      </div>
    )
  }
});

module.exports = CalendarCardBody;
