import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getMasterChannel } from '../../util/parameters';
import { thr0w } from '../../api/thr0w';
import { getChannel } from '../../ducks/channel';
import * as fromWaypoint from '../../ducks/waypoint';
import * as fromTile from '../../ducks/tile';
import { BASE_URL_APP, SAVER_DELAY,
  SAVER_DURATION, SAVER_WAYPOINTS, SAVER_ZOOM } from '../../config';
import {
  frameXYToContentXY,
  getFrameHeight,
  getFrameWidth,
} from '../../util/grid';
import styles from './index.scss';

class Saver extends Component {
  constructor() {
    super();
    this.animate = this.animate.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
  }
  componentWillMount() {
    const { channel, tile, waypoint } = this.props;
    this.visibleContentLeft = frameXYToContentXY([0, 0])[0];
    this.visibleContentTop = frameXYToContentXY([0, 0])[1];
    this.frameWidth = getFrameWidth();
    this.frameHeight = getFrameHeight();
    const frameContentContainPositionEl = document.createElement('div');
    const frameContentContainMapEl = document.createElement('div');
    this.frameContentEl = document.getElementById('frame__content');
    this.frameContentEl.addEventListener('touchstart', this.handleTouchStart);
    // CREATE CONTAINER
    this.frameContentContainEl = document.createElement('div');
    this.frameContentContainEl.id = styles.frameContentContain;
    this.frameContentEl.appendChild(this.frameContentContainEl);
    // CREATE MAP
    frameContentContainMapEl.id = styles.frameContentContainMap;
    frameContentContainMapEl.style.left = `${this.visibleContentLeft}px`;
    frameContentContainMapEl.style.top = `${this.visibleContentTop}px`;
    frameContentContainMapEl.style.width = `${this.frameWidth}px`;
    frameContentContainMapEl.style.height = `${this.frameHeight}px`;
    this.frameContentContainEl.appendChild(frameContentContainMapEl);
    this.map = L.map(
      styles.frameContentContainMap,
      {
        zoomControl: false,
        attributionControl: false,
        closePopupOnClick: false,
        doubleClickZoom: false,
      }
    );
    // CREATE POSITION
    // NEED TO HANDLE CLICK
    this.map.addEventListener('touchstart', () => { window.console.log('click'); });
    frameContentContainPositionEl.id = styles.frameContentContainPosition;
    this.frameContentContainEl.appendChild(frameContentContainPositionEl);
    this.position = L.map(styles.frameContentContainPosition);
    this.positionMap(waypoint, false);
    this.changeTile(tile);
    if (channel === getMasterChannel()) {
      this.animateInterval = window.setInterval(this.animate, SAVER_DELAY * 1000);
    }
  }
  componentWillUpdate({ waypoint, tile }) {
    const oldTile = this.props.tile;
    if (tile !== oldTile) this.changeTile(tile);
    this.positionMap(waypoint, false);
  }
  componentWillUnmount() {
    window.clearInterval(this.animateInterval);
    this.map.remove();
    this.position.remove();
    this.frameContentEl.removeChild(this.frameContentContainEl);
    this.frameContentEl.removeEventListener('touchstart', this.handleTouchStart);
  }
  handleTouchStart() {
    thr0w([10, 11, 12, 13, 14, 15, 16, 17, 18, 19], {
      action: 'update',
      url: [
        BASE_URL_APP,
        '?mode=full',
        '#map',
      ].join(''),
    });
  }
  animate() {
    const { setWaypoint, waypoint } = this.props;
    const nextWaypoint = waypoint < SAVER_WAYPOINTS.length - 1 ? waypoint + 1 : 0;
    setWaypoint(nextWaypoint);
  }
  positionMap(waypoint, animate) {
    const latLng = SAVER_WAYPOINTS[waypoint];
    this.position.setView(
      L.latLng(latLng.lat, latLng.lng),
      SAVER_ZOOM,
      { animate: false }
    );
    this.map.setView(
      this.position.containerPointToLatLng(
        L.point(
          this.visibleContentLeft + (this.frameWidth / 2),
          this.visibleContentTop + (this.frameHeight / 2)
        )
      ),
      SAVER_ZOOM,
      {
        animate,
        duration: SAVER_DURATION,
      }
    );
  }
  changeTile(tile) {
    if (this.tileLayer) this.tileLayer.removeFrom(this.map);
    this.tileLayer = null;
    if (tile.url !== null) {
      this.tileLayer = L.tileLayer(tile.url).addTo(this.map);
    }
    document.querySelector('.leaflet-container')
      .style.backgroundColor = tile.bg;
  }
  render() {
    return (
      null
    );
  }
}
Saver.propTypes = {
  channel: PropTypes.number.isRequired,
  waypoint: PropTypes.number.isRequired,
  setWaypoint: PropTypes.func.isRequired,
  setTile: PropTypes.func.isRequired,
  tile: PropTypes.object.isRequired,
};
export default connect(
  state => ({
    channel: getChannel(state),
    waypoint: fromWaypoint.getWaypoint(state),
    tile: fromTile.getTile(state),
  }),
  {
    setWaypoint: fromWaypoint.setWaypoint,
    setTile: fromTile.setTile,
  }
)(Saver);
