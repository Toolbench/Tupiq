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

		// Welcome needs to progress at specific user interaction,
		// this seems to be the easiest.
		AppDispatcher.register(function(action) {
			switch(action.actionType) {
				case AppConstants.CALENDAR_CONNECT_SUCCESS:
				case AppConstants.CALENDAR_CONNECT_ERROR:
					if (this.state.stage === 0) {
						setTimeout(WelcomeActions.progress);
					}
					break;

				case AppConstants.BACKGROUND_SHUFFLE:
					if (this.state.stage === 1) {
						setTimeout(WelcomeActions.progress);
					}
					break;

				case AppConstants.BACKGROUND_SHUFFLE_SUCCESS:
				case AppConstants.BACKGROUND_SHUFFLE_FAIL:
					if (this.state.stage === 2) {
						setTimeout(WelcomeActions.progress);
					}
					break;
			}
		}.bind(this));
	},

	componentWillUnmount: function() {
		WelcomeStore.removeChangeListener(this._onChange);

		document.removeEventListener('mousedown', this.onDismiss);
	},

	_onChange: function() {
		this.setState(getStateFromStores());
	},

	onDismiss: function() {
		if (this.state.stage === WelcomeStages.length - 1) {
			WelcomeActions.progress();
		}
	},

	onButtonClick: function() {
		// If we are on stage 1 (shuffle) and skip, go straight to 3!
		if (this.state.stage === 1) {
			WelcomeActions.progress(3);
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
