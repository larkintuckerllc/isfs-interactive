import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import { BASE_URL_UPLOAD } from '../../../config';
import * as fromTrade from '../../../ducks/trade';
import * as fromVideo from '../../../ducks/video';

class Trade extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    const { fetchTrade } = this.props;
    this.markers = [];
    fetchTrade()
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
    const { map, trade } = this.props;
    const nextTrade = nextProps.trade;
    if (trade.length === 0 && nextTrade.length !== 0) {
      for (let i = 0; i < nextTrade.length; i++) {
        const tr = nextTrade[i];
        const icon = L.icon({
          iconUrl: `${BASE_URL_UPLOAD}trade/markers/${tr.commodity}.png`,
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
    const { map, resetTrade } = this.props;
    for (let i = 0; i < this.markers.length; i++) {
      const marker = this.markers[i];
      marker.removeEventListener('click', this.handleClick);
      marker.removeFrom(map);
    }
    resetTrade();
  }
  handleClick(e) {
    const { setVideo } = this.props;
    setVideo({
      src: `${BASE_URL_UPLOAD}trade/videos/${e.target.id}.mp4`,
      caption: null,
      close: false,
    });
  }
  render() {
    return null;
  }
}
Trade.propTypes = {
  fetchTrade: PropTypes.func.isRequired,
  map: PropTypes.object,
  resetTrade: PropTypes.func.isRequired,
  setVideo: PropTypes.func.isRequired,
  trade: PropTypes.array.isRequired,
};
export default connect(
  state => ({
    trade: fromTrade.getTrade(state),
  }), {
    fetchTrade: fromTrade.fetchTrade,
    resetTrade: fromTrade.resetTrade,
    setVideo: fromVideo.setVideo,
  }
)(Trade);
