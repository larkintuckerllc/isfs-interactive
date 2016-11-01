import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import * as fromObesity from '../../../ducks/obesity';
import { getElement } from '../../../api/regions';

class Obesity extends Component {
  componentDidMount() {
    const { fetchObesity } = this.props;
    this.layers = [];
    fetchObesity()
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
    const { obesity } = this.props;
    const nextObesity = nextProps.obesity;
    if (obesity.length === 0 && nextObesity.length !== 0) {
      for (let i = 0; i < nextObesity.length; i++) {
        const ob = nextObesity[i];
        this.renderRegion(ob);
      }
    }
  }
  componentWillUnmount() {
    const { map, resetObesity } = this.props;
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      layer.removeFrom(map);
    }
    resetObesity();
  }
  renderRegion(ob) {
    const { map } = this.props;
    getElement(ob.id)
      .then((region) => {
        const layer = L.geoJson(
          region,
          {
            fillColor: ob.color,
            weight: 5,
            opacity: 1,
            color: 'rgb(255,255,255)',
            fillOpacity: 0.7,
          }
        );
        layer.id = ob.id;
        layer.addTo(map);
        this.layers.push(layer);
      }
    );
  }
  render() {
    return null;
  }
}
Obesity.propTypes = {
  obesity: PropTypes.array.isRequired,
  fetchObesity: PropTypes.func.isRequired,
  map: PropTypes.object.isRequired,
  resetObesity: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    obesity: fromObesity.getObesity(state),
  }), {
    fetchObesity: fromObesity.fetchObesity,
    resetObesity: fromObesity.resetObesity,
  }
)(Obesity);
