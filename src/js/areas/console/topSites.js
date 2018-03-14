/* eslint-disable no-debugger, class-methods-use-this */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchTopSites } from '../../actions';
import { getTopSites } from '../../selectors';
import styles from './topSites.scss';

class TopSites extends Component {
  constructor(props) {
    super(props);

    this.props.fetchTopSites();
  }

  render() {
    return (
      <div id={styles.topSites}>
        {
          this.props.topSites.map(topSite => <a key={topSite.url} href={topSite.url}><img alt={topSite.title} src={`https://www.google.com/s2/favicons?domain=${topSite.url}`} /></a>)
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    topSites: getTopSites(state),
  };
}

TopSites.propTypes = {
  fetchTopSites: PropTypes.func.isRequired,
  topSites: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  })).isRequired
};

export default connect(mapStateToProps, { fetchTopSites })(TopSites);
