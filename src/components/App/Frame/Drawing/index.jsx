import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getLeftBottom, getMenu } from '../../../../util/parameters';
import * as fromDrawingOpen from '../../../../ducks/drawingOpen';
import styles from './index.scss';
import drawing from './img/drawing.png';
import close from './img/close.png';

const COLORS = [
  'black', 'white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple',
];
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
                src={!drawingOpen ? drawing : close}
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
          style={{ left: getLeftBottom() + 100 }}
        >
          {COLORS.map(color => (
            <div
              className={styles.button}
            >
              <div className={styles.buttonColor}>
                <div
                  className={styles.buttonColorCircle}
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>
          ))}
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
