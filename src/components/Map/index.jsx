import React, { Component, PropTypes } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CENTER, DAY_TILES_URL, DAY_TILES_MAX_ZOOM,
  DAY_TILES_ATTRIBUTION, ZOOM } from '../../config';
import * as fromStyles from './index.scss';

class Map extends Component {
  componentWillMount() {
    this.map = L.map(
      'frame__content',
      {
        zoomControl: false,
        attributionControl: false,
      }
    ).setView([CENTER.lat, CENTER.lng], ZOOM);
    L.tileLayer(DAY_TILES_URL, {
      attribution: DAY_TILES_ATTRIBUTION,
      maxZoom: DAY_TILES_MAX_ZOOM,
    }).addTo(this.map);
  }
  componentWillUnmount() {
    const frameContent = document.getElementById('frame__content');
    this.map.remove();
    frameContent.classList.remove('leaflet-container');
    frameContent.classList.remove('leaflet-touch');
    frameContent.classList.remove('leaflet-fade-anim');
  }
  render() {
    const { children } = this.props;
    return (
      <div>
        <div id={fromStyles.root} />
        {children !== null ? React.cloneElement(children, { map: this.map }) : null}
      </div>
    );
  }
}
Map.propTypes = {
  children: PropTypes.node,
};
export default Map;
