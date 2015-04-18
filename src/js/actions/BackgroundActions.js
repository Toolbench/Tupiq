var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var TupiqTools = require('../utils/TupiqTools');
var LZString = require('lz-string');

// Make console debugging easier.
window.LZString = LZString;

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

    var usedBackgrounds;

    if (localStorage.getItem('usedBackgrounds') !== null) {
			usedBackgrounds = JSON.parse(LZString.decompress(localStorage.getItem('usedBackgrounds')));
			usedBackgrounds.push(backgroundItem);
    } else {
    	usedBackgrounds = [backgroundItem];
    }

    localStorage.setItem('usedBackgrounds', LZString.compress(JSON.stringify(usedBackgrounds)));

    AppDispatcher.dispatch({
      actionType: AppConstants.BACKGROUND_SHUFFLE_SUCCESS,
      imageData: data
    });
  });

  image.src = 'https://unsplash.it/2560/1600/?image=' + backgroundItem.id + '&gravity=center';
}

function readJSON() {
	var backgroundJSON = localStorage.getItem('backgroundJSON');

	if (localStorage.getItem('backgroundJSON') === null) {
		requestJSON(function(backgroundJSON) {
			// Compress produces invalid UTF-16 Strings therefore only good for Chrome.
			// Read more: http://pieroxy.net/blog/pages/lz-string/index.html
			localStorage.setItem('backgroundJSON', LZString.compress(JSON.stringify(backgroundJSON)));

			shuffleBackground(backgroundJSON);
		});
	} else {
		shuffleBackground(JSON.parse(LZString.decompress(backgroundJSON)));
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

	if (localStorage.getItem('usedBackgrounds') !== null) {
		// Get all the used backgrounds
		var usedBackgrounds = JSON.parse(LZString.decompress(localStorage.getItem('usedBackgrounds')));

		// Get all unused backgrounds by comparing with latest backgrounds JSON
		var unusedBackgrounds = TupiqTools.getUniqueObjects(usedBackgrounds, backgroundJSON, 'id');

		// No more unused backgrounds left, reset and start again.
		if (unusedBackgrounds.length === 0) {
			localStorage.setItem('usedBackgrounds', LZString.compress(JSON.stringify([])));

			backgrounds = backgroundJSON;
		} else {
			backgrounds = unusedBackgrounds;
		}
	} else {
		localStorage.setItem('usedBackgrounds', LZString.compress(JSON.stringify([])));

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
