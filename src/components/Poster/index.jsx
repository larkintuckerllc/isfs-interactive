import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromReactRouterRedux from 'react-router-redux';
import { POSTERS } from '../../config';
import { getMenu, getLeftBottom, getSingle } from '../../util/parameters';
import { getDrawingOpen } from '../../ducks/drawingOpen';
import * as fromPostersOpen from '../../ducks/postersOpen';
import * as fromPoster from '../../ducks/poster';
import styles from './index.scss';
import library from './img/library.png';
import fpi from './img/fpi.png';
import map from './img/map.png';

const buttonIcons = {
  fpi,
};
const Poster = ({ drawingOpen, poster, postersOpen, push, setPoster, setPostersOpen }) => (
  <div>
    { getMenu() && !drawingOpen && (
      <div>
        <div
          id={styles.rootLibrary}
          onClick={() => setPostersOpen(!postersOpen)}
          style={{ left: getLeftBottom() }}
        >
          <img
            src={library}
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
              onClick={() => setPoster(p.url)}
            >
              <img src={buttonIcons[p.id]} width="100" height="100" alt={p.id} />
            </div>
          ))}
        </div>
        <div
          id={styles.rootMap}
          style={{ left: getLeftBottom() }}
          onClick={() => push('/map')}
        >
          <img src={map} width="100px" height="100px" alt="map" />
        </div>
      </div>
    )}
    { !getSingle() &&
      <div
        className={styles.rootMessage}
      >Posters in Single Mode Only</div>
    }
    { getSingle() && poster === null &&
      <div
        className={styles.rootMessage}
      >Select Poster</div>
    }
    { getSingle() && poster !== null &&
      <iframe
        id={styles.rootPoster}
        frameBorder="0"
        scrolling="no"
        src={poster}
      />
    }
    <div id={styles.rootCover} />
  </div>
);
Poster.propTypes = {
  drawingOpen: PropTypes.bool.isRequired,
  poster: PropTypes.string,
  postersOpen: PropTypes.bool.isRequired,
  push: PropTypes.func.isRequired,
  setPoster: PropTypes.func.isRequired,
  setPostersOpen: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    drawingOpen: getDrawingOpen(state),
    poster: fromPoster.getPoster(state),
    postersOpen: fromPostersOpen.getPostersOpen(state),
  }), {
    push: fromReactRouterRedux.push,
    setPoster: fromPoster.setPoster,
    setPostersOpen: fromPostersOpen.setPostersOpen,
  }
)(Poster);
