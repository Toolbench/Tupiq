var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

function backgroundShuffle() {
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

    AppDispatcher.dispatch({
      actionType: AppConstants.BACKGROUND_SHUFFLE_SUCCESS,
      imageData: data
    });
  });

  //image.src = 'https://unsplash.it/2560/1200/?gravity=center&random&timestamp=' + Date.now();
  image.src = 'https://unsplash.it/2560/1600/?gravity=center&random&timestamp=' + Date.now();
}

var BackgroundActions = {
  backgroundShuffle: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.BACKGROUND_SHUFFLE
    });

    backgroundShuffle();
  }
};

module.exports = BackgroundActions;
