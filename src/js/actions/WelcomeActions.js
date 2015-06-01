var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var WelcomeActions = {
  progress: function(forceStage) {
  	AppDispatcher.dispatch({
      actionType: AppConstants.WELCOME_PROGRESS,
      forceStage: forceStage
    });
  }
};

module.exports = WelcomeActions;
