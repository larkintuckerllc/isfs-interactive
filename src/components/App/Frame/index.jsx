import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getChannel } from '../../../ducks/channel';
import * as fromVideo from '../../../ducks/video';
import { grid } from '../../../util/grid';
import { getMatrix, getDimensions, valid } from '../../../util/mode';
import styles from './index.scss';

class Frame extends Component {
  componentWillMount() {
    const { channel } = this.props;
    if (!valid(channel)) return;
    const frameEl = document.getElementById('frame');
    const frameContentEl = document.getElementById('frame__content');
    grid(channel, frameEl, frameContentEl, getMatrix(), getDimensions());
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
  video: PropTypes.string,
};
export default connect(
  state => ({
    channel: getChannel(state),
    video: fromVideo.getVideo(state),
  }), {
    removeVideo: fromVideo.removeVideo,
  }
)(Frame);
