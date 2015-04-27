/**
 * Libs
 */
var React = require('react');
var classNames = require('classnames');

/**
 * WeatherCard
 */
var WeatherCard = React.createClass({
	render: function(){
		var cardClassName = classNames({
			'card weather': true
		});

		return (
			<div className={cardClassName}>
				<ul>
					<li>
						<span className="day">Saturday</span>
						<span className="wi wi-day-lightning"></span>
					</li>
					<li>
						<span className="day">Sunday</span>
						<span className="wi wi-day-sleet"></span>
					</li>
					<li>
						<span className="day">Monday</span>
						<span className="wi wi-day-lightning"></span>
					</li>
				</ul>
			</div>
		)
	}
});

module.exports = WeatherCard;
