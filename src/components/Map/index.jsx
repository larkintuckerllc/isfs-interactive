import React, { Component, PropTypes } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  frameXYToContentXY,
  getFrameHeight,
  getFrameWidth,
} from 'thr0w-client-module/lib/grid';
import { CENTER, DAY_TILES_URL, DAY_TILES_MAX_ZOOM,
   DAY_TILES_ATTRIBUTION, ZOOM } from '../../config';
import styles from './index.scss';

class Map extends Component {
  constructor() {
    super();
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }
  componentWillMount() {
    const visibleContentLeft = frameXYToContentXY([0, 0])[0];
    const visibleContentTop = frameXYToContentXY([0, 0])[1];
    const frameWidth = getFrameWidth();
    const frameHeight = getFrameHeight();
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
    frameContentContainMapEl.style.left = `${visibleContentLeft}px`;
    frameContentContainMapEl.style.top = `${visibleContentTop}px`;
    frameContentContainMapEl.style.width = `${frameWidth}px`;
    frameContentContainMapEl.style.height = `${frameHeight}px`;
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
    this.position.setView(
      L.latLng(CENTER.lat, CENTER.lng),
      ZOOM,
      { animate: false }
    );
    this.map.setView(
      this.position.containerPointToLatLng(
        L.point(
          visibleContentLeft + (frameWidth / 2),
          visibleContentTop + (frameHeight / 2)
        )
      ),
      ZOOM,
      { animate: false }
    );
    L.tileLayer(DAY_TILES_URL, {
      attribution: DAY_TILES_ATTRIBUTION,
      maxZoom: DAY_TILES_MAX_ZOOM,
    }).addTo(this.map);
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
    window.console.log('START');
  }
  handleTouchMove(e) {
    e.stopPropagation();
    window.console.log('MOVE');
  }
  handleTouchEnd(e) {
    e.stopPropagation();
    window.console.log('END');
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
};
export default Map;
