import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getChannel } from '../../../ducks/channel';
import * as fromVideo from '../../../ducks/video';
import * as fromVideoCurrentTime from '../../../ducks/videoCurrentTime';
import { VIDEO_NETWORK_DELAY,
  VIDEO_INITIAL_RESTART_DELAY } from '../../../config';
import { grid } from '../../../util/grid';
import { getMatrix, getDimensions, getMasterChannel, valid } from '../../../util/mode';
import styles from './index.scss';

class Frame extends Component {
  constructor() {
    super();
    this.handleInterval = this.handleInterval.bind(this);
    this.videoRestartDelay = VIDEO_INITIAL_RESTART_DELAY;
  }
  componentWillMount() {
    const { channel } = this.props;
    if (!valid(channel)) return;
    const frameEl = document.getElementById('frame');
    const frameContentEl = document.getElementById('frame__content');
    grid(channel, frameEl, frameContentEl, getMatrix(), getDimensions());
  }
  componentWillReceiveProps({ videoCurrentTime }) {
    const { video, channel } = this.props;
    if (video === null) return;
    if (channel === getMasterChannel()) return;
    // TODO: THINK ABOUT CATCHING UP
    const drift = (this.rootBlockingVideoEl.currentTime - videoCurrentTime) +
      VIDEO_NETWORK_DELAY;
    window.console.log(drift);
  }
  shouldComponentUpdate(nextProps) {
    const { channel, video } = this.props;
    const nextChannel = nextProps.video;
    const nextVideo = nextProps.video;
    return (channel !== nextChannel || video !== nextVideo);
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
    if (channel !== getMasterChannel()) return;
    this.rootBlockingVideoEl = document.getElementById(styles.rootBlockingVideo);
    this.interval = window.setInterval(this.handleInterval, 1000);
  }
  handleInterval() {
    const { setVideoCurrentTime } = this.props;
    setVideoCurrentTime(this.rootBlockingVideoEl.currentTime);
  }
  render() {
    const { channel, children, removeVideo, video } = this.props;
    if (!valid(channel)) return null;
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
        {children}
      </div>
    );
  }
}
Frame.propTypes = {
  channel: PropTypes.number.isRequired,
  children: PropTypes.node,
  removeVideo: PropTypes.func.isRequired,
  setVideoCurrentTime: PropTypes.func.isRequired,
  video: PropTypes.string,
  videoCurrentTime: PropTypes.number.isRequired,
};
export default connect(
  state => ({
    channel: getChannel(state),
    video: fromVideo.getVideo(state),
    videoCurrentTime: fromVideoCurrentTime.getVideoCurrentTime(state),
  }), {
    removeVideo: fromVideo.removeVideo,
    setVideoCurrentTime: fromVideoCurrentTime.setVideoCurrentTime,
  }
)(Frame);
