import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getChannel } from '../../../ducks/channel';
import * as fromVideo from '../../../ducks/video';
import * as fromVideoCurrentTime from '../../../ducks/videoCurrentTime';
import { VIDEO_NETWORK_DELAY, VIDEO_MAX_DRIFT, VIDEO_RESTART_DELAY_SHIFT,
  VIDEO_INITIAL_RESTART_DELAY } from '../../../config';
import { getMasterChannel, getBlockingWidth } from '../../../util/parameters';
import styles from './index.scss';

class Video extends Component {
  constructor() {
    super();
    this.handleInterval = this.handleInterval.bind(this);
    this.handleEnded = this.handleEnded.bind(this);
    this.videoRestartDelay = VIDEO_INITIAL_RESTART_DELAY;
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
    const { video } = this.props;
    const nextVideo = nextProps.video;
    return (
      (video === null && nextVideo !== null) ||
        (video !== null && nextVideo === null)
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
    if (video.close) {
      this.rootBlockingVideoEl.addEventListener('ended', this.handleEnded);
    }
    if (channel !== getMasterChannel()) return;
    this.interval = window.setInterval(this.handleInterval, 1000);
  }
  handleInterval() {
    const { setVideoCurrentTime } = this.props;
    setVideoCurrentTime(this.rootBlockingVideoEl.currentTime);
  }
  handleEnded() {
    const { removeVideo } = this.props;
    this.rootBlockingVideoEl.removeEventListener('ended', this.handleEnded);
    removeVideo();
  }
  render() {
    const { removeVideo, video } = this.props;
    return (
      video !== null ? (
        <div
          id={styles.rootBlocking}
          onClick={removeVideo}
        >
          <video
            id={styles.rootBlockingVideo}
            style={{ width: `${getBlockingWidth()}%` }}
            onClick={(e) => { e.stopPropagation(); }}
            autoPlay
          >
            <source src={video.src} type="video/mp4" />
          </video>
        </div>
      ) : null
    );
  }
}
Video.propTypes = {
  channel: PropTypes.number.isRequired,
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
)(Video);
