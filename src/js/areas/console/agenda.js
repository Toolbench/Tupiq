/* eslint-disable no-debugger, class-methods-use-this */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchCalendar } from '../../actions';
import { getChitChat, getAreCalendarsConnected } from '../../selectors';

class Agenda extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.fetchCalendar();
  }

  renderChitChat() {
    return (
      <div>
        <p>{ this.props.chitChat.main }</p>
        <p>{ this.props.chitChat.smallTalk }</p>
      </div>
    );
  }

  renderConnectPrompt() {
    return (
      <div>
        <button onClick={this.onClick}>Fetch</button>
      </div>
    );
  }

  render() {
    return (
      <div id="calendar">
        { this.props.areCalendarsConnected ?
            this.renderChitChat() :
            this.renderConnectPrompt()
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    chitChat: getChitChat(state),
    areCalendarsConnected: getAreCalendarsConnected(state)
  };
}

Agenda.propTypes = {
  fetchCalendar: PropTypes.func.isRequired,
  areCalendarsConnected: PropTypes.bool.isRequired,
  chitChat: PropTypes.shape({
    main: PropTypes.string.isRequired,
    smallTalk: PropTypes.string.isRequired
  })
};

Agenda.defaultProps = {
  chitChat: null
};

export default connect(mapStateToProps, { fetchCalendar })(Agenda);
