/**
 * Libs
 */
var React = require('react');
var classNames = require('classnames');
var moment = require('moment');

var icons = {
	0: 'tornado', // tornado
	1: 'storm-showers', // tropical storm
	2: 'hurricane', // hurricane
	3: 'thunderstorm', //severe thunderstorms
	4: 'thunderstorm', //thunderstorms
	5: 'rain-mix', //mixed rain and snow
	6: 'rain-mix', //mixed rain and sleet
	7: 'snow', //mixed snow and sleet
	8: 'sprinkle', //freezing drizzle
	9: 'sprinkle', //drizzle
	10: 'rain',	//freezing rain
	11: 'showers',	//showers
	12: 'showers',	//showers
	13: 'snow-wind',	//snow flurries
	14: 'snowflake-cold',	//light snow showers
	15: 'snow-wind',	//blowing snow
	16: 'snow',	//snow
	17: 'hail',	//hail
	18: 'hail',	//sleet
	19: 'dust',	//dust
	20: 'fog',	//foggy
	21: 'day-haze',	//haze
	22: 'smoke',	//smoky
	23: 'cloudy-gusts',	//blustery
	24: 'cloudy-windy',	//windy
	25: 'cloudy',	//cold
	26: 'cloudy',	//cloudy
	27: 'night-cloudy',	//mostly cloudy (night)
	28: 'day-cloudy',	//mostly cloudy (day)
	29: 'night-cloudy',	//partly cloudy (night)
	30: 'day-cloudy',	//partly cloudy (day)
	31: 'night-clear',	//clear (night)
	32: 'day-sunny',	//sunny
	33: 'night-clear',	//fair (night)
	34: 'day-sunny',	//fair (day)
	35: 'rain-mix',	//mixed rain and hail
	36: 'hot',	//hot
	37: 'thunderstorm',	//isolated thunderstorms
	38: 'thunderstorm',	//scattered thunderstorms
	39: 'thunderstorm',	//scattered thunderstorms
	40: 'showers',	//scattered showers
	41: 'snow',	//heavy snow
	42: 'snow',	//scattered snow showers
	43: 'snow',	//heavy snow
	44: 'day-cloudy',	//partly cloudy
	45: 'day-storm-showers',	//thundershowers
	46: 'day-snow-thunderstorm',	//snow showers
	47: 'day-storm-showers',	//isolated thundershowers
	3200: 'alien' //not available
};

/**
 * WeatherCard
 */
var WeatherCard = React.createClass({
	render: function(){
		var itemClassName,
			unitClassName,
			message;

		var cardClassName = classNames({
			'card weather': true
		});

		var forecasts = (this.props.forecast !== null) ? this.props.forecast.forecasts.slice(0, 3) : null;

		if (forecasts !== null && forecasts.length > 0) {
			var firstForecast = moment(forecasts[0].item.forecast.date, 'D MMM YYYY');

			if (firstForecast.isSame(moment(), 'day')) {
				forecasts[0].item.forecast.day = 'Today';
			}

			return (
				<div className={cardClassName}>
					<ul>
						{forecasts.map(function(forecast) {
							var units = forecast.units;

							forecast = forecast.item.forecast;

							itemClassName = 'icon wi wi-' + icons[forecast.code];
							unitClassName = (units.temperature.toLowerCase() === 'c') ? 'wi wi-celsius' : 'wi wi-fahrenheit';

							// <span className="summary">{forecast.text}</span>

							return(
								<li key={forecast.date.replace(' ', '')}>
									<span className={itemClassName}></span>

									<span className="wrap">
										<span className="day">
											{forecast.day}
										</span>
										<span className="temp">
											{forecast.low}/{forecast.high}
											<i className={unitClassName}></i>
										</span>
									</span>
								</li>
							);
						})}
					</ul>
				</div>
			)
		} else {
			message = (this.props.isRefreshing === true) ? 'Fetching your local forecast...' : '';

			if (this.props.error !== null) {
				message = "Couldn't retrieve forecast.";
			}

			return (
				<div className={cardClassName}>
					<p className="weather__message">{message}</p>
				</div>
			)
		}
	}
});

module.exports = WeatherCard;
