import React, { PropTypes } from 'react';
import { getRightBottom } from '../../../util/parameters';
import styles from './index.scss';

const GlobeControls = ({ scale, setScale }) => (
  <div
    id={styles.root}
    style={{ right: getRightBottom() }}
  >
    <div
      onClick={() => setScale(
        scale < 3 ? scale + 0.25 : 3
      )}
    >
      <span className="glyphicon glyphicon-zoom-in" aria-hidden="true" />
    </div>
    <div
      onClick={() => setScale(
        scale > 1 ? scale - 0.25 : 1
      )}
    >
      <span className="glyphicon glyphicon-zoom-out" aria-hidden="true" />
    </div>
  </div>
);
GlobeControls.propTypes = {
  scale: PropTypes.number.isRequired,
  setScale: PropTypes.func.isRequired,
};
export default GlobeControls;
