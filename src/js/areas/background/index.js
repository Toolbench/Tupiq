/* eslint-disable no-debugger */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { shuffleBackground } from '../../actions';

// const currentVersion = chrome.runtime.getManifest().version;

class Background extends Component {
  constructor(props) {
    super(props);
    this.onLoadClick = this.onLoadClick.bind(this);
  }

  onLoadClick() {
    this.props.shuffleBackground();
  }

  render() {
    return (
      <div>
        <button onClick={this.onLoadClick}>Loadit!</button>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

Background.propTypes = {
  shuffleBackground: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { shuffleBackground })(Background);
