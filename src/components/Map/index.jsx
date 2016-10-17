import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as fromMapView from '../../ducks/mapView';
import {
  frameXYToContentXY,
  getContentHeight,
  getContentWidth,
  getFrameHeight,
  getFrameWidth,
  getScale,
} from '../../util/grid';
import { DAY_TILES_URL, DAY_TILES_MAX_ZOOM,
   DAY_TILES_ATTRIBUTION } from '../../config';
import styles from './index.scss';

class Map extends Component {
  constructor() {
    super();
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }
  componentWillMount() {
    const { mapView } = this.props;
    this.contentCenterX = getContentWidth() / 2;
    this.contentCenterY = getContentHeight() / 2;
    this.scale = getScale();
    this.visibleContentLeft = frameXYToContentXY([0, 0])[0];
    this.visibleContentTop = frameXYToContentXY([0, 0])[1];
    this.frameWidth = getFrameWidth();
    this.frameHeight = getFrameHeight();
    const frameContentContainPositionEl = document.createElement('div');
    const frameContentContainMapEl = document.createElement('div');
    // CREATE DOM ELEMENTS
    this.frameContentEl = document.getElementById('frame__content');
    this.frameContentContainEl = document.createElement('div');
    this.frameContentContainEl.id = styles.frameContentContain;
    this.frameContentEl.appendChild(this.frameContentContainEl);
    frameContentContainPositionEl.id = styles.frameContentContainPosition;
    this.frameContentContainEl.appendChild(frameContentContainPositionEl);
    this.position = L.map(styles.frameContentContainPosition);
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
    // EVENT LISTENERS
    this.frameContentContainEl.addEventListener('touchstart', this.handleTouchStart, true);
    this.frameContentContainEl.addEventListener('touchmove', this.handleTouchMove, true);
    this.frameContentContainEl.addEventListener('touchend', this.handleTouchEnd, true);
    this.frameContentContainEl.addEventListener('touchcancel', this.handleTouchEnd, true);
    // SETTING POSITION
    this.positionMap(mapView);
    // SETTING TILES
    L.tileLayer(DAY_TILES_URL, {
      attribution: DAY_TILES_ATTRIBUTION,
      maxZoom: DAY_TILES_MAX_ZOOM,
    }).addTo(this.map);
  }
  componentWillUpdate({ mapView }) {
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
    this.touchStartRadius = 0;
    this.touchOneLastX = (e.touches[0].pageX * this.scale) + this.visibleContentLeft;
    this.touchOneLastY = (e.touches[0].pageY * this.scale) + this.visibleContentTop;
  }
  handleTouchMove(e) {
    e.stopPropagation();
    const { mapView, setMapView } = this.props;
    const touchOneX = (e.touches[0].pageX * this.scale) + this.visibleContentLeft;
    const touchOneY = (e.touches[0].pageY * this.scale) + this.visibleContentTop;
    const centerLatLng = this.position.containerPointToLatLng(
      L.point(
        this.contentCenterX + (this.touchOneLastX - touchOneX),
        this.contentCenterY + (this.touchOneLastY - touchOneY)
      )
    );
    setMapView({
      center: {
        lat: centerLatLng.lat,
        lng: centerLatLng.lng,
      },
      zoom: mapView.zoom,
    });
    this.touchOneLastX = touchOneX;
    this.touchOneLastY = touchOneY;
  }
  handleTouchEnd(e) {
    e.stopPropagation();
    if (e.touches.length > 0) {
      this.touchOneLastX = (e.touches[0].pageX * this.scale) + this.visibleContentLeft;
      this.touchOneLastY = (e.touches[0].pageY * this.scale) + this.visibleContentTop;
    }
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
  render() {
    const { children } = this.props;
    return (
      <div>
        <div id={styles.root} />
        {children !== null ? React.cloneElement(children, { map: this.map }) : null}
      </div>
    );
  }
}
Map.propTypes = {
  children: PropTypes.node,
  mapView: PropTypes.object.isRequired,
  setMapView: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    mapView: fromMapView.getMapView(state),
  }),
  {
    setMapView: fromMapView.setMapView,
  }
)(Map);
