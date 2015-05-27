var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var TupiqTools = require('../utils/TupiqTools');
var Persist = require('../utils/Persist');

var _ = require('underscore');
var moment = require('moment');
var request = require('superagent');

function loadBackground(backgroundItem) {
	var image = new Image();

	image.addEventListener('error', function() {
		AppDispatcher.dispatch({
			actionType: AppConstants.BACKGROUND_SHUFFLE_FAIL
		});
	});

	image.addEventListener('load', function() {
		var canvas = document.createElement('canvas'),
			image = event.target,
			compress = 2;

		canvas.width = image.width;
		canvas.height = image.height;

		document.body.appendChild(canvas);

		var context = canvas.getContext('2d');
		context.drawImage(image, 0, 0, image.width, image.height);

		var data = canvas.toDataURL('image/webp');

		canvas.parentNode.removeChild(canvas);

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
	});

	image.src = 'https://unsplash.com/photos/' + backgroundItem.post_url.substring(backgroundItem.post_url.lastIndexOf('/') + 1) + '/download';
}

function readJSON() {
	var backgroundsJSON = Persist.getItem(AppConstants.LOCAL_BACKGROUNDS_JSON);

	// Do we have a backgrounds item in local storage, and is it fresher than 10 days?
	if (backgroundsJSON === null || backgroundsJSON.lastUpdated === null || moment().diff(moment.unix(backgroundsJSON.lastUpdated), 'days') > 10) {
		// If this is the initial request lets just use the local JSON
		var localJSON = backgroundsJSON === null;

		requestJSON(localJSON, function(err, res) {
			if (err) {
				AppDispatcher.dispatch({
					actionType: AppConstants.BACKGROUND_SHUFFLE_FAIL
				});
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
