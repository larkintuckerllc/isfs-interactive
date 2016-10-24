import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getLeftBottom, getMenu } from '../../../../util/parameters';
import * as fromDrawingOpen from '../../../../ducks/drawingOpen';
import * as fromDrawingColor from '../../../../ducks/drawingColor';
import styles from './index.scss';
import drawing from './img/drawing.png';
import close from './img/close.png';

const COLORS = [
  'black', 'white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple',
];
// eslint-disable-next-line
class Drawing extends Component {
  componentWillUpdate(nextProps) {
    const { drawingOpen } = this.props;
    const nextDrawingOpen = nextProps.drawingOpen;
    if (!(drawingOpen && !nextDrawingOpen)) return;
    window.console.log('REMOVE LISTENERS');
  }
  componentDidUpdate(prevProps) {
    const { drawingOpen } = this.props;
    const prevDrawingOpen = prevProps.drawingOpen;
    if (!(!prevDrawingOpen && drawingOpen)) return;
    window.console.log('ATTACH LISTENERS');
  }
  render() {
    const { drawingColor, drawingOpen, setDrawingColor, setDrawingOpen } = this.props;
    return (
      <div>
        {drawingOpen && <canvas id={styles.rootCanvas} />}
        { getMenu() && (
          <div>
            <div
              id={styles.rootControl}
              style={{ left: getLeftBottom() }}
              onClick={() => {
                setDrawingOpen(!drawingOpen);
                setDrawingColor('black');
              }}
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
              key={color}
              className={styles.button}
              onClick={() => setDrawingColor(color)}
            >
              <div className={styles.buttonColor}>
                <div
                  className={styles.buttonColorCircle}
                  style={{ backgroundColor: color }}
                />
              </div>
              { color === drawingColor
                && (<div className={styles.buttonSelected} />)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
Drawing.propTypes = {
  drawingColor: PropTypes.string.isRequired,
  drawingOpen: PropTypes.bool.isRequired,
  setDrawingColor: PropTypes.func.isRequired,
  setDrawingOpen: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    drawingColor: fromDrawingColor.getDrawingColor(state),
    drawingOpen: fromDrawingOpen.getDrawingOpen(state),
  }), {
    setDrawingColor: fromDrawingColor.setDrawingColor,
    setDrawingOpen: fromDrawingOpen.setDrawingOpen,
  }
)(Drawing);
