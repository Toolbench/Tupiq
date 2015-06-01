/**
 * Libs
 */
var React = require('react');
var classNames = require('classnames');
var WelcomeStages = require('../utils/WelcomeStages');

/**
 * TupiqWelcome
 */
var TupiqWelcome = React.createClass({
  render: function(){
    var className = classNames({
    	'welcome': true
    });

    className += ' stage-' + this.props.stage;

    var stage = (this.props.stage < WelcomeStages.length) ? WelcomeStages[this.props.stage] : {};

	return (
		<div className={className}>
			<h1>{stage.primary}</h1>
			<p>{stage.secondary}</p>
			<a href="#" className="skip" onClick={this.props.onButtonClick}>{stage.button}</a>
			<span className="arrow"></span>
		</div>
	)
  }
});

module.exports = TupiqWelcome;
