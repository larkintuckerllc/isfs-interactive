import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import * as fromVideo from '../../../ducks/video';
import cat from './img/cat.png';

class Trade extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
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
    this.marker.addEventListener('click', this.handleClick);
  }
  componentWillUnmount() {
    const { map } = this.props;
    this.marker.removeEventListener('click', this.handleClick);
    this.marker.removeFrom(map);
  }
  handleClick() {
    const { setVideo } = this.props;
    setVideo('/upload/larkintuckerllc-isfs-interactive/animation.mp4');
  }
  render() {
    return null;
  }
}
Trade.propTypes = {
  map: PropTypes.object,
  setVideo: PropTypes.func.isRequired,
};
export default connect(
  null,
  {
    setVideo: fromVideo.setVideo,
  }
)(Trade);
