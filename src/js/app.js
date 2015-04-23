var React = require('react');

var App = require('./components/App.react');
var Persist = require('./utils/Persist');
var AppConstants = require('./constants/AppConstants');

/**
 * Save app to localstorage?
 * Works well except for background image, as the base64 not
 * rendering to string all that well via React.renderToString
 *
 * http://www.tabforacause.org/blog/2015/01/29/using-reactjs-and-application-cache-fast-synced-app/
 */

/**
 * Check localstorage space
 * for(var x in localStorage)console.log(x+"="+((localStorage[x].length * 2)/1024/1024).toFixed(2)+" MB");
 */

/**
 * Clear localStorage is no version is set.
 */
 if (Persist.getItem(AppConstants.LOCAL_VERSION, false) === null) {
 	Persist.clear();
 	Persist.setItem(AppConstants.LOCAL_VERSION, chrome.runtime.getManifest().version, false);
 }

 React.render(
 	<App />,
 	document.getElementById('app')
 );
