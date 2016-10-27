import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import * as fromFisheries from '../../../ducks/fisheries';
import styles from './index.scss';
import cat from './img/cat.png';

class Fisheries extends Component {
  componentDidMount() {
    const { fetchFisheries } = this.props;
    this.markers = [];
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
    const { fisheries, map } = this.props;
    const nextFisheries = nextProps.fisheries;
    if (fisheries.length === 0 && nextFisheries.length !== 0) {
      for (let i = 0; i < nextFisheries.length; i++) {
        const fishery = nextFisheries[i];
        const catIcon = L.icon({
          iconUrl: cat,
          iconSize: [64, 64],
        });
        const marker = L.marker(fishery.latlng, { icon: catIcon });
        marker.bindPopup(this.renderPopup());
        marker.addTo(map);
        this.markers.push(marker);
      }
    }
  }
  componentWillUnmount() {
    const { map, resetFisheries } = this.props;
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].removeFrom(map);
    }
    resetFisheries();
  }
  renderPopup() {
    return (`
      <div id="${styles.highlight}">
        <img width=300 height=200 style="display: hidden;"/>
        <div id="${styles.highlightTitle}">Title</div>
      </div>
      <div id="data">
        <div class="${styles.dataMetric}">
          <div class="${styles.dataMetricTitle}">Ecological Performance</div>
          <div class="${styles.dataMetricValue}">
            <div style="width: 50%;" class="${styles.dataMetricValueBar}" />
          </div>
        </div>
        <div class="${styles.dataMetric}">
          <div class="${styles.dataMetricTitle}">Economic Performance</div>
          <div class="${styles.dataMetricValue}">
            <div style="width: 50%;" class="${styles.dataMetricValueBar}" />
          </div>
        </div>
        <div class="${styles.dataMetric}">
          <div class="${styles.dataMetricTitle}">Community Performance</div>
          <div class="${styles.dataMetricValue}">
            <div style="width: 50%;" class="${styles.dataMetricValueBar}" />
          </div>
        </div>
        <div class="${styles.dataScale}">
          <div id="${styles.dataScaleValueGood}" class="data__scale__value">Good</div>
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
  map: PropTypes.object,
  resetFisheries: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    fisheries: fromFisheries.getFisheries(state),
  }), {
    fetchFisheries: fromFisheries.fetchFisheries,
    resetFisheries: fromFisheries.resetFisheries,
  }
)(Fisheries);
