/* eslint-disable no-debugger */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Terminal from '../terminal';
import { fetchCalendar } from '../../actions';

class Console extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.fetchCalendar();
  }

  render() {
    return (
      <div id="console">
        <Terminal />
        <div id="calendar">
          <div>
            <p>You got Design Review in 5 minutes.</p>
            <p>And three more events today.</p>
            <button onClick={this.onClick}>Fetch</button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

Console.propTypes = {
  fetchCalendar: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { fetchCalendar })(Console);
