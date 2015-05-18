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

		// Prevent orphan words
    this.props.primaryNote = this.props.primaryNote.replace(/ ([^ ]*)$/,'&nbsp;$1');
    this.props.secondaryNote = this.props.secondaryNote.replace(/ ([^ ]*)$/,'&nbsp;$1');

    // Review a way to remove the need of innerHtml here. Needed for
    // the span wrapping around the event name (which gets encoded in
    // utils/TupiqTools), and the line break above.
    return (
      <div className={tupiqCalendarClass}>
      	<span className="tupiq__body--calendar__close-btn" onClick={this.props.onCloseButtonClick}></span>
        <p className="primary" onClick={this.props.onEventClick} dangerouslySetInnerHTML={{__html: this.props.primaryNote}}></p>
        <p className="secondary" onClick={this.props.onEventClick} dangerouslySetInnerHTML={{__html: this.props.secondaryNote}}></p>
      </div>
    )
  }
});

module.exports = CalendarCard;
