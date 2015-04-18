var React = require('react');

var App = require('./components/App.react');

/**
 * Save app to localstorage?
 * http://www.tabforacause.org/blog/2015/01/29/using-reactjs-and-application-cache-fast-synced-app/
 */

/**
 * Check localstorage space
 * for(var x in localStorage)console.log(x+"="+((localStorage[x].length * 2)/1024/1024).toFixed(2)+" MB");
 */

 React.render(
 	<App />,
 	document.getElementById('app')
 );
