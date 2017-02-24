import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import { BASE_URL_UPLOAD } from '../../../config';
import { getCountries } from '../../../api/countries';
import * as fromRotation from '../../../ducks/rotation';
import * as fromGlobalTrade from '../../../ducks/globalTrade';
import * as fromGlobalTradeDetail from '../../../ducks/globalTradeDetail';
import * as fromGlobalTradeOpen from '../../../ducks/globalTradeOpen';
import GlobalTradeModal from './GlobalTradeModal';
import GlobalTradeGlobe from './GlobalTradeGlobe';
import GlobalTradeTitle from './GlobalTradeTitle';
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
      getCountries().then(countries => {
        this.countries = countries;
        return null;
      }),
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
          iconUrl: `${BASE_URL_UPLOAD}global_trade/markers/${tr.direction}_${tr.commodity}.png`,
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
    const direction = values[0];
    const commodityId = values[1];
    const target = values[2];
    let commodityName;
    const trade = globalTradeDetail.filter(o => {
      let check = false;
      if (direction === 'import') {
        check = o.direction === direction && o.commodityId === commodityId && o.dst === target;
      } else {
        check = o.direction === direction && o.commodityId === commodityId && o.src === target;
      }
      if (check) commodityName = o.commodityName;
      return check;
    });
    return (
      <GlobalTradeModal
        resetGlobalTradeOpen={resetGlobalTradeOpen}
      >
        <GlobalTradeTitle
          commodity={commodityName}
          target={this.countries[target].name}
          direction={direction}
        />
        <GlobalTradeGlobe
          rotation={rotation}
          setRotation={setRotation}
          trade={trade}
          countries={this.countries}
        />
        <GlobalTradeLegend
          trade={trade}
          countries={this.countries}
        />
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
