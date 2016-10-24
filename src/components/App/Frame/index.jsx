import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { thr0w } from '../../../api/thr0w';
import { getChannel } from '../../../ducks/channel';
import * as fromModesOpen from '../../../ducks/modesOpen';
import { BASE_URL_APP, MODES } from '../../../config';
import { grid } from '../../../util/grid';
import { getMatrix, getDimensions, getModeId,
  getLeftBottom, getMenu } from '../../../util/parameters';
import { getTile } from '../../../ducks/tile';
import { getDrawingOpen } from '../../../ducks/drawingOpen';
import { getMapView } from '../../../ducks/mapView';
import styles from './index.scss';
import single from './img/single.png';
import quad from './img/quad.png';
import full from './img/full.png';
import Drawing from './Drawing';
import Video from './Video';

const buttonIcons = {
  single,
  quad,
  full,
};
class Frame extends Component {
  constructor() {
    super();
    this.handleModeClick = this.handleModeClick.bind(this);
  }
  componentWillMount() {
    const { channel } = this.props;
    const frameEl = document.getElementById('frame');
    const frameContentEl = document.getElementById('frame__content');
    grid(channel, frameEl, frameContentEl, getMatrix(), getDimensions());
  }
  handleModeClick(id) {
    const { location: { pathname }, tile, mapView } = this.props;
    switch (id) {
      case 'single':
        thr0w([10, 11, 12, 13, 14, 15], {
          action: 'update',
          url: `${BASE_URL_APP}?mode=top#/image`,
        });
        thr0w([16, 17, 18, 19], {
          action: 'update',
          url: [
            BASE_URL_APP,
            '?mode=single',
            `&lat=${mapView.center.lat}`,
            `&lng=${mapView.center.lng}`,
            `&zoom=${mapView.zoom}`,
            `&tile=${tile.id}`,
            `#${pathname}`,
          ].join(''),
        });
        break;
      case 'quad':
        thr0w([10, 11, 12, 13, 14, 15], {
          action: 'update',
          url: `${BASE_URL_APP}?mode=top#/image`,
        });
        thr0w([16, 17, 18, 19], {
          action: 'update',
          url: [
            BASE_URL_APP,
            '?mode=quad',
            `&lat=${mapView.center.lat}`,
            `&lng=${mapView.center.lng}`,
            `&zoom=${mapView.zoom}`,
            `&tile=${tile.id}`,
            `#${pathname}`,
          ].join(''),
        });
        break;
      case 'full':
        thr0w([10, 11, 12, 13, 14, 15, 16, 17, 18, 19], {
          action: 'update',
          url: [
            BASE_URL_APP,
            '?mode=full',
            `&lat=${mapView.center.lat}`,
            `&lng=${mapView.center.lng}`,
            `&zoom=${mapView.zoom}`,
            `&tile=${tile.id}`,
            `#${pathname}`,
          ].join(''),
        });
        break;
      default:
    }
  }
  render() {
    const { children, drawingOpen, modesOpen, setModesOpen } = this.props;
    const modeId = getModeId();
    return (
      <div>
        <Drawing />
        <Video />
        { getMenu() && !drawingOpen && (
          <div>
            <div
              id={styles.rootMode}
              style={{ left: getLeftBottom() }}
              onClick={() => setModesOpen(!modesOpen)}
            >
              <img
                src={buttonIcons[modeId]}
                width="100" height="100" alt={modeId}
              />
            </div>
            <div
              id={styles.rootModes}
              className={[
                modesOpen ? '' : styles.rootModesClosed,
                modesOpen ? styles.rootModesOpen : '',
              ].join(' ')}
              style={{ left: getLeftBottom() + 100 }}
            >
              {MODES.map(id => (
                <div
                  key={id}
                  className={styles.button}
                  onClick={() => this.handleModeClick(id)}
                >
                  <img src={buttonIcons[id]} width="100" height="100" alt={id} />
                  {modeId === id
                    && (<div className={styles.buttonSelected} />)} </div>
              ))}
            </div>
          </div>
        )}
        {children}
      </div>
    );
  }
}
Frame.propTypes = {
  channel: PropTypes.number.isRequired,
  children: PropTypes.node,
  drawingOpen: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  mapView: PropTypes.object.isRequired,
  modesOpen: PropTypes.bool.isRequired,
  setModesOpen: PropTypes.func.isRequired,
  tile: PropTypes.object.isRequired,
};
export default connect(
  state => ({
    channel: getChannel(state),
    drawingOpen: getDrawingOpen(state),
    modesOpen: fromModesOpen.getModesOpen(state),
    tile: getTile(state),
    mapView: getMapView(state),
  }), {
    setModesOpen: fromModesOpen.setModesOpen,
  }
)(Frame);
