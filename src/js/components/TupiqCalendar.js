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
        <p className="primary">{this.props.primaryNote}</p>
        <p className="secondary">{this.props.secondaryNote}</p>
      </div>
    )
  }
});

module.exports = TupiqCalendar;
