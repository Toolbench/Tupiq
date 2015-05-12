/**
 * Libs
 */
var React = require('react');
var classNames = require('classnames');

/**
 * Child components
 */
var WeatherCardContainer = require('./cards/WeatherCardContainer.jsx');
var CalendarCardContainer = require('./cards/CalendarCardContainer.jsx');

/**
 * TupiqBody
 */
var TupiqBody = React.createClass({
  render: function(){
    var tupiqBodyClass = classNames({
    	'tupiq__body': true
    });

  	return (
      <div className={tupiqBodyClass}>
      	<CalendarCardContainer />
      	<WeatherCardContainer />
      </div>
    )
  }
});

module.exports = TupiqBody;
