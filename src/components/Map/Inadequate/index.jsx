import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import * as fromInadequate from '../../../ducks/inadequate';
import { getElement } from '../../../api/regions';

class Inadequate extends Component {
  componentDidMount() {
    const { fetchInadequate } = this.props;
    this.layers = [];
    fetchInadequate()
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
    const { inadequate } = this.props;
    const nextInadequate = nextProps.inadequate;
    if (inadequate.length === 0 && nextInadequate.length !== 0) {
      for (let i = 0; i < nextInadequate.length; i++) {
        const ob = nextInadequate[i];
        this.renderRegion(ob);
      }
    }
  }
  componentWillUnmount() {
    const { map, resetInadequate } = this.props;
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      layer.removeFrom(map);
    }
    resetInadequate();
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
Inadequate.propTypes = {
  inadequate: PropTypes.array.isRequired,
  fetchInadequate: PropTypes.func.isRequired,
  map: PropTypes.object.isRequired,
  resetInadequate: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    inadequate: fromInadequate.getInadequate(state),
  }), {
    fetchInadequate: fromInadequate.fetchInadequate,
    resetInadequate: fromInadequate.resetInadequate,
  }
)(Inadequate);
