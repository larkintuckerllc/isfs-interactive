import React, { Component, PropTypes } from 'react';
import * as d3Core from 'd3';
import * as d3Geo from 'd3-geo';
import { BASE_URL_UPLOAD } from '../../../config';
import './samples.json';
import styles from './index.scss';

const STROKE_COLORS = [
  'rgba(255, 0, 0, 0.5)',
  'rgba(0, 255, 0, 0.5)',
  'rgba(0, 0, 255, 0.5)',
  'rgba(128, 0, 0, 0.5)',
  'rgba(0, 128, 0, 0.5)',
  'rgba(0, 0, 128, 0.5)',
  'rgba(128, 128, 0, 0.5)',
  'rgba(128, 0, 128, 0.5)',
  'rgba(0, 128, 128, 0.5)',
  'rgba(255, 255, 0, 0.5)',
  'rgba(255, 0, 255, 0.5)',
  'rgba(0, 255, 255, 0.5)',
];
const RADIUS = 50;
const MAP_RADIUS = 20;
const LINE_SCALE = 1 / 800000000;
const d3 = { ...d3Core, ...d3Geo };
class GlobeView extends Component {
  constructor() {
    super();
    this.mousePanning = false;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }
  componentDidMount() {
    const { rotation } = this.props;
    window.console.log(rotation);
    const toLineString = (startLat, startLng, endLat, endLng) => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [startLng, startLat],
          [endLng, endLat],
        ],
      },
    });
    this.rootEl = d3.select(`#${styles.root}`);
    this.projection = d3
      .geoMercator()
      .rotate(rotation)
      .translate([0, 0])
      .scale(MAP_RADIUS);
    this.path = d3.geoPath().projection(this.projection);
    this.rootCountriesEl = this.rootEl.append('g');
    this.rootLinesEl = this.rootEl.append('g');
    d3.json(`${BASE_URL_UPLOAD}world-countries.json`, countries => {
      this.rootCountriesEl
        .selectAll(`.${styles.rootCountriesFeature}`)
        .data(countries.features)
        .enter()
        .append('path')
        .attr('class', styles.rootCountriesFeature)
        .attr('stroke-width', '0.5px')
        .attr('d', d => this.path(d));
      this.rootCountriesElSelection =
        this.rootCountriesEl
        .selectAll(`.${styles.rootCountriesFeature}`)
        .data(countries.features);
      d3.json(`${BASE_URL_UPLOAD}globe/trade.json`, trade => {
        d3.json(`${BASE_URL_UPLOAD}countries.json`, centers => {
          const data = trade.map(o => ({
            width: o.value * LINE_SCALE,
            startLat: centers[o.src].lat,
            startLng: centers[o.src].lng,
            endLat: centers[o.dst].lat,
            endLng: centers[o.dst].lng,
          }));
          const dataWithGeoJson = data.map(o => ({
            data: o,
            geoJson: toLineString(
              o.startLat,
              o.startLng,
              o.endLat,
              o.endLng
            ),
          }));
          this.rootLinesEl
            .selectAll(`.${styles.rootLinesFeature}`)
            .data(dataWithGeoJson)
            .enter()
            .append('path')
            .attr('class', styles.rootLinesFeature)
            .attr('stroke', 'rgba(255, 0, 0, 0.5)')
            .attr('stroke', (d, i) => STROKE_COLORS[i])
            .attr('style', d => `stroke-width: ${d.data.width}px;`)
            .attr('d', d => this.path(d.geoJson))
            .attr('stroke-dasharray', '100, 100')
            .attr('stroke-dashoffset', 100)
            .transition()
            .duration(2000)
            .attr('stroke-dashoffset', 0);
          this.rootLinesElSelection =
            this.rootLinesEl
            .selectAll(`.${styles.rootLinesFeature}`)
            .data(dataWithGeoJson);
          this.rootEl.node().addEventListener('mousedown', this.handleMouseDown);
          this.rootEl.node().addEventListener('mousemove', this.handleMouseMove);
          this.rootEl.node().addEventListener('mouseup', this.handleMouseUp);
          this.rootEl.node().addEventListener('touchstart', this.handleTouchStart);
          this.rootEl.node().addEventListener('touchmove', this.handleTouchMove);
          this.rootEl.node().addEventListener('touchend', this.handleTouchEnd);
        });
      });
    });
  }
  componentWillReceiveProps({ rotation, scale }) {
    this.d3Render(rotation, scale);
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    this.rootEl.node().removeEventListener('mousedown', this.handleMouseDown);
    this.rootEl.node().removeEventListener('mousemove', this.handleMouseMove);
    this.rootEl.node().removeEventListener('mouseup', this.hhandleTouchEnd);
  }
  d3Render(rotation, scale) {
    if (this.rootCountriesElSelection === undefined) return;
    this.projection.rotate(rotation);
    this.projection.scale(MAP_RADIUS * scale);
    window.requestAnimationFrame(() => {
      // this.rootGlobeEl.attr('r', this.projection.scale());
      this.rootCountriesElSelection
        .attr('stroke-width', `${scale * 0.5}px`)
        .attr('d', d => this.path(d));
      this.rootLinesElSelection
        .attr('stroke-dasharray', null)
        .attr('style', d => `stroke-width: ${scale * d.data.width}px;`)
        .attr('d', d => this.path(d.geoJson));
    });
  }
  handleMouseDown(e) {
    this.mousePanning = true;
    this.mouseLastX = e.pageX;
    this.mouseLastY = e.pageY;
  }
  handleMouseMove(e) {
    if (!this.mousePanning) return;
    const { rotation, setRotation } = this.props;
    const mouseX = e.pageX;
    const mouseY = e.pageY;
    setRotation([
      (rotation[0] + ((mouseX - this.mouseLastX) / 3)) % 360,
      0,
      0,
    ]);
    this.mouseLastX = mouseX;
    this.mouseLastY = mouseY;
  }
  handleMouseUp() {
    this.mousePanning = false;
  }
  handleTouchStart(e) {
    if (e.touches.length !== 1) return;
    this.touchOneLastX = e.touches[0].pageX;
    this.touchOneLastY = e.touches[0].pageY;
  }
  handleTouchMove(e) {
    const { rotation, setRotation } = this.props;
    const touchOneX = e.touches[0].pageX;
    const touchOneY = e.touches[0].pageY;
    setRotation([
      (rotation[0] + ((touchOneX - this.touchOneLastX) / 3)) % 360,
      0,
      0,
    ]);
    this.touchOneLastX = touchOneX;
    this.touchOneLastY = touchOneY;
  }
  handleTouchEnd() {
  }
  render() {
    return (
      <svg
        id={styles.root}
        viewBox={`-${RADIUS} -${RADIUS} ${RADIUS * 2} ${RADIUS * 2}`}
      />
    );
  }
}
GlobeView.propTypes = {
  rotation: PropTypes.array.isRequired,
  scale: PropTypes.number.isRequired,
  setRotation: PropTypes.func.isRequired,
};
export default GlobeView;
