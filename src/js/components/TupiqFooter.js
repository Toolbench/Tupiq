/**
 * Libs
 */
var React = require('react');
var classNames = require('classnames');

/**
 * TupiqFooter
 */
var TupiqFooter = React.createClass({
  render: function(){
    var shuffleButtonLabel = (this.props.isBackgroundLoading) ? 'Shuffling background...' : 'Shuffle background';
    var shuffleButtonClass = classNames({
    	'tupiq__footer__shuffle-background': true,
    	'loading': this.props.isBackgroundLoading
    });

    var calendarButtonLabel;

    if (this.props.isCalendarConnected) {
      calendarButtonLabel = 'Disconnect calendar';
    } else {
      calendarButtonLabel = (this.props.isCalendarConnecting) ? 'Connecting calendar...' : 'Connect calendar';
    }

    var calendarButtonClass = classNames({
      'tupiq__footer__disconnect-calendar': true
    });

    return (
      <div className="tupiq__footer">
        <span className={calendarButtonClass} onClick={this.props.onToggleCalendarClick}>{calendarButtonLabel}</span>
        <span className={shuffleButtonClass} onClick={this.props.onShuffleBackgroundClick}>{shuffleButtonLabel}</span>
      </div>
    )
  }
});

module.exports = TupiqFooter;
