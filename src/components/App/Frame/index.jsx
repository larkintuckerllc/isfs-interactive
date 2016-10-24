import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { thr0w } from '../../../api/thr0w';
import { getChannel } from '../../../ducks/channel';
import * as fromModesOpen from '../../../ducks/modesOpen';
import { BASE_URL_APP, MODES } from '../../../config';
import { grid } from '../../../util/grid';
import { getMatrix, getDimensions, getModeId, getLeftBottom } from '../../../util/parameters';
import { getTile } from '../../../ducks/tile';
import styles from './index.scss';
import single from './img/single.png';
import quad from './img/quad.png';
import full from './img/full.png';
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
    const { location: { pathname }, tile } = this.props;
    switch (id) {
      case 'single':
        // TODO: NEED TO DEAL WITH CENTER AND ZOOM
        // TODO: FILL OUT WITH REST
        thr0w([16], {
          action: 'update',
          url: `${BASE_URL_APP}?mode=single&tile=${tile.id}#${pathname}`,
        });
        break;
      // TODO: COMPLETE
      case 'quad':
        break;
      case 'full':
        // TODO: FILL OUT WITH REST
        thr0w([16], {
          action: 'update',
          url: `${BASE_URL_APP}?mode=full&tile=${tile.id}#${pathname}`,
        });
        break;
      default:
    }
  }
  render() {
    const { children, modesOpen, setModesOpen } = this.props;
    const modeId = getModeId();
    return (
      <div>
        <Video />
        <div
          id={styles.rootMode}
          style={{ left: getLeftBottom() }}
          onClick={() => setModesOpen(!modesOpen)}
        >
          <img
            src={buttonIcons[modeId]}
            width="100" height="100" alt="test"
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
        {children}
      </div>
    );
  }
}
Frame.propTypes = {
  channel: PropTypes.number.isRequired,
  children: PropTypes.node,
  location: PropTypes.object.isRequired,
  modesOpen: PropTypes.bool.isRequired,
  setModesOpen: PropTypes.func.isRequired,
  tile: PropTypes.object.isRequired,
};
export default connect(
  state => ({
    channel: getChannel(state),
    modesOpen: fromModesOpen.getModesOpen(state),
    tile: getTile(state),
  }), {
    setModesOpen: fromModesOpen.setModesOpen,
  }
)(Frame);
