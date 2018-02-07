/* eslint-disable no-debugger */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { shuffleBackground } from '../../actions';
import { getCurrentBackground } from '../../selectors';

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
    const style = {
      backgroundImage: `url(${this.props.background.dataURL})`
    };

    return (
      <div style={style} className="background">
        <div>
          <button onClick={this.onLoadClick}>Shuffle</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    background: getCurrentBackground(state)
  };
}

Background.propTypes = {
  shuffleBackground: PropTypes.func.isRequired,
  background: PropTypes.shape({
    author: PropTypes.string.isRequired,
    authorUrl: PropTypes.string.isRequired,
    dataURL: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    postUrl: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired
  }).isRequired
};

export default connect(mapStateToProps, { shuffleBackground })(Background);
