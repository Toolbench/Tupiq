var React = require('react');

var App = require('./components/App.react');

/**
 * Save app to localstorage?
 * http://www.tabforacause.org/blog/2015/01/29/using-reactjs-and-application-cache-fast-synced-app/
 */

 React.render(
 	<App />,
 	document.getElementById('app')
 );
