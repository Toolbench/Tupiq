/**
 * Libs
 */
var React = require('react');
var classNames = require('classnames');
var moment = require('moment');

/**
 * CalendarCard
 */
var CalendarCard = React.createClass({
  render: function(){
    var tupiqCalendarClass = classNames({
    	'card tupiq__body--calendar': true,
    });

    // Trial event list
    /*
    return (
      <div className={tupiqCalendarClass}>
      	<span className="tupiq__body--calendar__close-btn" onClick={this.props.onCloseButtonClick}></span>
				<ul className="tupiq__body--calendar__event-list">
	        {this.props.upcomingEvents.map(function(event) {
	          var momentStart = moment(event.start.dateTime || event.start.date);
	          var fromNow = momentStart.fromNow();

	          return <li key={event.id}><span className="summary">{event.summary}</span><span className="from-now">{fromNow}</span></li>;
	        })}
      	</ul>
      </div>
    )
		*/

    return (
      <div className={tupiqCalendarClass}>
      	<span className="tupiq__body--calendar__close-btn" onClick={this.props.onCloseButtonClick}></span>
        <p className="primary">{this.props.primaryNote}</p>
        <p className="secondary">{this.props.secondaryNote}</p>
      </div>
    )
  }
});

module.exports = CalendarCard;
