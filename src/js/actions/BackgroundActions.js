var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var TupiqTools = require('../utils/TupiqTools');
var Persist = require('../utils/Persist');
var Analytics = require('../utils/Analytics');

var _ = require('underscore');
var moment = require('moment');
var request = require('superagent');

// Array.from polyfill
require('babel/polyfill');

function loadBackground(backgroundItem) {
	var image = new Image(),
		xmlHTTP = new XMLHttpRequest(),
		totalSize;

	// Image listeners
	image.addEventListener('error', function() {
		persistUsedBackground(backgroundItem);

		dispatchError('BackgroundActions: Image Error');
	});

	image.addEventListener('load', function(event) {
		console.info('Background size:', totalSize);

		var compress = .6;

		if (totalSize > 10000000) {
			compress = .2;
		} else if (totalSize > 5000000) {
			compress = .4;
		}

		persistBackground(backgroundItem, event.target, compress);
	});

    // Ajax listeners
    xmlHTTP.onerror = function(event) {
    	persistUsedBackground(backgroundItem);

    	dispatchError('BackgroundActions: Ajax Error');
    }

    xmlHTTP.onload = function(event) {
        AppDispatcher.dispatch({
			actionType: AppConstants.BACKGROUND_SHUFFLE_PROGRESS,
			shuffleProgress: 100
		});

        var blob = new Blob([this.response]);
        image.src = window.URL.createObjectURL(blob);

        //console.log(((blob.size * 2)/1024/1024).toFixed(2)+" MB");
    };

    xmlHTTP.onprogress = function(event) {
        if (totalSize === undefined) {
        	totalSize = event.total;
        }

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

	var backgroundItemWithData = _.clone(backgroundItem);
	backgroundItemWithData.data = data;

	console.info('Persisting background at:', compress);

	try {
		Persist.setItem(AppConstants.LOCAL_BACKGROUND_IMAGE, backgroundItemWithData, false);
	} catch (err) {
		compress -= 0.2;

		if (compress > 0) {
			persistBackground(backgroundItem, image, compress);
		} else {
			persistUsedBackground(backgroundItem);

			dispatchError('BackgroundActions: Image Persist Error');
		}
	}

	persistUsedBackground(backgroundItem);

	AppDispatcher.dispatch({
		actionType: AppConstants.BACKGROUND_SHUFFLE_SUCCESS,
		backgroundImage: backgroundItemWithData
	});
}

function persistUsedBackground(backgroundItem) {
	var usedBackgrounds = Persist.getItem(AppConstants.LOCAL_USED_BACKGROUNDS);

	if (usedBackgrounds !== null) {
		usedBackgrounds.push(backgroundItem.id);
	} else {
		usedBackgrounds = [backgroundItem.id];
	}

	Persist.setItem(AppConstants.LOCAL_USED_BACKGROUNDS, usedBackgrounds);
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
	var randomId, backgroundItem, unusedBackgroundIds, backgroundJSONMap;

	// Get all the used backgrounds
	var usedBackgrounds = Persist.getItem(AppConstants.LOCAL_USED_BACKGROUNDS);

	// Map out backgrounds to a simpler array
	backgroundJSONMap = backgroundJSON.map(function(item) {
		return item.id;
	});

	console.info('Total backgrounds:', backgroundJSON.length);

	if (usedBackgrounds !== null) {
		console.info('Used backgrounds:', usedBackgrounds.length);

		// No more unused backgrounds left, reset and start again.
		if (usedBackgrounds.length === backgroundJSON.length) {
			Persist.setItem(AppConstants.LOCAL_USED_BACKGROUNDS, []);
		} else {
			// Filter out used backgrounds
			unusedBackgroundIds = backgroundJSONMap.filter(function(item) {
				return usedBackgrounds.indexOf(item) === -1;
			});
		}
	} else {
		Persist.setItem(AppConstants.LOCAL_USED_BACKGROUNDS, []);
	}

	// If unused didn't get set, just assign to all backgrounds
	if (unusedBackgroundIds === undefined) {
		unusedBackgroundIds = backgroundJSONMap;
	}

	console.info('Unused backgrounds:', unusedBackgroundIds.length);

	randomId = unusedBackgroundIds[TupiqTools.getRandomIntFromInterval(0, unusedBackgroundIds.length - 1)];

	backgroundItem = backgroundJSON.find(function(item) {
		return item.id === randomId;
	});

	if (backgroundItem === undefined) {
		dispatchError('BackgroundActions: Couldn\'t find backgroundItem');
	}

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
