import React, { PropTypes, Component } from 'react';
import pdfjsLib from 'pdfjs-dist';
import { connect } from 'react-redux';
import * as fromSlideshowOpen from '../../ducks/slideshowOpen';
import { getChannel } from '../../ducks/channel';
import { getContentWidth, getContentHeight } from '../../util/grid';
import { getMasterChannel } from '../../util/parameters';
import styles from './index.scss';
import sample from './img/sample.pdf';

class Slideshow extends Component {
  componentDidMount() {
    const { channel, setSlideshowOpen } = this.props;
    const canvasEl = document.getElementById(styles.rootCanvas);
    this.coverEl = document.getElementById(styles.rootCover);
    const contentWidth = getContentWidth();
    const contentHeight = getContentHeight();
    pdfjsLib.PDFJS.workerSrc = './pdf.worker.bundle.js';
    const loadingTask = pdfjsLib.getDocument(sample);
    loadingTask.promise.then(pdfDocument => {
      this.renderPage = pageNumber => {
        pdfDocument.getPage(pageNumber).then(pdfPage => {
          let viewport = pdfPage.getViewport(1);
          const pdfWidth = viewport.width;
          const pdfHeight = viewport.height;
          const scaleX = contentWidth / pdfWidth;
          const scaleY = contentHeight / pdfHeight;
          const scale = Math.min(scaleX, scaleY);
          canvasEl.width = pdfWidth * scale;
          canvasEl.height = pdfHeight * scale;
          viewport = pdfPage.getViewport(scale);
          const ctx = canvasEl.getContext('2d');
          pdfPage.render({
            canvasContext: ctx,
            viewport,
          });
        });
      };
      const numPages = pdfDocument.numPages;
      let currentPage = 1;
      this.renderPage(currentPage);
      if (channel === getMasterChannel()) {
        this.interval = window.setInterval(() => {
          currentPage = currentPage < numPages ? currentPage + 1 : 1;
          setSlideshowOpen(currentPage);
        }, 3000);
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    const nextSlideshowOpen = nextProps.slideshowOpen;
    const { slideshowOpen } = this.props;
    if (slideshowOpen !== nextSlideshowOpen) {
      this.coverEl.style.opacity = 0;
      this.renderPage(nextSlideshowOpen);
      window.setTimeout(() => {
        this.coverEl.style.opacity = 1;
      }, 2000);
    }
  }
  componentWillUnmount() {
    if (this.interval !== undefined) window.clearInterval(this.interval);
  }
  render() {
    return (
      <div id={styles.root}>
        <canvas id={styles.rootCanvas} />
        <div id={styles.rootCover} />
      </div>
    );
  }
}
Slideshow.propTypes = {
  channel: PropTypes.number.isRequired,
  slideshowOpen: PropTypes.number.isRequired,
  setSlideshowOpen: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    channel: getChannel(state),
    slideshowOpen: fromSlideshowOpen.getSlideshowOpen(state),
  }), {
    setSlideshowOpen: fromSlideshowOpen.setSlideshowOpen,
  }
)(Slideshow);
