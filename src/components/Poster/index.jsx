import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { POSTERS } from '../../config';
import { getMenu, getLeftBottom } from '../../util/parameters';
import { getDrawingOpen } from '../../ducks/drawingOpen';
import * as fromPostersOpen from '../../ducks/postersOpen';
import styles from './index.scss';
import library from './img/library.png';
import fpi from './img/fpi.png';

const buttonIcons = {
  fpi,
};
const Poster = ({ drawingOpen, postersOpen, setPostersOpen }) => (
  <div>
    { getMenu() && !drawingOpen && (
      <div>
        <div
          id={styles.rootLibrary}
          onClick={() => setPostersOpen(!postersOpen)}
        >
          <img
            src={library}
            style={{ left: getLeftBottom() }}
            width="100"
            height="100"
            alt="library"
          />
        </div>
        <div
          id={styles.rootPosters}
          className={[
            postersOpen ? '' : styles.rootPostersClosed,
            postersOpen ? styles.rootPostersOpen : '',
          ].join(' ')}
          style={{ left: getLeftBottom() + 100 }}
        >
          {POSTERS.map(p => (
            <div
              key={p.id}
            >
              <img src={buttonIcons[p.id]} width="100" height="100" alt={p.id} />
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
Poster.propTypes = {
  drawingOpen: PropTypes.bool.isRequired,
  postersOpen: PropTypes.bool.isRequired,
  setPostersOpen: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    drawingOpen: getDrawingOpen(state),
    postersOpen: fromPostersOpen.getPostersOpen(state),
  }), {
    setPostersOpen: fromPostersOpen.setPostersOpen,
  }
)(Poster);
  /*
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
        */
