/**
 * Libs
 */
var React = require('react');
var classNames = require('classnames');

/**
 * TupiqWelcome
 */
var TupiqWelcome = React.createClass({
  render: function(){
    var className = classNames({
    	'welcome': true
    });

    className += ' stage-' + this.props.stage;

    var primary, secondary, button;

    switch(this.props.stage) {
    	case 0:
    		primary = 'Hello there and welcome!';
    		secondary = 'First off, lets see how your day is lining up...';
    		button = 'Skip and do this later';
    		break;

    	case 1:
    		primary = 'Sweet!';
    		secondary = 'Now click the Tupiq to shuffle your background';
    		button = 'Skip to keep this background for now';
    		break;

    	case 2:
    	  primary = "That's it!";
    		secondary = "Have a go at dragging the panel around and right click for some extra handy actions!";
    		button = '';
    		break;
    }

		return (
			<div className={className}>
				<h1>{primary}</h1>
				<p>{secondary}</p>
				<a href="#" className="skip" onClick={this.props.onButtonClick}>{button}</a>
				<span className="arrow"></span>
			</div>
		)
  }
});

module.exports = TupiqWelcome;
