import { Component, PropTypes } from 'react';
import L from 'leaflet';

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
    return null;
  }
}
Trade.propTypes = {
  map: PropTypes.object,
};
export default Trade;
