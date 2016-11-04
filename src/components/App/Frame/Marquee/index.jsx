import React, { Component } from 'react';
import styles from './index.scss';
import { getContentWidth } from '../../../../util/grid';
import { MARQUEE_TEXT, MARQUEE_INTERVAL, MARQUEE_RUN } from '../../../../config';

class Marquee extends Component {
  constructor() {
    super();
    this.startAnimation = this.startAnimation.bind(this);
    this.resetAnimation = this.resetAnimation.bind(this);
  }
  componentWillMount() {
    this.cancel = false;
    this.startX = getContentWidth();
  }
  componentDidMount() {
    this.rootEl = document.getElementById(styles.root);
    this.endX = -1 * this.rootEl.offsetWidth;
    this.interval = window.setInterval(this.startAnimation, MARQUEE_INTERVAL * 1000);
  }
  componentWillUnmount() {
    this.canel = true;
    window.clearInterval(this.interval);
  }
  startAnimation() {
    this.rootEl.style.transition = `transform ${MARQUEE_RUN}s linear`;
    this.rootEl.style.transform = `translateX(${this.endX}px)`;
    window.setTimeout(this.resetAnimation, MARQUEE_RUN * 1000);
  }
  resetAnimation() {
    if (this.cancel) return;
    this.rootEl.style.transition = 'transform 0s linear';
    this.rootEl.style.transform = `translateX(${this.startX}px)`;
  }
  render() {
    return (
      <div
        id={styles.root}
        style={{
          transform: `translateX(${this.startX}px)`,
        }}
      >{ MARQUEE_TEXT }</div>
    );
  }
}
export default Marquee;
