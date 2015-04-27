/**
 * Libs
 */
var React = require('react');
var TupiqTools = require('../utils/TupiqTools');
var Analytics = require('../utils/Analytics');

/**
 * Stores
 */
//var CalendarStore = require('../stores/CalendarStore');

/**
 * Actions
 */
//var CalendarActions = require('../actions/CalendarActions');

/**
 * Pure component
 */
var TupiqBody = require('./TupiqBody');

/**
 * Private
 */
function getStateFromStores() {
  return {};
}

/**
 * TupiqBodyContainer
 */
var TupiqBodyContainer = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    //CalendarStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    //CalendarStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  },

  render: function() {
		return (
			<TupiqBody />
		)
  }
});

module.exports = TupiqBodyContainer;
