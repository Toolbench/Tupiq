/**
 * Libs
 */
var React = require('react');
var classNames = require('classnames');

/**
 * TupiqBody
 */
var TupiqCalendar = React.createClass({
  render: function(){
    var tupiqCalendarClass = classNames({
    	'tupiq__body--calendar': true,
    });

    return (
      <div className={tupiqCalendarClass}>
      	<span className="tupiq__body--calendar__close-btn" onClick={this.props.onCloseButtonClick}></span>
        <p className="primary">{this.props.primaryNote}</p>
        <p className="secondary">{this.props.secondaryNote}</p>
      </div>
    )
  }
});

module.exports = TupiqCalendar;
