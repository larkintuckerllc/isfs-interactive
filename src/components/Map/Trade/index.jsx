import { Component, PropTypes } from 'react';
import L from 'leaflet';
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
    return null;
  }
}
Trade.propTypes = {
  map: PropTypes.object,
};
export default Trade;
