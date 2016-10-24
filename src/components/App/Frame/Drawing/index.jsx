import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getLeftBottom, getMenu } from '../../../../util/parameters';
import * as fromDrawingOpen from '../../../../ducks/drawingOpen';
import styles from './index.scss';
import drawing from './img/drawing.png';

// eslint-disable-next-line
class Drawing extends Component {
  render() {
    const { drawingOpen, setDrawingOpen } = this.props;
    return (
      <div>
        { getMenu() && (
          <div>
            <div
              id={styles.rootControl}
              style={{ left: getLeftBottom() }}
              onClick={() => setDrawingOpen(!drawingOpen)}
            >
              <img
                src={drawing}
                width="100" height="100" alt="drawing"
              />
            </div>
          </div>
        )}
        <div
          id={styles.rootControls}
          className={[
            drawingOpen ? '' : styles.rootControlsClosed,
            drawingOpen ? styles.rootControlsOpen : '',
          ].join(' ')}
          style={{ left: getLeftBottom() }}
        >
          <div
            className={styles.button}
            onClick={() => setDrawingOpen(false)}
          >
            <img src={drawing} width="100" height="100" alt="close" />
          </div>
        </div>
      </div>
    );
  }
}
Drawing.propTypes = {
  drawingOpen: PropTypes.bool.isRequired,
  setDrawingOpen: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    drawingOpen: fromDrawingOpen.getDrawingOpen(state),
  }), {
    setDrawingOpen: fromDrawingOpen.setDrawingOpen,
  }
)(Drawing);
