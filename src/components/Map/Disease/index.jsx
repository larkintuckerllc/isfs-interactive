import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import * as fromDiseases from '../../../ducks/diseases';
import * as fromPopup from '../../../ducks/popup';
import { getElement } from '../../../api/regions';
import styles from './index.scss';
import arieHavelaarHead from './img/arie_havelaar_head.jpg';
import arieHavelaarQr from './img/arie_havelaar_qr.jpg';

class Disease extends Component {
  constructor() {
    super();
    this.renderPopup = this.renderPopup.bind(this);
    this.handlePopupOpen = this.handlePopupOpen.bind(this);
    this.handlePopupClose = this.handlePopupClose.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    const { fetchDiseases } = this.props;
    this.layers = [];
    this.popupOpen = false;
    this.popupMoving = false;
    fetchDiseases()
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
    const { diseases, popup } = this.props;
    const nextDiseases = nextProps.diseases;
    const nextPopup = nextProps.popup;
    if (this.popupMoving && nextPopup !== null) this.popupMoving = false;
    if (!this.popupOpen && nextPopup !== null && popup === null) {
      for (let i = 0; i < this.layers.length; i++) {
        const layer = this.layers[i];
        if (layer.id === nextPopup.id) {
          this.popupOpen = true;
          layer.openPopup(L.latLng(nextPopup.lat, nextPopup.lng));
        }
      }
    }
    if (!this.popupMoving && this.popupOpen && nextPopup === null && popup !== null) {
      for (let i = 0; i < this.layers.length; i++) {
        const layer = this.layers[i];
        if (layer.id === popup.id) {
          this.popupOpen = false;
          layer.closePopup();
        }
      }
    }
    if (diseases.length === 0 && nextDiseases.length !== 0) {
      for (let i = 0; i < nextDiseases.length; i++) {
        const disease = nextDiseases[i];
        this.renderRegion(disease);
      }
    }
  }
  componentWillUnmount() {
    const { map, resetDiseases } = this.props;
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      layer.removeEventListener('popupopen', this.handlePopupOpen);
      layer.removeEventListener('popupclose', this.handlePopupClose);
      layer.removeEventListener('click', this.handleClick);
      layer.removeFrom(map);
    }
    resetDiseases();
  }
  handlePopupOpen(e) {
    const { setPopup } = this.props;
    if (this.popupOpen) return;
    this.popupOpen = true;
    const latLng = e.popup.getLatLng();
    setPopup({
      id: e.target.id,
      lat: latLng.lat,
      lng: latLng.lng,
    });
  }
  handlePopupClose() {
    const { removePopup } = this.props;
    if (!this.popupOpen) return;
    this.popupOpen = false;
    removePopup();
  }
  handleClick(e) {
    const { popup, setPopup } = this.props;
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    if (lat === popup.lat && lng === popup.lng) return;
    this.popupMoving = true;
    setPopup(null);
    setPopup({
      id: e.target.id,
      lat,
      lng,
    });
  }
  renderPopup(disease) {
    const allHazards = disease['All Hazards'];
    return (`
      <div class="${styles.title}">
        ${disease.region} - Foodborne Per 100,000 DALYS:
      </div>
      <div class="data">
        <div class="${styles.dataMetric}">
          <div class="${styles.dataMetricTitle} ${styles.dataMetricTitleChemicals}">Chemicals
            and Toxins</div>
          <div class="${styles.dataMetricValue}">
            <div
              class="${styles.dataMetricValueContainer}"
              style="width: ${100 * (disease['Chemicals and Toxins'] / allHazards)}%;"
            >
              <div class="${styles.dataMetricValueContainerBar}"/>
            </div>
          </div>
        </div>
        <div class="${styles.dataMetric}">
          <div class="${styles.dataMetricTitle} ${styles.dataMetricTitleDiarrheal}">Diarrheal
            Disease Agents</div>
          <div class="${styles.dataMetricValue}">
            <div
              class="${styles.dataMetricValueContainer}"
              style="width: ${100 * (disease['Diarrheal Disease Agents'] / allHazards)}%;"
            >
              <div class="${styles.dataMetricValueContainerBar}"/>
            </div>
          </div>
        </div>
        <div class="${styles.dataMetric}">
          <div class="${styles.dataMetricTitle} ${styles.dataMetricTitleHelminths}">Helminths</div>
          <div class="${styles.dataMetricValue}">
            <div
              class="${styles.dataMetricValueContainer}"
              style="width: ${100 * (disease.Helminths / allHazards)}%;"
            >
              <div class="${styles.dataMetricValueContainerBar}"/>
            </div>
          </div>
        </div>
        <div class="${styles.dataMetric}">
          <div class="${styles.dataMetricTitle} ${styles.dataMetricTitleInvasive}">Invasive
            Infectious Disease Agents</div>
          <div class="${styles.dataMetricValue}">
            <div
              class="${styles.dataMetricValueContainer}"
              style="width: ${100 * (disease['Invasive Infectious Disease Agents'] / allHazards)}%;"
            >
              <div class="${styles.dataMetricValueContainerBar}"/>
            </div>
          </div>
        </div>
        <div class="${styles.dataScale}">
          <div class="${styles.dataScaleValueRight}">${allHazards}</div>
          <div">0</div>
        </div>
      </div>
      <div class="${styles.contact}">
        <div class="${styles.contactTitle}">
          For more information contact:
        </div>
        <div class="${styles.contactOptions}">
          <div class="${styles.contactOptionsRead}">
            <img src="${arieHavelaarHead}" width="100" height="auto" /><br />
            <br />
            <b>Arie Havelaar</b></br>
            ariehavelaar@ufl.edu
          </div>
          <div class="${styles.contactOptionsQr}">
            <img src="${arieHavelaarQr}" width="150" height="150" />
          </div>
        </div>
      </div>
    `);
  }
  renderRegion(disease) {
    const { map } = this.props;
    getElement(disease.id)
      .then((region) => {
        const layer = L.geoJson(
          region,
          {
            fillColor: disease.color,
            weight: 5,
            opacity: 1,
            color: 'rgb(255,255,255)',
            fillOpacity: 0.7,
          }
        );
        layer.id = disease.id;
        layer.addTo(map);
        layer.bindPopup(this.renderPopup(disease),
          { autoPan: false });
        layer.addEventListener('popupopen', this.handlePopupOpen);
        layer.addEventListener('popupclose', this.handlePopupClose);
        layer.addEventListener('click', this.handleClick);
        this.layers.push(layer);
      }
    );
  }
  render() {
    return null;
  }
}
Disease.propTypes = {
  diseases: PropTypes.array.isRequired,
  fetchDiseases: PropTypes.func.isRequired,
  map: PropTypes.object.isRequired,
  popup: PropTypes.object,
  removePopup: PropTypes.func.isRequired,
  resetDiseases: PropTypes.func.isRequired,
  setPopup: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    diseases: fromDiseases.getDiseases(state),
    popup: fromPopup.getPopup(state),
  }), {
    fetchDiseases: fromDiseases.fetchDiseases,
    removePopup: fromPopup.removePopup,
    resetDiseases: fromDiseases.resetDiseases,
    setPopup: fromPopup.setPopup,
  }
)(Disease);
