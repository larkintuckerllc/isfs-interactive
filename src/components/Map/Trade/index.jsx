import React, { Component, PropTypes } from 'react';
import L from 'leaflet';
import styles from './index.scss';
import cat from './img/cat.png';

class Trade extends Component {
  componentWillMount() {
    const { map } = this.props;
    const catIcon = L.icon({
      iconUrl: cat,
      iconSize: [64, 64],
    });
    this.marker = L.marker(
      [29, -82],
      {
        icon: catIcon,
      }
    );
    this.marker.addTo(map);
  }
  componentWillUnmount() {
    const { map } = this.props;
    this.marker.removeFrom(map);
  }
  render() {
    return (
      <div id={styles.root}>
        <div id={styles.rootMedia} />
      </div>
    );
  }
}
Trade.propTypes = {
  map: PropTypes.object,
};
export default Trade;
