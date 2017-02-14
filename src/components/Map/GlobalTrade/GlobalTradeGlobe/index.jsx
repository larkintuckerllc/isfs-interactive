import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromRotation from '../../../../ducks/rotation';
import GlobeView from './GlobeView';
import styles from './index.scss';

const GlobalTradeGlobe = ({ rotation, setRotation }) => (
  <div id={styles.root}>
    <GlobeView
      rotation={rotation}
      setRotation={setRotation}
    />
  </div>
);
GlobalTradeGlobe.propTypes = {
  rotation: PropTypes.array.isRequired,
  setRotation: PropTypes.func.isRequired,
};
export default connect(
  (state) => ({
    rotation: fromRotation.getRotation(state),
  }),
  {
    setRotation: fromRotation.setRotation,
  }
)(GlobalTradeGlobe);
