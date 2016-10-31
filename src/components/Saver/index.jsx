import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as fromReactRouterRedux from 'react-router-redux';
import * as fromWaypoint from '../../ducks/waypoint';
import * as fromTile from '../../ducks/tile';
import { SAVER_DURATION, SAVER_WAYPOINTS, SAVER_ZOOM } from '../../config';
import {
  frameXYToContentXY,
  getContentHeight,
  getContentWidth,
  getFrameHeight,
  getFrameWidth,
  getScale,
} from '../../util/grid';
import styles from './index.scss';

class Saver extends Component {
  componentWillMount() {
    const { waypoint, tile } = this.props;
    this.contentCenterX = getContentWidth() / 2;
    this.contentCenterY = getContentHeight() / 2;
    this.scale = getScale();
    this.visibleContentLeft = frameXYToContentXY([0, 0])[0];
    this.visibleContentTop = frameXYToContentXY([0, 0])[1];
    this.frameWidth = getFrameWidth();
    this.frameHeight = getFrameHeight();
    const frameContentContainPositionEl = document.createElement('div');
    const frameContentContainMapEl = document.createElement('div');
    this.frameContentEl = document.getElementById('frame__content');
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
    frameContentContainPositionEl.id = styles.frameContentContainPosition;
    this.frameContentContainEl.appendChild(frameContentContainPositionEl);
    this.position = L.map(styles.frameContentContainPosition);
    this.positionMap(waypoint, false);
    this.changeTile(tile);
  }
  componentWillUpdate({ waypoint, tile }) {
    const oldTile = this.props.tile;
    if (tile !== oldTile) this.changeTile(tile);
    this.positionMap(waypoint, true);
  }
  componentWillUnmount() {
    this.map.remove();
    this.position.remove();
    this.frameContentEl.removeChild(this.frameContentContainEl);
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
  waypoint: PropTypes.number.isRequired,
  push: PropTypes.func.isRequired,
  setWaypoint: PropTypes.func.isRequired,
  setTile: PropTypes.func.isRequired,
  tile: PropTypes.object.isRequired,
};
export default connect(
  state => ({
    waypoint: fromWaypoint.getWaypoint(state),
    tile: fromTile.getTile(state),
  }),
  {
    push: fromReactRouterRedux.push,
    setWaypoint: fromWaypoint.setWaypoint,
    setTile: fromTile.setTile,
  }
)(Saver);
