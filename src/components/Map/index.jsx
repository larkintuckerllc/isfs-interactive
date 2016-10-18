import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as fromMapView from '../../ducks/mapView';
import * as fromTile from '../../ducks/tile';
import {
  frameXYToContentXY,
  getContentHeight,
  getContentWidth,
  getFrameHeight,
  getFrameWidth,
  getScale,
} from '../../util/grid';
import { getLeftBottom } from '../../util/mode';
import { HAND_WIDTH, MAX_LAT, MIN_LAT, TILES,
  ZOOM_MIN, ZOOM_MAX } from '../../config';
import styles from './index.scss';
import satellite from './img/satellite.png';
import street from './img/street.png';
import night from './img/night.png';
import white from './img/white.png';
import black from './img/black.png';

const buttonIcons = {
  satellite,
  street,
  night,
  white,
  black,
  lights: night,
};
class Map extends Component {
  constructor() {
    super();
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }
  componentWillMount() {
    const { mapView, tile } = this.props;
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
      }
    );
    // CREATE POSITION
    frameContentContainPositionEl.id = styles.frameContentContainPosition;
    this.frameContentContainEl.appendChild(frameContentContainPositionEl);
    this.position = L.map(styles.frameContentContainPosition);
    // EVENT LISTENERS
    this.frameContentContainEl.addEventListener('touchstart', this.handleTouchStart, true);
    this.frameContentContainEl.addEventListener('touchmove', this.handleTouchMove, true);
    this.frameContentContainEl.addEventListener('touchend', this.handleTouchEnd, true);
    this.frameContentContainEl.addEventListener('touchcancel', this.handleTouchEnd, true);
    this.positionMap(mapView);
    this.changeTile(tile);
  }
  componentWillUpdate({ mapView, tile }) {
    const oldTile = this.props.tile;
    if (tile !== oldTile) this.changeTile(tile);
    this.positionMap(mapView);
  }
  componentWillUnmount() {
    this.frameContentContainEl.removeEventListener('touchstart', this.handleTouchStart);
    this.frameContentContainEl.removeEventListener('touchmove', this.handleTouchMove);
    this.frameContentContainEl.removeEventListener('touchend', this.handleTouchEnd);
    this.frameContentContainEl.removeEventListener('touchcancel', this.handleTouchEnd);
    this.map.remove();
    this.position.remove();
    this.frameContentEl.removeChild(this.frameContentContainEl);
  }
  handleTouchStart(e) {
    e.stopPropagation();
    if (e.touches.length !== 1) return;
    this.moving = true;
    this.zooming = false;
    this.touchOneLastX = (e.touches[0].pageX * this.scale) + this.visibleContentLeft;
    this.touchOneLastY = (e.touches[0].pageY * this.scale) + this.visibleContentTop;
  }
  handleTouchMove(e) {
    e.stopPropagation();
    if (!this.moving) return;
    if (this.zooming) return;
    let radius = 0;
    for (let i = 0; i < e.touches.length; i++) {
      for (let j = 0; j < e.touches.length; j++) {
        if (i < j) {
          radius = Math.max(Math.floor(this.scale * Math.sqrt(
            Math.pow(e.touches[i].pageX - e.touches[j].pageX, 2) +
            Math.pow(e.touches[i].pageY - e.touches[j].pageY, 2)
          )), radius);
        }
      }
    }
    if (radius >= HAND_WIDTH) {
      this.moving = false;
      this.zooming = true;
      this.startRadius = radius;
    }
    const { mapView, setMapView } = this.props;
    const touchOneX = (e.touches[0].pageX * this.scale) + this.visibleContentLeft;
    const touchOneY = (e.touches[0].pageY * this.scale) + this.visibleContentTop;
    const shiftY = this.touchOneLastY - touchOneY;
    let atBoundary = false;
    const topLeftLatLng = this.position.containerPointToLatLng(
      L.point(0, 0)
    );
    const bottomRightLatLng = this.position.containerPointToLatLng(
      L.point(this.contentCenterX * 2, this.contentCenterY * 2)
    );
    if (topLeftLatLng.lat > MAX_LAT && shiftY < 0) {
      atBoundary = true;
    }
    if (bottomRightLatLng.lat < MIN_LAT && shiftY > 0) {
      atBoundary = true;
    }
    const centerLatLng = this.position.containerPointToLatLng(
      L.point(
        this.contentCenterX + (this.touchOneLastX - touchOneX),
        this.contentCenterY + shiftY
      )
    );
    setMapView({
      center: {
        lat: atBoundary ? mapView.center.lat : centerLatLng.lat,
        lng: centerLatLng.lng,
      },
      zoom: mapView.zoom,
    });
    this.touchOneLastX = touchOneX;
    this.touchOneLastY = touchOneY;
  }
  handleTouchEnd(e) {
    e.stopPropagation();
    if (this.moving && e.touches.length > 0) {
      this.touchOneLastX = (e.touches[0].pageX * this.scale) + this.visibleContentLeft;
      this.touchOneLastY = (e.touches[0].pageY * this.scale) + this.visibleContentTop;
    }
    if (!this.zooming) return;
    const { mapView, setMapView } = this.props;
    let radius = 0;
    let zoom = mapView.zoom;
    let center = mapView.center;
    let totalX = (e.changedTouches[0].pageX * this.scale) + this.visibleContentLeft;
    let totalY = (e.changedTouches[0].pageY * this.scale) + this.visibleContentTop;
    this.zooming = false;
    for (let i = 0; i < e.touches.length; i++) {
      totalX += (e.touches[i].pageX * this.scale) + this.visibleContentLeft;
      totalY += (e.touches[i].pageY * this.scale) + this.visibleContentTop;
      for (let j = 0; j < e.touches.length; j++) {
        if (i < j) {
          radius = Math.max(Math.floor(this.scale * Math.sqrt(
            Math.pow(e.touches[i].pageX - e.touches[j].pageX, 2) +
            Math.pow(e.touches[i].pageY - e.touches[j].pageY, 2)
          )), radius);
        }
      }
      radius = Math.max(Math.floor(this.scale * Math.sqrt(
        Math.pow(e.touches[i].pageX - e.changedTouches[0].pageX, 2) +
        Math.pow(e.touches[i].pageY - e.changedTouches[0].pageY, 2)
      )), radius);
    }
    if (radius >= this.startRadius && mapView.zoom < ZOOM_MAX) {
      const centerLatLng = this.position.containerPointToLatLng(
        L.point(
          ((totalX / (e.touches.length + 1)) + this.contentCenterX) / 2,
          ((totalY / (e.touches.length + 1)) + this.contentCenterY) / 2
        )
      );
      center = {
        lat: centerLatLng.lat,
        lng: centerLatLng.lng,
      };
      zoom = mapView.zoom + 1;
    }
    if (radius <= this.startRadius && mapView.zoom > ZOOM_MIN) {
      const topLeftLatLng = this.position.containerPointToLatLng(
        L.point(0, 0)
      );
      const bottomRightLatLng = this.position.containerPointToLatLng(
        L.point(this.contentCenterX * 2, this.contentCenterY * 2)
      );
      if (topLeftLatLng.lat >= 0 && bottomRightLatLng.lat >= 0) {
        center = {
          lat: bottomRightLatLng.lat,
          lng: mapView.center.lng,
        };
      }
      if (topLeftLatLng.lat >= 0 && bottomRightLatLng.lat < 0) {
        center = {
          lat: 0,
          lng: mapView.center.lng,
        };
      }
      if (topLeftLatLng.lat < 0 && bottomRightLatLng.lat < 0) {
        center = {
          lat: topLeftLatLng.lat,
          lng: mapView.center.lng,
        };
      }
      zoom = mapView.zoom - 1;
    }
    setMapView({
      center,
      zoom,
    });
  }
  positionMap(view) {
    this.position.setView(
      L.latLng(view.center.lat, view.center.lng),
      view.zoom,
      { animate: false }
    );
    this.map.setView(
      this.position.containerPointToLatLng(
        L.point(
          this.visibleContentLeft + (this.frameWidth / 2),
          this.visibleContentTop + (this.frameHeight / 2)
        )
      ),
      view.zoom,
      { animate: false }
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
    const { children, setTile, tile } = this.props;
    return (
      <div>
        <div
          id={styles.root}
          style={{ left: getLeftBottom() }}
        >
          {TILES.ids.map(id => (
            <div
              key={id}
              className={styles.rootButton}
              onClick={() => setTile(TILES.byId[id])}
            >
              <img src={buttonIcons[id]} width="100" height="100" alt={id} />
              {tile.id === id && (<div className={styles.rootButtonSelected} />)}
            </div>
          ))}
        </div>
        {children !== null ? React.cloneElement(children, { map: this.map }) : null}
      </div>
    );
  }
}
Map.propTypes = {
  children: PropTypes.node,
  mapView: PropTypes.object.isRequired,
  setMapView: PropTypes.func.isRequired,
  setTile: PropTypes.func.isRequired,
  tile: PropTypes.object.isRequired,
};
export default connect(
  state => ({
    mapView: fromMapView.getMapView(state),
    tile: fromTile.getTile(state),
  }),
  {
    setMapView: fromMapView.setMapView,
    setTile: fromTile.setTile,
  }
)(Map);
