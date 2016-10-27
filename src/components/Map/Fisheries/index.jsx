import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import * as fromFisheries from '../../../ducks/fisheries';
import styles from './index.scss';

class Fisheries extends Component {
  constructor() {
    super();
    this.renderPopup = this.renderPopup.bind(this);
  }
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
          iconUrl: `/upload/larkintuckerllc-isfs-interactive/${fishery.id}.png`,
          iconSize: [64, 64],
        });
        const marker = L.marker(fishery.latlng, { icon: catIcon });
        marker.bindPopup(this.renderPopup(fishery.id, fishery.title,
          fishery.ecology, fishery.economic, fishery.community));
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
      <div id="${styles.highlight}">
        <img width=300 height=200 src="/upload/larkintuckerllc-isfs-interactive/${id}.jpg" />
        <div id="${styles.highlightTitle}">${title}</div>
      </div>
      <div id="data">
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
          <div id="${styles.dataScaleValueGood}">Good</div>
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
