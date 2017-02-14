import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import { BASE_URL_UPLOAD } from '../../../config';
import * as fromGlobalTrade from '../../../ducks/globalTrade';
import * as fromGlobalTradeDetail from '../../../ducks/globalTradeDetail';

class GlobalTrade extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    const { fetchGlobalTrade, fetchGlobalTradeDetail } = this.props;
    this.markers = [];
    Promise.all([
      fetchGlobalTrade(),
      fetchGlobalTradeDetail(),
    ])
     .then(
       () => {
       },
       (error) => {
         if (process.env.NODE_ENV !== 'production'
           && error.name !== 'ServerException') {
           window.console.log(error);
           return;
         }
       }
     );
  }
  componentWillUpdate(nextProps) {
    const { map, globalTrade } = this.props;
    const nextGlobalTrade = nextProps.globalTrade;
    if (globalTrade.length === 0 && nextGlobalTrade.length !== 0) {
      for (let i = 0; i < nextGlobalTrade.length; i++) {
        const tr = nextGlobalTrade[i];
        const icon = L.icon({
          iconUrl: `${BASE_URL_UPLOAD}global_trade/markers/${tr.commodity}.png`,
          iconSize: [64, 64],
        });
        const marker = L.marker(tr.latlng, { icon });
        marker.id = tr.id;
        marker.addEventListener('click', this.handleClick);
        marker.addTo(map);
        this.markers.push(marker);
      }
    }
  }
  componentWillUnmount() {
    const { map, resetGlobalTrade } = this.props;
    for (let i = 0; i < this.markers.length; i++) {
      const marker = this.markers[i];
      marker.removeEventListener('click', this.handleClick);
      marker.removeFrom(map);
    }
    resetGlobalTrade();
  }
  handleClick(e) {
    window.console.log(e);
  }
  render() {
    return null;
  }
}
GlobalTrade.propTypes = {
  fetchGlobalTrade: PropTypes.func.isRequired,
  fetchGlobalTradeDetail: PropTypes.func.isRequired,
  map: PropTypes.object,
  resetGlobalTrade: PropTypes.func.isRequired,
  resetGlobalTradeDetail: PropTypes.func.isRequired,
  globalTrade: PropTypes.array.isRequired,
};
export default connect(
  state => ({
    globalTrade: fromGlobalTrade.getGlobalTrade(state),
  }), {
    fetchGlobalTrade: fromGlobalTrade.fetchGlobalTrade,
    fetchGlobalTradeDetail: fromGlobalTradeDetail.fetchGlobalTradeDetail,
    resetGlobalTrade: fromGlobalTrade.resetGlobalTrade,
    resetGlobalTradeDetail: fromGlobalTradeDetail.resetGlobalTradeDetail,
  }
)(GlobalTrade);
