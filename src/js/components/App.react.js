/**
 * Libs
 */
var React = require('react');

/**
 * Components
 */
var Background = require('./Background.react'),
    TupiqContainer = require('./TupiqContainer.react');

/**
 * Stores
 */
var BackgroundStore = require('../stores/BackgroundStore');

/**
 * Actions
 */
var BackgroundActions = require('../actions/BackgroundActions');

function getStateFromStores() {
  return {
    backgroundImage: BackgroundStore.getCurrent(),
    isBackgroundLoading: BackgroundStore.getLoading()
  }
}

/**
 * Start me up
 */
var App = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    BackgroundStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    BackgroundStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  },

  render: function() {
    return(
      <div className="app-wrapper">
        <Background image={this.state.backgroundImage} />

        <TupiqContainer />
      </div>
    )
  }
});

module.exports = App;
