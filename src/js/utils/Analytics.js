(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

var analyticsID = 'UA-62023248-3';

// Track under Tupiq Dev when running local
if (chrome.runtime.getManifest().oauth2.client_id === '1022186080812-fpgbc34rns8pdtnkefat2jmac9fatdt2.apps.googleusercontent.com') {
	analyticsID = 'UA-62023248-2'
}

ga('create', analyticsID, 'auto');
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');

var Analytics = {
	trackPageview: function(path) {
		ga('send', 'pageview', path);
	},

	trackEvent: function(category, action, label, value) {
		ga('send', 'event', category, action, label, value);
	}
};

module.exports = Analytics;
