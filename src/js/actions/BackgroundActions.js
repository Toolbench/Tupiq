var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var TupiqTools = require('../utils/TupiqTools');
var Persist = require('../utils/Persist');

var _ = require('underscore');
var moment = require('moment');
var request = require('superagent');

function loadBackground(backgroundItem) {
	// http://stackoverflow.com/questions/20035615/using-raw-image-data-from-ajax-request-for-data-uri
	var xmlHTTP = new XMLHttpRequest();
	xmlHTTP.open('GET', 'https://unsplash.it/2560/1600/?image=' + backgroundItem.id + '&gravity=center', true);
	xmlHTTP.responseType = 'arraybuffer';

	xmlHTTP.onload = function(event) {
		var arr = new Uint8Array(this.response);

		var raw = '';
		var i,j,subArray,chunk = 5000;

		for (i=0,j=arr.length; i<j; i+=chunk) {
			subArray = arr.subarray(i,i+chunk);
			raw += String.fromCharCode.apply(null, subArray);
		}

		var b64 = btoa(raw);
		var data = "data:image/png;base64," + b64;

		var usedBackgrounds = Persist.getItem(AppConstants.LOCAL_USED_BACKGROUNDS);

	    if (usedBackgrounds !== null) {
			usedBackgrounds.push(backgroundItem);
	    } else {
	    	usedBackgrounds = [backgroundItem];
	    }

	    Persist.setItem(AppConstants.LOCAL_USED_BACKGROUNDS, usedBackgrounds);

	    AppDispatcher.dispatch({
	      actionType: AppConstants.BACKGROUND_SHUFFLE_SUCCESS,
	      backgroundImage: _.extend(backgroundItem, {data: data})
	    });
	}

	xmlHTTP.ontimeout = xmlHTTP.onerror = function(event) {
		AppDispatcher.dispatch({
			actionType: AppConstants.BACKGROUND_SHUFFLE_FAIL
		});
	}

	xmlHTTP.send();
}

function readJSON() {
	var backgroundsJSON = Persist.getItem(AppConstants.LOCAL_BACKGROUNDS_JSON);

	// Do we have a backgrounds item in local storage, and is it fresher than 10 days?
	if (backgroundsJSON === null || backgroundsJSON.lastUpdated === null || moment().diff(moment.unix(backgroundsJSON.lastUpdated), 'days') > 10) {
		requestJSON(function(err, res) {
			if (err) {
				AppDispatcher.dispatch({
					actionType: AppConstants.BACKGROUND_SHUFFLE_FAIL
				});
			} else {
				var backgrounds = res.body;

				// Compress produces invalid UTF-16 Strings therefore only good for Chrome.
				// Read more: http://pieroxy.net/blog/pages/lz-string/index.html
				Persist.setItem(AppConstants.LOCAL_BACKGROUNDS_JSON, {
					lastUpdated: moment().unix(),
					backgrounds: backgrounds
				});

				shuffleBackground(backgrounds);
			}
		});
	} else {
		shuffleBackground(backgroundsJSON.backgrounds);
	}
}

function requestJSON(callback) {
	request
		.get('https://unsplash.it/list')
		.end(callback);
}

function shuffleBackground(backgroundJSON) {
	var random, backgrounds, backgroundItem;

	// Get all the used backgrounds
	var usedBackgrounds = Persist.getItem(AppConstants.LOCAL_USED_BACKGROUNDS);

	if (usedBackgrounds !== null) {
		// Get all unused backgrounds by comparing with latest backgrounds JSON
		var unusedBackgrounds = TupiqTools.getUniqueObjects(usedBackgrounds, backgroundJSON, 'id');

		// No more unused backgrounds left, reset and start again.
		if (unusedBackgrounds.length === 0) {
			Persist.setItem(AppConstants.LOCAL_USED_BACKGROUNDS, []);

			backgrounds = backgroundJSON;
		} else {
			backgrounds = unusedBackgrounds;
		}
	} else {
		Persist.setItem(AppConstants.LOCAL_USED_BACKGROUNDS, []);

		backgrounds = backgroundJSON;
	}

	random = TupiqTools.getRandomIntFromInterval(0, backgrounds.length - 1);
	backgroundItem = backgrounds[random];

	loadBackground(backgroundItem);
}

var BackgroundActions = {
  backgroundShuffle: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.BACKGROUND_SHUFFLE
    });

    readJSON();
  }
};

module.exports = BackgroundActions;
