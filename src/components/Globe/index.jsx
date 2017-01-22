import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromRotation from '../../ducks/rotation';
import * as fromScale from '../../ducks/scale';
import GlobeView from './GlobeView';
import GlobeControls from './GlobeControls';
import styles from './index.scss';

const Globe = ({ rotation, scale, setRotation, setScale }) => (
  <div id={styles.root}>
    <GlobeView
      rotation={rotation}
      scale={scale}
      setRotation={setRotation}
    />
    <GlobeControls
      scale={scale}
      setScale={setScale}
    />
  </div>
);
Globe.propTypes = {
  rotation: PropTypes.array.isRequired,
  setRotation: PropTypes.func.isRequired,
  scale: PropTypes.number.isRequired,
  setScale: PropTypes.func.isRequired,
};
export default connect(
  (state) => ({
    rotation: fromRotation.getRotation(state),
    scale: fromScale.getScale(state),
  }),
  {
    setRotation: fromRotation.setRotation,
    setScale: fromScale.setScale,
  }
)(Globe);
