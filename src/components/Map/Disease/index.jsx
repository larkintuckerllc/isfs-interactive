import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import * as fromDiseases from '../../../ducks/diseases';
import * as fromPopup from '../../../ducks/popup';
import { getElement } from '../../../api/regions';

class Disease extends Component {
  constructor() {
    super();
    this.renderPopup = this.renderPopup.bind(this);
    this.handlePopupOpen = this.handlePopupOpen.bind(this);
    this.handlePopupClose = this.handlePopupClose.bind(this);
  }
  componentDidMount() {
    const { fetchDiseases } = this.props;
    this.layers = [];
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
    if (!this.popupOpen && nextPopup !== null && popup === null) {
      for (let i = 0; i < this.layers.length; i++) {
        const layer = this.layers[i];
        if (layer.id === nextPopup) {
          this.popupOpen = true;
          layer.openPopup();
        }
      }
    }
    if (this.popupOpen && nextPopup === null && popup !== null) {
      for (let i = 0; i < this.layers.length; i++) {
        const layer = this.layers[i];
        if (layer.id === popup) {
          this.popupOpen = false;
          layer.closePopup();
        }
      }
    }
    if (diseases.length === 0 && nextDiseases.length !== 0) {
      for (let i = 0; i < nextDiseases.length; i++) {
        const disease = nextDiseases[i];
        this.renderRegion(disease.id, disease.color);
      }
    }
  }
  componentWillUnmount() {
    const { map, resetDiseases } = this.props;
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      layer.removeFrom(map);
    }
    resetDiseases();
  }
  handlePopupOpen(e) {
    const { setPopup } = this.props;
    if (this.popupOpen) return;
    this.popupOpen = true;
    setPopup(e.target.id);
  }
  handlePopupClose() {
    const { removePopup } = this.props;
    if (!this.popupOpen) return;
    this.popupOpen = false;
    removePopup();
  }
  renderPopup() {
    return (`
      <div>Test</div>
    `);
  }
  renderRegion(id, color) {
    const { map } = this.props;
    getElement(id)
      .then((region) => {
        const layer = L.geoJson(
          region,
          {
            fillColor: color,
            weight: 5,
            opacity: 1,
            color: 'rgb(255,255,255)',
            fillOpacity: 0.7,
          }
        );
        layer.id = id;
        layer.addTo(map);
        layer.bindPopup(this.renderPopup(),
          { autoPan: false });
        layer.addEventListener('popupopen', this.handlePopupOpen);
        layer.addEventListener('popupclose', this.handlePopupClose);
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
  popup: PropTypes.string,
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
