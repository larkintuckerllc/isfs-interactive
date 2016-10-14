import React, { Component, PropTypes } from 'react';
import L from 'leaflet';
import * as fromStyles from './index.scss';

class Trade extends Component {
  componentWillMount() {
    const { map } = this.props;
    this.marker = L.marker([29, -82]);
    this.marker.addTo(map);
  }
  componentWillUnmount() {
    const { map } = this.props;
    this.marker.removeFrom(map);
  }
  render() {
    return (
      <div id={fromStyles.root} />
    );
  }
}
Trade.propTypes = {
  map: PropTypes.object,
};
export default Trade;
