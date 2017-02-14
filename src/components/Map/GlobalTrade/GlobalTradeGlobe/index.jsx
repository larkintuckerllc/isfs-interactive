import React, { Component, PropTypes } from 'react';
import * as d3Core from 'd3';
import * as d3Geo from 'd3-geo';
import { BASE_URL_UPLOAD } from '../../../../config';
import styles from './index.scss';

const pastelColors = () => {
  const r = (Math.round(Math.random() * 127) + 127);
  const g = (Math.round(Math.random() * 127) + 127);
  const b = (Math.round(Math.random() * 127) + 127);
  return { r, g, b };
};
const customColors = {};
const RADIUS_X = 50;
const RADIUS_Y = 30;
const MAP_RADIUS = 15.94;
const LINE_SCALE = 1 / 1200000000;
const COUNTRY_STROKE_WIDTH = 0.2;
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
    const { rotation, trade } = this.props;
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
      .geoEquirectangular()
      .rotate(rotation)
      .translate([0, 0])
      .scale(MAP_RADIUS);
    this.path = d3.geoPath().projection(this.projection);
    this.rootCountriesEl = this.rootEl.append('g');
    this.rootLinesEl = this.rootEl.append('g');
    d3.json(`${BASE_URL_UPLOAD}countries.json`, centers => {
      d3.json(`${BASE_URL_UPLOAD}world-countries.json`, countries => {
        const data = trade.map(o => ({
          src: o.src,
          dst: o.dst,
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
        this.rootCountriesEl
          .selectAll(`.${styles.rootCountriesFeature}`)
          .data(countries.features)
          .enter()
          .append('path')
          .attr('class', styles.rootCountriesFeature)
          .attr('stroke', d => {
            if (dataWithGeoJson.find(o => o.data.src === d.id) !== undefined) {
              return 'rgb(0, 0, 0)';
            }
            if (dataWithGeoJson.find(o => o.data.dst === d.id) !== undefined) {
              return 'rgb(255, 255, 255)';
            }
            return 'rgb(32, 32, 32)';
          })
          .attr('stroke-width', `${COUNTRY_STROKE_WIDTH.toString()}px`)
          .attr('fill', (d) => {
            if (dataWithGeoJson.find(o => o.data.src === d.id) === undefined) {
              return 'rgba(0, 0, 0, 0)';
            }
            const color = pastelColors();
            customColors[d.id] = color;
            return `rgb(${color.r.toString()}, ${color.g.toString()}, ${color.b.toString()}`;
          })
          .attr('d', d => this.path(d));
        this.rootCountriesElSelection =
          this.rootCountriesEl
          .selectAll(`.${styles.rootCountriesFeature}`)
          .data(countries.features);
        this.rootLinesEl
          .selectAll(`.${styles.rootLinesFeature}`)
          .data(dataWithGeoJson)
          .enter()
          .append('path')
          .attr('class', styles.rootLinesFeature)
          .attr('stroke', (d) => {
            const color = customColors[d.data.src];
            // eslint-disable-next-line
            return `rgba(${color.r.toString()}, ${color.g.toString()}, ${color.b.toString()}, 0.7)`;
          })
          .attr('style', d => `stroke-width: ${d.data.width.toString()}px;`)
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
  }
  componentWillReceiveProps({ rotation }) {
    this.d3Render(rotation);
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    this.rootEl.node().removeEventListener('mousedown', this.handleMouseDown);
    this.rootEl.node().removeEventListener('mousemove', this.handleMouseMove);
    this.rootEl.node().removeEventListener('mouseup', this.hhandleTouchEnd);
  }
  d3Render(rotation) {
    if (this.rootCountriesElSelection === undefined) return;
    this.projection.rotate(rotation);
    window.requestAnimationFrame(() => {
      this.rootCountriesElSelection
        .attr('d', d => this.path(d));
      this.rootLinesElSelection
        .attr('stroke-dasharray', null)
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
        viewBox={`-${RADIUS_X} -${RADIUS_Y} ${RADIUS_X * 2} ${RADIUS_Y * 2}`}
      />
    );
  }
}
GlobeView.propTypes = {
  rotation: PropTypes.array.isRequired,
  setRotation: PropTypes.func.isRequired,
  trade: PropTypes.array.isRequired,
};
export default GlobeView;
