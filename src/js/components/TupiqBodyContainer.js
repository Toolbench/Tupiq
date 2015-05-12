/**
 * Libs
 */
var React = require('react');
var TupiqTools = require('../utils/TupiqTools');
var Analytics = require('../utils/Analytics');

/**
 * Pure component
 */
var TupiqBody = require('./TupiqBody');

/**
 * TupiqBodyContainer
 */
var TupiqBodyContainer = React.createClass({
  render: function() {
		return (
			<TupiqBody />
		)
  }
});

module.exports = TupiqBodyContainer;
