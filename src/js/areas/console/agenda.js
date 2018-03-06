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

    this.props.fetchCalendar({ interactive: false });
  }

  onClick() {
    this.props.fetchCalendar({ interactive: true });
  }

  renderChitChat() {
    return (
      <div>
        <p className="big-talk">{ this.props.chitChat.bigTalk }</p>
        <p className="small-talk">{ this.props.chitChat.smallTalk }</p>
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
    bigTalk: PropTypes.string.isRequired,
    smallTalk: PropTypes.string.isRequired
  })
};

Agenda.defaultProps = {
  chitChat: null
};

export default connect(mapStateToProps, { fetchCalendar })(Agenda);
