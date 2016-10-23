import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { thr0w } from '../../../api/thr0w';
import { getChannel } from '../../../ducks/channel';
import * as fromVideo from '../../../ducks/video';
import * as fromVideoCurrentTime from '../../../ducks/videoCurrentTime';
import * as fromModesOpen from '../../../ducks/modesOpen';
import { BASE_URL_APP, MODES, VIDEO_NETWORK_DELAY, VIDEO_MAX_DRIFT, VIDEO_RESTART_DELAY_SHIFT,
  VIDEO_INITIAL_RESTART_DELAY } from '../../../config';
import { grid } from '../../../util/grid';
import { getMatrix, getDimensions, getModeId,
  getLeftBottom, getMasterChannel } from '../../../util/parameters';
import { getTile } from '../../../ducks/tile';
import styles from './index.scss';
import single from './img/single.png';
import quad from './img/quad.png';
import full from './img/full.png';

const buttonIcons = {
  single,
  quad,
  full,
};
class Frame extends Component {
  constructor() {
    super();
    this.handleInterval = this.handleInterval.bind(this);
    this.handleModeClick = this.handleModeClick.bind(this);
    this.videoRestartDelay = VIDEO_INITIAL_RESTART_DELAY;
  }
  componentWillMount() {
    const { channel } = this.props;
    const frameEl = document.getElementById('frame');
    const frameContentEl = document.getElementById('frame__content');
    grid(channel, frameEl, frameContentEl, getMatrix(), getDimensions());
  }
  componentWillReceiveProps({ videoCurrentTime }) {
    const { video, channel } = this.props;
    if (video === null) return;
    if (channel === getMasterChannel()) return;
    const drift = (this.rootBlockingVideoEl.currentTime - videoCurrentTime) +
      VIDEO_NETWORK_DELAY;
    if (Math.abs(drift) > VIDEO_MAX_DRIFT) {
      this.videoRestartDelay = drift > 0 ? this.videoRestartDelay - VIDEO_RESTART_DELAY_SHIFT :
        this.videoRestartDelay + VIDEO_RESTART_DELAY_SHIFT;
      this.rootBlockingVideoEl.currentTime = videoCurrentTime + this.videoRestartDelay;
    }
  }
  shouldComponentUpdate(nextProps) {
    const { channel, modesOpen, video } = this.props;
    const nextChannel = nextProps.channel;
    const nextVideo = nextProps.video;
    const nextModesOpen = nextProps.modesOpen;
    return (
      channel !== nextChannel ||
      video !== nextVideo ||
      nextModesOpen !== modesOpen
    );
  }
  componentWillUpdate(nextProps) {
    const { video } = this.props;
    const nextVideo = nextProps.video;
    if (video === null || nextVideo !== null) return;
    window.clearInterval(this.interval);
    this.rootBlockingVideoEl = null;
  }
  componentDidUpdate(prevProps) {
    const prevVideo = prevProps.video;
    const { channel, video } = this.props;
    if (prevVideo !== null || video === null) return;
    this.rootBlockingVideoEl = document.getElementById(styles.rootBlockingVideo);
    if (channel !== getMasterChannel()) return;
    this.interval = window.setInterval(this.handleInterval, 1000);
  }
  handleInterval() {
    const { setVideoCurrentTime } = this.props;
    setVideoCurrentTime(this.rootBlockingVideoEl.currentTime);
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
    const { children, modesOpen, removeVideo, setModesOpen, video } = this.props;
    const modeId = getModeId();
    return (
      <div>
        { video !== null && (
          <div
            id={styles.rootBlocking}
            onClick={removeVideo}
          >
            <video
              id={styles.rootBlockingVideo}
              onClick={(e) => { e.stopPropagation(); }}
              autoPlay
            >
              <source src={video} type="video/mp4" />
            </video>
          </div>
        )}
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
  removeVideo: PropTypes.func.isRequired,
  setModesOpen: PropTypes.func.isRequired,
  setVideoCurrentTime: PropTypes.func.isRequired,
  tile: PropTypes.object.isRequired,
  video: PropTypes.string,
  videoCurrentTime: PropTypes.number.isRequired,
};
export default connect(
  state => ({
    channel: getChannel(state),
    modesOpen: fromModesOpen.getModesOpen(state),
    tile: getTile(state),
    video: fromVideo.getVideo(state),
    videoCurrentTime: fromVideoCurrentTime.getVideoCurrentTime(state),
  }), {
    removeVideo: fromVideo.removeVideo,
    setModesOpen: fromModesOpen.setModesOpen,
    setVideoCurrentTime: fromVideoCurrentTime.setVideoCurrentTime,
  }
)(Frame);
