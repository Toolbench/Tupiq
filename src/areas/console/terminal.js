import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { shuffleBackground } from '../../actions';
import Logo from 'react-svg-loader!../../svg/tupiq-logo.svg'; // eslint-disable-line
import styles from './terminal.scss';

class Terminal extends Component {
  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onLogoClick = this.onLogoClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  onKeyDown(event) {
    if (event.keyCode === 13) {
      const inputs = this.state.inputValue.split(' ');

      if (inputs[0] === '/shuffle') {
        this.props.shuffleBackground(inputs.length > 1 ? inputs[1] : undefined);
      }
    }
  }

  onLogoClick() {
    this.props.shuffleBackground();
  }

  updateInputValue(event) {
    this.setState({
      inputValue: event.target.value
    });
  }

  render() {
    return (
      <div className={styles.terminal}>
        <Logo
          className={styles.logo}
          onClick={() => this.onLogoClick()}
        />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

Terminal.propTypes = {
  shuffleBackground: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { shuffleBackground })(Terminal);
