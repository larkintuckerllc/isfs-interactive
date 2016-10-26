import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { thr0w } from '../../../../api/thr0w';
import { getLeftBottom, getMasterChannel, getMenu } from '../../../../util/parameters';
import { frameXYToContentXY, getFrameWidth,
  getFrameHeight, getScale } from '../../../../util/grid';
import * as fromDrawingOpen from '../../../../ducks/drawingOpen';
import * as fromCaptureOpen from '../../../../ducks/captureOpen';
import * as fromDrawingColor from '../../../../ducks/drawingColor';
import { getThr0wCapture } from '../../../../ducks/thr0wCapture';
import { getChannel } from '../../../../ducks/channel';
import styles from './index.scss';
import drawing from './img/drawing.png';
import close from './img/close.png';
import camera from './img/camera.png';

const COLORS = [
  'black', 'white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple',
];
class Drawing extends Component {
  constructor() {
    super();
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.animation = this.animation.bind(this);
    this.handleCameraClick = this.handleCameraClick.bind(this);
  }
  componentDidMount() {
    this.scale = getScale();
    this.origin = frameXYToContentXY([0, 0]);
  }
  componentWillUpdate(nextProps) {
    const { drawingOpen } = this.props;
    const nextDrawingOpen = nextProps.drawingOpen;
    const nextDrawingColor = nextProps.drawingColor;
    if (drawingOpen) {
      this.context.strokeStyle = nextDrawingColor;
      this.context.fillStyle = nextDrawingColor;
    }
    if (!(drawingOpen && !nextDrawingOpen)) return;
    this.canvasEl.removeEventListener('touchstart', this.handleTouchStart);
    this.canvasEl.removeEventListener('touchmove', this.handleTouchMove);
    this.canvasEl.removeEventListener('touchend', this.handleTouchEnd);
    this.canvasEl.removeEventListener('touchcancel', this.handleTouchEnd);
    this.context = null;
    this.canvas = null;
  }
  componentDidUpdate(prevProps) {
    const { drawingColor, drawingOpen } = this.props;
    const prevDrawingOpen = prevProps.drawingOpen;
    if (!(!prevDrawingOpen && drawingOpen)) return;
    this.canvasEl = document.getElementById(styles.rootCanvas);
    this.canvasEl.style.width = `${getFrameWidth()}px`;
    this.canvasEl.style.height = `${getFrameHeight()}px`;
    this.canvasEl.style.left = `${this.origin[0]}px`;
    this.canvasEl.style.top = `${this.origin[1]}px`;
    this.canvasEl.width = getFrameWidth();
    this.canvasEl.height = getFrameHeight();
    this.context = this.canvasEl.getContext('2d');
    this.context.lineWidth = 16;
    this.context.strokeStyle = drawingColor;
    this.context.fillStyle = drawingColor;
    this.canvasEl.addEventListener('touchstart', this.handleTouchStart);
    this.canvasEl.addEventListener('touchmove', this.handleTouchMove);
    this.canvasEl.addEventListener('touchend', this.handleTouchEnd);
    this.canvasEl.addEventListener('touchcancel', this.handleTouchCancel);
  }
  handleTouchStart(e) {
    if (e.touches.length !== 1) return;
    this.lastX = e.touches[0].pageX * this.scale;
    this.lastY = e.touches[0].pageY * this.scale;
  }
  handleTouchMove(e) {
    const x = e.touches[0].pageX * this.scale;
    const y = e.touches[0].pageY * this.scale;
    const lastX = this.lastX;
    const lastY = this.lastY;
    if (x === lastX && y === lastY) return;
    window.requestAnimationFrame(() => this.animation(lastX, lastY, x, y));
    this.lastX = x;
    this.lastY = y;
  }
  handleTouchEnd() {
  }
  animation(startX, startY, endX, endY) {
    const context = this.context;
    context.beginPath();
    context.arc(startX, startY, 8, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
    context.closePath();
  }
  handleCameraClick() {
    const { channel, setCaptureOpen } = this.props;
    setCaptureOpen(true);
    thr0w([channel + 10], {
      action: 'capture',
      target: getMasterChannel(),
    });
  }
  render() {
    const { captureOpen, drawingColor,
      drawingOpen, setCaptureOpen,
      setDrawingColor, setDrawingOpen,
      thr0wCapture } = this.props;
    return (
      <div>
        {captureOpen && (
          <div
            id={styles.rootCapture}
            onClick={() => setCaptureOpen(false)}
          >
            <div
              id={styles.rootCaptureForm}
              onClick={(e) => { e.stopPropagation(); }}
              style={{
                backgroundImage: thr0wCapture !== null ?
                  `url(${thr0wCapture})` : null,
              }}
            />
          </div>
        )}
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
          <div
            className={styles.button}
            onClick={this.handleCameraClick}
          >
            <img
              src={camera}
              width="100" height="100" alt="camera"
            />
          </div>
        </div>
      </div>
    );
  }
}
Drawing.propTypes = {
  captureOpen: PropTypes.bool.isRequired,
  channel: PropTypes.number.isRequired,
  drawingColor: PropTypes.string.isRequired,
  drawingOpen: PropTypes.bool.isRequired,
  setCaptureOpen: PropTypes.func.isRequired,
  setDrawingColor: PropTypes.func.isRequired,
  setDrawingOpen: PropTypes.func.isRequired,
  thr0wCapture: PropTypes.string,
};
export default connect(
  state => ({
    captureOpen: fromCaptureOpen.getCaptureOpen(state),
    channel: getChannel(state),
    drawingColor: fromDrawingColor.getDrawingColor(state),
    drawingOpen: fromDrawingOpen.getDrawingOpen(state),
    thr0wCapture: getThr0wCapture(state),
  }), {
    setCaptureOpen: fromCaptureOpen.setCaptureOpen,
    setDrawingColor: fromDrawingColor.setDrawingColor,
    setDrawingOpen: fromDrawingOpen.setDrawingOpen,
  }
)(Drawing);
