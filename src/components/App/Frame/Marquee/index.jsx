import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromMarqueeOpen from '../../../../ducks/marqueeOpen';
import { getChannel } from '../../../../ducks/channel';
import styles from './index.scss';
import { getContentWidth } from '../../../../util/grid';
import { getMasterChannel } from '../../../../util/parameters';
import { MARQEE_COMMODOTIES, MARQUEE_INTERVAL, MARQUEE_RUN } from '../../../../config';
import { getCommodities } from '../../../../api/commodities';

class Marquee extends Component {
  constructor() {
    super();
    this.startAnimation = this.startAnimation.bind(this);
    this.resetAnimation = this.resetAnimation.bind(this);
  }
  componentWillMount() {
    this.cancel = false;
    this.startX = getContentWidth();
    this.marqueeText = 'PLACEHOLDER';
  }
  componentDidMount() {
    const { channel, setMarqueeOpen } = this.props;
    this.rootEl = document.getElementById(styles.root);
    this.endX = -1 * this.rootEl.offsetWidth;
    getCommodities().then(commodities => {
      this.marqueeText = MARQEE_COMMODOTIES.map(o => (
`<div class="${styles.rootCommodity}"">
  <span>${o}</span>
  <span>${commodities[o].last.toString()}</span>
  <span
    class="${commodities[o].last >= 0
      ? styles.rootCommodityChangeIncrease : styles.rootCommodityChangeDecrease}"
  >${commodities[o].change.toString()}</span>
</div>`
)).join('\n');
      if (channel === getMasterChannel()) {
        this.interval = window.setInterval(() => setMarqueeOpen(true), MARQUEE_INTERVAL * 1000);
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    const nextMarqueeOpen = nextProps.marqueeOpen;
    const { marqueeOpen } = this.props;
    if (!marqueeOpen && nextMarqueeOpen) {
      this.startAnimation();
    }
    if (marqueeOpen && !nextMarqueeOpen) {
      this.resetAnimation();
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    this.cancel = true;
    if (this.interval !== undefined) window.clearInterval(this.interval);
  }
  startAnimation() {
    const { channel, setMarqueeOpen } = this.props;
    this.rootEl.innerHTML = this.marqueeText;
    this.rootEl.style.transition = `transform ${MARQUEE_RUN}s linear`;
    this.rootEl.style.transform = `translateX(${this.endX}px)`;
    if (channel === getMasterChannel()) {
      window.setTimeout(() => setMarqueeOpen(false), MARQUEE_RUN * 1000);
    }
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
      >{this.marqueeText}</div>
    );
  }
}
Marquee.propTypes = {
  channel: PropTypes.number.isRequired,
  marqueeOpen: PropTypes.bool.isRequired,
  setMarqueeOpen: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    channel: getChannel(state),
    marqueeOpen: fromMarqueeOpen.getMarqueeOpen(state),
  }), {
    setMarqueeOpen: fromMarqueeOpen.setMarqueeOpen,
  }
)(Marquee);
