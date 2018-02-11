/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentBackground } from '../../selectors';

// const currentVersion = chrome.runtime.getManifest().version;

class Background extends Component {
  render() {
    const style = {
      backgroundImage: `url(${this.props.background.dataURL})`
    };

    return <div id="background" style={style} />;
  }
}

function mapStateToProps(state) {
  return {
    background: getCurrentBackground(state)
  };
}

Background.propTypes = {
  background: PropTypes.shape({
    id: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    urls: PropTypes.shape({
      raw: PropTypes.string.isRequired,
      full: PropTypes.string.isRequired,
      regular: PropTypes.string.isRequired,
      small: PropTypes.string.isRequired,
      thumb: PropTypes.string.isRequired
    }).isRequired,
    links: PropTypes.shape({
      self: PropTypes.string.isRequired,
      html: PropTypes.string.isRequired,
      download: PropTypes.string.isRequired,
      downloadLocation: PropTypes.string.isRequired
    }).isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    dataURL: PropTypes.string.isRequired
  }).isRequired
};

export default connect(mapStateToProps)(Background);
