import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getChannel } from '../../../../ducks/channel';
import * as fromVideo from '../../../../ducks/video';
import * as fromVideoCurrentTime from '../../../../ducks/videoCurrentTime';
import { getDrawingOpen } from '../../../../ducks/drawingOpen';
import * as fromVideosOpen from '../../../../ducks/videosOpen';
import { VIDEO_NETWORK_DELAY, VIDEO_MAX_DRIFT, VIDEO_RESTART_DELAY_SHIFT,
  VIDEO_INITIAL_RESTART_DELAY, VIDEOS } from '../../../../config';
import { getMasterChannel, getMenu,
  getBlockingWidth, getLeftBottom } from '../../../../util/parameters';
import styles from './index.scss';
import library from './img/library.png';
import ifas from './img/ifas.png';
import salmon from './img/salmon.png';

const buttonIcons = {
  library,
  ifas,
  salmon,
};
class Video extends Component {
  constructor() {
    super();
    this.handleInterval = this.handleInterval.bind(this);
    this.handleEnded = this.handleEnded.bind(this);
    this.handleVideoClick = this.handleVideoClick.bind(this);
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
    const { video, videosOpen } = this.props;
    const nextVideo = nextProps.video;
    const nextVideosOpen = nextProps.videosOpen;
    return (
      (video === null && nextVideo !== null) ||
        (video !== null && nextVideo === null) ||
        (videosOpen !== nextVideosOpen)
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
  handleVideoClick(v) {
    const { setVideo, setVideosOpen } = this.props;
    setVideosOpen(false);
    setVideo({
      src: v.src,
      caption: v.caption,
      close: true,
    });
  }
  render() {
    const { drawingOpen, removeVideo, setVideosOpen, video, videosOpen } = this.props;
    return (
      <div>
        { getMenu() && !drawingOpen && (
          <div>
            <div
              id={styles.rootLibrary}
              style={{ left: getLeftBottom() }}
              onClick={() => setVideosOpen(!videosOpen)}
            >
              <img
                src={buttonIcons.library}
                width="100" height="100" alt="library"
              />
            </div>
            <div
              id={styles.rootVideos}
              className={[
                videosOpen ? '' : styles.rootVideosClosed,
                videosOpen ? styles.rootVideosOpen : '',
              ].join(' ')}
              style={{ left: getLeftBottom() + 100 }}
            >
              {VIDEOS.map(v => (
                <div
                  key={v.id}
                  onClick={() => this.handleVideoClick(v)}
                >
                  <img src={buttonIcons[v.id]} width="100" height="100" alt={v.id} />
                </div>
              ))}
            </div>
          </div>
        )}
        { video !== null ? (
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
              { video.caption !== null && (
                <track
                  src="{video.caption}"
                  label="English"
                  kind="captions"
                  srcLang="en-us"
                  default
                />
              )}
            </video>
          </div>
        ) : null }
      </div>
    );
  }
}
Video.propTypes = {
  channel: PropTypes.number.isRequired,
  drawingOpen: PropTypes.bool.isRequired,
  removeVideo: PropTypes.func.isRequired,
  setVideo: PropTypes.func.isRequired,
  setVideoCurrentTime: PropTypes.func.isRequired,
  setVideosOpen: PropTypes.func.isRequired,
  video: PropTypes.object,
  videoCurrentTime: PropTypes.number.isRequired,
  videosOpen: PropTypes.bool.isRequired,
};
export default connect(
  state => ({
    channel: getChannel(state),
    drawingOpen: getDrawingOpen(state),
    video: fromVideo.getVideo(state),
    videoCurrentTime: fromVideoCurrentTime.getVideoCurrentTime(state),
    videosOpen: fromVideosOpen.getVideosOpen(state),
  }), {
    removeVideo: fromVideo.removeVideo,
    setVideo: fromVideo.setVideo,
    setVideoCurrentTime: fromVideoCurrentTime.setVideoCurrentTime,
    setVideosOpen: fromVideosOpen.setVideosOpen,
  }
)(Video);
