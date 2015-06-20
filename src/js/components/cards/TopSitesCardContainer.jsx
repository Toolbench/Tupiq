/**
 * Libs
 */
var React = require('react');
var Analytics = require('../../utils/Analytics');

/**
 * Pure component
 */
var TopSitesCard = require('./TopSitesCard.jsx');

/**
 * TopSitesCardContainer
 */
var TopSitesCardContainer = React.createClass({
	getInitialState: function() {
		return {
			topSites: []
		}
	},

	componentDidMount: function() {
		chrome.topSites.get(function(topSites) {
			topSites = topSites.map(function(page, index) {
				var url = new URL(page.url);

				page.id = index;
				page.favicon = url.origin + '/favicon.ico';

				return page;
			});

			this.setState({
				topSites: topSites
			});
		}.bind(this));
	},

	onClick: function(event) {
		Analytics.trackEvent('Link', 'Click', 'Top Sites');

		setTimeout(function() {
			document.location = event.currentTarget.href;
		});
	},

	render: function() {
		return (
			<TopSitesCard
				onClick={this.onClick}
				topSites={this.state.topSites} />
		)
	}
});

module.exports = TopSitesCardContainer;
