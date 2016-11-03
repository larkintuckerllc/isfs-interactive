import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import * as fromOverweight from '../../../ducks/overweight';
import { getElement } from '../../../api/regions';

class Overweight extends Component {
  componentDidMount() {
    const { fetchOverweight } = this.props;
    this.layers = [];
    fetchOverweight()
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
    const { overweight } = this.props;
    const nextOverweight = nextProps.overweight;
    if (overweight.length === 0 && nextOverweight.length !== 0) {
      for (let i = 0; i < nextOverweight.length; i++) {
        const ob = nextOverweight[i];
        this.renderRegion(ob);
      }
    }
  }
  componentWillUnmount() {
    const { map, resetOverweight } = this.props;
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      layer.removeFrom(map);
    }
    resetOverweight();
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
Overweight.propTypes = {
  overweight: PropTypes.array.isRequired,
  fetchOverweight: PropTypes.func.isRequired,
  map: PropTypes.object.isRequired,
  resetOverweight: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    overweight: fromOverweight.getOverweight(state),
  }), {
    fetchOverweight: fromOverweight.fetchOverweight,
    resetOverweight: fromOverweight.resetOverweight,
  }
)(Overweight);
