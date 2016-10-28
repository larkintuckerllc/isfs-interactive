import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import * as fromDiseases from '../../../ducks/diseases';
import { getElement } from '../../../api/regions';

class Disease extends Component {
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
    const { diseases } = this.props;
    const nextDiseases = nextProps.diseases;
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
        layer.addTo(map);
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
  resetDiseases: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    diseases: fromDiseases.getDiseases(state),
  }), {
    fetchDiseases: fromDiseases.fetchDiseases,
    resetDiseases: fromDiseases.resetDiseases,
  }
)(Disease);
