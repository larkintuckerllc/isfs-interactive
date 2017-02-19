import React, { Component, PropTypes } from 'react';
import * as d3Core from 'd3';
import * as d3Geo from 'd3-geo';
import {
  BASE_URL_UPLOAD,
  GLOBAL_TRADE_ANIMATION_DELAY,
  GLOBAL_TRADE_ANIMATION_DURATION,
} from '../../../../config';
import getColor from '../../../../util/color';
import styles from './index.scss';

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
    this.customColors = {};
  }
  componentDidMount() {
    const { countries, rotation, trade } = this.props;
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
    this.blockTimeout = window.setTimeout(() => {
      document.getElementById(styles.rootBlock).style.display = 'none';
    }, trade.length * GLOBAL_TRADE_ANIMATION_DELAY);
    for (let i = 0; i < trade.length; i += 1) {
      this.customColors[trade[i].src] = getColor(i);
    }
    this.rootEl = d3.select(`#${styles.rootSvg}`);
    this.projection = d3
      .geoEquirectangular()
      .rotate(rotation)
      .translate([0, 0])
      .scale(MAP_RADIUS);
    this.path = d3.geoPath().projection(this.projection);
    this.rootCountriesEl = this.rootEl.append('g');
    this.rootLinesEl = this.rootEl.append('g');
    d3.json(`${BASE_URL_UPLOAD}world-countries.json`, boundaries => {
      const data = trade.map(o => ({
        src: o.src,
        dst: o.dst,
        width: o.value * LINE_SCALE,
        startLat: countries[o.src].lat,
        startLng: countries[o.src].lng,
        endLat: countries[o.dst].lat,
        endLng: countries[o.dst].lng,
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
        .selectAll(`.${styles.rootSvgCountriesFeature}`)
        .data(boundaries.features)
        .enter()
        .append('path')
        .attr('class', styles.rootSvgCountriesFeature)
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
        .attr('fill', 'rgba(0, 0, 0)')
        .attr('d', d => this.path(d))
        .transition()
        .delay(d => {
          const index = dataWithGeoJson.findIndex(o => o.data.src === d.id);
          if (index === -1) {
            return 0;
          }
          return index * GLOBAL_TRADE_ANIMATION_DELAY;
        })
        .duration(0)
        .attr('fill', (d) => {
          if (dataWithGeoJson.find(o => o.data.src === d.id) === undefined) {
            return 'rgba(0, 0, 0)';
          }
          const color = this.customColors[d.id];
          return `rgb(${color.r.toString()}, ${color.g.toString()}, ${color.b.toString()}`;
        });
      this.rootCountriesElSelection =
        this.rootCountriesEl
        .selectAll(`.${styles.rootSvgCountriesFeature}`)
        .data(boundaries.features);
      this.rootLinesEl
        .selectAll(`.${styles.rootSvgLinesFeature}`)
        .data(dataWithGeoJson)
        .enter()
        .append('path')
        .attr('class', styles.rootSvgLinesFeature)
        .attr('stroke', (d) => {
          const color = this.customColors[d.data.src];
          // eslint-disable-next-line
          return `rgba(${color.r.toString()}, ${color.g.toString()}, ${color.b.toString()}, 0.7)`;
        })
        .attr('style', d => `stroke-width: ${d.data.width.toString()}px;`)
        .attr('d', d => this.path(d.geoJson))
        .attr('stroke-dasharray', '100, 100')
        .attr('stroke-dashoffset', 100)
        .transition()
        .delay((d, i) => i * GLOBAL_TRADE_ANIMATION_DELAY)
        .duration(GLOBAL_TRADE_ANIMATION_DURATION)
        .attr('stroke-dashoffset', 0);
      this.rootLinesElSelection =
        this.rootLinesEl
        .selectAll(`.${styles.rootSvgLinesFeature}`)
        .data(dataWithGeoJson);
      this.rootEl.node().addEventListener('mousedown', this.handleMouseDown);
      this.rootEl.node().addEventListener('mousemove', this.handleMouseMove);
      this.rootEl.node().addEventListener('mouseup', this.handleMouseUp);
      this.rootEl.node().addEventListener('touchstart', this.handleTouchStart);
      this.rootEl.node().addEventListener('touchmove', this.handleTouchMove);
      this.rootEl.node().addEventListener('touchend', this.handleTouchEnd);
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
    window.clearTimeout(this.blockTimeout);
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
      <div id={styles.root}>
        <div
          id={styles.rootBlock}
        />
        <svg
          id={styles.rootSvg}
          viewBox={`-${RADIUS_X} -${RADIUS_Y} ${RADIUS_X * 2} ${RADIUS_Y * 2}`}
        />
      </div>
    );
  }
}
GlobeView.propTypes = {
  countries: PropTypes.object.isRequired,
  rotation: PropTypes.array.isRequired,
  setRotation: PropTypes.func.isRequired,
  trade: PropTypes.array.isRequired,
};
export default GlobeView;
