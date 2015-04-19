var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var TupiqTools = require('../utils/TupiqTools');
var LZString = require('lz-string');
var Persist = require('../utils/Persist');
var _ = require('underscore');
var moment = require('moment');

// Make console debugging easier.
window.LZString = LZString;
window.moment = moment;

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

    canvas.width = image.width / compress;
    canvas.height = image.height / compress;

    document.body.appendChild(canvas);

    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width / compress, image.height / compress);

    var data = canvas.toDataURL('image/jpg');

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

  image.src = 'https://unsplash.it/2560/1600/?image=' + backgroundItem.id + '&gravity=center';
}

function readJSON() {
	var backgroundsJSON = Persist.getItem(AppConstants.LOCAL_BACKGROUNDS_JSON);

	// Do we have a backgrounds item in local storage, and is it fresher than 10 days?
	if (backgroundsJSON === null || backgroundsJSON.lastUpdated === null || moment().diff(moment.unix(backgroundsJSON.lastUpdated), 'days') > 10) {
		requestJSON(function(backgrounds) {
			// Compress produces invalid UTF-16 Strings therefore only good for Chrome.
			// Read more: http://pieroxy.net/blog/pages/lz-string/index.html
			Persist.setItem(AppConstants.LOCAL_BACKGROUNDS_JSON, {
				lastUpdated: moment().unix(),
				backgrounds: backgrounds
			});

			shuffleBackground(backgrounds);
		});
	} else {
		shuffleBackground(backgroundsJSON.backgrounds);
	}
}

function requestJSON(callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://unsplash.it/list', true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
	    callback(JSON.parse(xhr.responseText));
	  }
	}
	xhr.send();
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
