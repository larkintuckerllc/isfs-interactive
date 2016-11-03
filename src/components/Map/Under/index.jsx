import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import * as fromUnder from '../../../ducks/under';
import { getElement } from '../../../api/regions';

class Under extends Component {
  componentDidMount() {
    const { fetchUnder } = this.props;
    this.layers = [];
    fetchUnder()
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
    const { under } = this.props;
    const nextUnder = nextProps.under;
    if (under.length === 0 && nextUnder.length !== 0) {
      for (let i = 0; i < nextUnder.length; i++) {
        const ob = nextUnder[i];
        this.renderRegion(ob);
      }
    }
  }
  componentWillUnmount() {
    const { map, resetUnder } = this.props;
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      layer.removeFrom(map);
    }
    resetUnder();
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
Under.propTypes = {
  under: PropTypes.array.isRequired,
  fetchUnder: PropTypes.func.isRequired,
  map: PropTypes.object.isRequired,
  resetUnder: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    under: fromUnder.getUnder(state),
  }), {
    fetchUnder: fromUnder.fetchUnder,
    resetUnder: fromUnder.resetUnder,
  }
)(Under);
