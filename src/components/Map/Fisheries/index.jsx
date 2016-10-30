import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import { BASE_URL_UPLOAD } from '../../../config';
import * as fromFisheries from '../../../ducks/fisheries';
import * as fromPopup from '../../../ducks/popup';
import styles from './index.scss';

class Fisheries extends Component {
  constructor() {
    super();
    this.renderPopup = this.renderPopup.bind(this);
    this.handlePopupOpen = this.handlePopupOpen.bind(this);
    this.handlePopupClose = this.handlePopupClose.bind(this);
  }
  componentDidMount() {
    const { fetchFisheries } = this.props;
    this.markers = [];
    this.popupOpen = false;
    fetchFisheries()
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
    const { fisheries, map, popup } = this.props;
    const nextFisheries = nextProps.fisheries;
    const nextPopup = nextProps.popup;
    if (!this.popupOpen && nextPopup !== null && popup === null) {
      for (let i = 0; i < this.markers.length; i++) {
        const marker = this.markers[i];
        if (marker.id === nextPopup.id) {
          this.popupOpen = true;
          marker.openPopup();
        }
      }
    }
    if (this.popupOpen && nextPopup === null && popup !== null) {
      for (let i = 0; i < this.markers.length; i++) {
        const marker = this.markers[i];
        if (marker.id === popup.id) {
          this.popupOpen = false;
          marker.closePopup();
        }
      }
    }
    if (fisheries.length === 0 && nextFisheries.length !== 0) {
      for (let i = 0; i < nextFisheries.length; i++) {
        const fishery = nextFisheries[i];
        const icon = L.icon({
          iconUrl: `${BASE_URL_UPLOAD}fisheries/markers/${fishery.id}.png`,
          iconSize: [64, 64],
        });
        const marker = L.marker(fishery.latlng, { icon });
        marker.id = fishery.id;
        marker.bindPopup(this.renderPopup(fishery.id, fishery.title,
          fishery.ecology, fishery.economic, fishery.community),
          { autoPan: false });
        marker.addEventListener('popupopen', this.handlePopupOpen);
        marker.addEventListener('popupclose', this.handlePopupClose);
        marker.addTo(map);
        this.markers.push(marker);
      }
    }
  }
  componentWillUnmount() {
    const { map, resetFisheries } = this.props;
    for (let i = 0; i < this.markers.length; i++) {
      const marker = this.markers[i];
      marker.removeEventListener('popupopen', this.handlePopupOpen);
      marker.removeEventListener('popupclose', this.handlePopupClose);
      marker.removeFrom(map);
    }
    resetFisheries();
  }
  handlePopupOpen(e) {
    const { setPopup } = this.props;
    if (this.popupOpen) return;
    this.popupOpen = true;
    setPopup({
      id: e.target.id,
      lat: null,
      lng: null,
    });
  }
  handlePopupClose() {
    const { removePopup } = this.props;
    if (!this.popupOpen) return;
    this.popupOpen = false;
    removePopup();
  }
  valueToColor(value) {
    if (value >= 4) {
      return 'rgb(90,200,90)';
    }
    if (value >= 3) {
      return 'rgb(200,200,90)';
    }
    return ('rgb(200,90,90)');
  }
  renderPopup(id, title, ecology, economic, community) {
    return (`
      <div class="${styles.highlight}">
        <img width=300 height=200 src="${BASE_URL_UPLOAD}fisheries/banners/${id}.jpg" />
        <div class="${styles.highlightTitle}">${title}</div>
      </div>
      <div class="data">
        <div class="${styles.dataMetric}">
          <div class="${styles.dataMetricTitle}">Ecological Performance</div>
          <div class="${styles.dataMetricValue}">
            <div
              class="${styles.dataMetricValueContainer}"
              style="width: ${100 * ((ecology - 1) / 5)}%;"
            >
              <div class="${styles.dataMetricValueContainerBar}"
                style="background-color: ${this.valueToColor(ecology)};"
              />
            </div>
          </div>
        </div>
        <div class="${styles.dataMetric}">
          <div class="${styles.dataMetricTitle}">Economic Performance</div>
          <div class="${styles.dataMetricValue}">
            <div
              class="${styles.dataMetricValueContainer}"
              style="width: ${100 * ((economic - 1) / 5)}%;"
            >
              <div class="${styles.dataMetricValueContainerBar}"
                style="background-color: ${this.valueToColor(economic)};"
              />
            </div>
          </div>
        </div>
        <div class="${styles.dataMetric}">
          <div class="${styles.dataMetricTitle}">Community Performance</div>
          <div class="${styles.dataMetricValue}">
            <div
              class="${styles.dataMetricValueContainer}"
              style="width: ${100 * ((community - 1) / 5)}%;"
            >
              <div class="${styles.dataMetricValueContainerBar}"
                style="background-color: ${this.valueToColor(community)};"
              />
            </div>
          </div>
        </div>
        <div class="${styles.dataScale}">
          <div class="${styles.dataScaleValueRight}">Good</div>
          <div">Poor</div>
        </div>
      </div>
    `);
  }
  render() {
    return null;
  }
}
Fisheries.propTypes = {
  fetchFisheries: PropTypes.func.isRequired,
  fisheries: PropTypes.array.isRequired,
  popup: PropTypes.object,
  removePopup: PropTypes.func.isRequired,
  map: PropTypes.object,
  resetFisheries: PropTypes.func.isRequired,
  setPopup: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    fisheries: fromFisheries.getFisheries(state),
    popup: fromPopup.getPopup(state),
  }), {
    fetchFisheries: fromFisheries.fetchFisheries,
    removePopup: fromPopup.removePopup,
    resetFisheries: fromFisheries.resetFisheries,
    setPopup: fromPopup.setPopup,
  }
)(Fisheries);
