var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var WelcomeActions = {
  progress: function() {
  	AppDispatcher.dispatch({
      actionType: AppConstants.WELCOME_PROGRESS
    });
  }
};

module.exports = WelcomeActions;
