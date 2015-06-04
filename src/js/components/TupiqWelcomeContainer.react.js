/**
 * Libs
 */
var React = require('react');
var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var WelcomeStages = require('../utils/WelcomeStages');

/**
 * Stores
 */
var WelcomeStore = require('../stores/WelcomeStore');
var CalendarStore = require('../stores/CalendarStore');

/**
 * Actions
 */
var WelcomeActions = require('../actions/WelcomeActions');

/**
 * Pure component
 */
var TupiqWelcome = require('./TupiqWelcome.react');

/**
 * Private
 */
function getStateFromStores() {
  return {
    stage: WelcomeStore.getStage()
  }
}

/**
 * TupiqBodyContainer
 */
var TupiqWelcomeContainer = React.createClass({
	getInitialState: function() {
		return getStateFromStores();
	},

	componentDidMount: function() {
		WelcomeStore.addChangeListener(this._onChange);

		document.addEventListener('mousedown', this.onDismiss);
	},

	componentWillUnmount: function() {
		WelcomeStore.removeChangeListener(this._onChange);

		document.removeEventListener('mousedown', this.onDismiss);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	},

	onDismiss: function() {
		// We're at the end of the steps, progress once more to
		// the display:none stage.
		if (this.state.stage === WelcomeStages.length - 1) {
			WelcomeActions.progress();
		}
	},

	onButtonClick: function() {
		if (this.state.stage === 0) {
			WelcomeActions.progress(2);
		} else if (this.state.stage === 2) {
			WelcomeActions.progress(4);
		} else {
			WelcomeActions.progress();
		}
	},

	render: function() {
		return (
			<TupiqWelcome
				stage={this.state.stage}
				onButtonClick={this.onButtonClick} />
		)
	}
});

module.exports = TupiqWelcomeContainer;
