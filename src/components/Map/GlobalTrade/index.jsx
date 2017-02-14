import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import { BASE_URL_UPLOAD } from '../../../config';
import * as fromRotation from '../../../ducks/rotation';
import * as fromGlobalTrade from '../../../ducks/globalTrade';
import * as fromGlobalTradeDetail from '../../../ducks/globalTradeDetail';
import * as fromGlobalTradeOpen from '../../../ducks/globalTradeOpen';
import GlobalTradeModal from './GlobalTradeModal';
import GlobalTradeGlobe from './GlobalTradeGlobe';
import GlobalTradeLegend from './GlobalTradeLegend';

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
    const { map, resetGlobalTrade, resetGlobalTradeDetail, resetGlobalTradeOpen } = this.props;
    for (let i = 0; i < this.markers.length; i++) {
      const marker = this.markers[i];
      marker.removeEventListener('click', this.handleClick);
      marker.removeFrom(map);
    }
    resetGlobalTrade();
    resetGlobalTradeDetail();
    resetGlobalTradeOpen();
  }
  handleClick(e) {
    const { setGlobalTradeOpen, setRotation } = this.props;
    setRotation([e.latlng.lng * -1, 0, 0]);
    setGlobalTradeOpen(e.target.id);
  }
  render() {
    const {
      globalTradeDetail,
      globalTradeOpen,
      resetGlobalTradeOpen,
      rotation,
      setRotation,
    } = this.props;
    if (globalTradeOpen === null) {
      return null;
    }
    const values = globalTradeOpen.split('_');
    const commodity = values[0];
    const dst = values[1];
    const trade = globalTradeDetail.filter(o => (
      o.commodity === commodity && o.dst === dst
    ));
    return (
      <GlobalTradeModal
        resetGlobalTradeOpen={resetGlobalTradeOpen}
      >
        <GlobalTradeGlobe
          rotation={rotation}
          setRotation={setRotation}
          trade={trade}
        />
        <GlobalTradeLegend />
      </GlobalTradeModal>
    );
  }
}
GlobalTrade.propTypes = {
  fetchGlobalTrade: PropTypes.func.isRequired,
  fetchGlobalTradeDetail: PropTypes.func.isRequired,
  globalTrade: PropTypes.array.isRequired,
  globalTradeDetail: PropTypes.array.isRequired,
  globalTradeOpen: PropTypes.string,
  map: PropTypes.object,
  resetGlobalTrade: PropTypes.func.isRequired,
  resetGlobalTradeDetail: PropTypes.func.isRequired,
  resetGlobalTradeOpen: PropTypes.func.isRequired,
  rotation: PropTypes.array.isRequired,
  setGlobalTradeOpen: PropTypes.func.isRequired,
  setRotation: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    globalTrade: fromGlobalTrade.getGlobalTrade(state),
    globalTradeDetail: fromGlobalTradeDetail.getGlobalTradeDetail(state),
    globalTradeOpen: fromGlobalTradeOpen.getGlobalTradeOpen(state),
    rotation: fromRotation.getRotation(state),
  }), {
    fetchGlobalTrade: fromGlobalTrade.fetchGlobalTrade,
    fetchGlobalTradeDetail: fromGlobalTradeDetail.fetchGlobalTradeDetail,
    resetGlobalTrade: fromGlobalTrade.resetGlobalTrade,
    resetGlobalTradeDetail: fromGlobalTradeDetail.resetGlobalTradeDetail,
    resetGlobalTradeOpen: fromGlobalTradeOpen.resetGlobalTradeOpen,
    setGlobalTradeOpen: fromGlobalTradeOpen.setGlobalTradeOpen,
    setRotation: fromRotation.setRotation,
  }
)(GlobalTrade);