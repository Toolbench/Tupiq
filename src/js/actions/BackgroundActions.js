var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var TupiqTools = require('../utils/TupiqTools');
var Persist = require('../utils/Persist');
var Analytics = require('../utils/Analytics');

var _ = require('underscore');
var moment = require('moment');
var request = require('superagent');

function loadBackground(backgroundItem) {
	var image = new Image(),
		xmlHTTP = new XMLHttpRequest();

	// Image listeners
	image.addEventListener('error', function() {
		dispatchError('BackgroundActions: Image Error');
	});

	image.addEventListener('load', function(event) {
		persistBackground(backgroundItem, event.target, .4);
	});

    // Ajax listeners
    xmlHTTP.onerror = function(event) {
    	dispatchError('BackgroundActions: Ajax Error');
    }

    xmlHTTP.onload = function(event) {
        AppDispatcher.dispatch({
			actionType: AppConstants.BACKGROUND_SHUFFLE_PROGRESS,
			shuffleProgress: 100
		});

        var blob = new Blob([this.response]);
        image.src = window.URL.createObjectURL(blob);
    };

    xmlHTTP.onprogress = function(event) {
        var percentage = parseInt((event.loaded / event.total) * 100);

       	AppDispatcher.dispatch({
			actionType: AppConstants.BACKGROUND_SHUFFLE_PROGRESS,
			shuffleProgress: percentage
		});
    };

    // Initiate request
    //xmlHTTP.open('GET', 'https://unsplash.com/photos/-mNvCsNlsSE/download', true);
    xmlHTTP.open('GET', 'https://unsplash.com/photos/' + backgroundItem.post_url.substring(backgroundItem.post_url.lastIndexOf('/') + 1) + '/download', true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.send();
}

function persistBackground(backgroundItem, image, compress) {
	var data = getBackgroundDataURL(image, compress);

	var backgroundImage = _.clone(backgroundItem);
	backgroundImage.data = data;

	try {
		Persist.setItem(AppConstants.LOCAL_BACKGROUND_IMAGE, backgroundImage, false);
	} catch (err) {
		compress -= 0.1;

		if (compress > 0) {
			persistBackground(backgroundItem, image, compress);
		} else {
			dispatchError('BackgroundActions: Image Persist Error');
		}
	}

	var usedBackgrounds = Persist.getItem(AppConstants.LOCAL_USED_BACKGROUNDS);

	if (usedBackgrounds !== null) {
		usedBackgrounds.push(backgroundItem);
	} else {
		usedBackgrounds = [backgroundItem];
	}

	Persist.setItem(AppConstants.LOCAL_USED_BACKGROUNDS, usedBackgrounds);

	AppDispatcher.dispatch({
		actionType: AppConstants.BACKGROUND_SHUFFLE_SUCCESS,
		backgroundImage: backgroundImage
	});
}

function getBackgroundDataURL(image, compress) {
	var canvas = document.createElement('canvas'),
		backgroundImage;

	canvas.width = image.width;
	canvas.height = image.height;

	var context = canvas.getContext('2d');
	context.drawImage(image, 0, 0, canvas.width, canvas.height);

	var data = canvas.toDataURL('image/webp', compress);

	return data;
}

function readJSON() {
	var backgroundsJSON = Persist.getItem(AppConstants.LOCAL_BACKGROUNDS_JSON);

	// Do we have a backgrounds item in local storage, and is it fresher than 4 days?
	if (backgroundsJSON === null || backgroundsJSON.lastUpdated === null || moment().diff(moment.unix(backgroundsJSON.lastUpdated), 'days') > 4) {
		// If this is the initial request lets just use the local JSON
		var localJSON = backgroundsJSON === null;

		requestJSON(localJSON, function(err, res) {
			if (err) {
				dispatchError('BackgroundActions: Request JSON Error');
			} else {
				// If request was remote use res.body, if local res.text
				var backgrounds = res.body || JSON.parse(res.text);

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

function requestJSON(localJSON, callback) {
	request
		.get(localJSON ? 'json/initial-backgrounds.json' : 'https://unsplash.it/list')
		.end(callback);
}

function dispatchError(desc, fatal) {
    Analytics.trackException(desc, fatal);

	AppDispatcher.dispatch({
		actionType: AppConstants.BACKGROUND_SHUFFLE_FAIL
	});
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
