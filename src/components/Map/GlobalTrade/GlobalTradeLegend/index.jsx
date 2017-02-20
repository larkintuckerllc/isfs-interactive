import React, { PropTypes, Component } from 'react';
import getColor from '../../../../util/color';
import { GLOBAL_TRADE_ANIMATION_DELAY } from '../../../../config';
import styles from './index.scss';

class GlobalTradeLegend extends Component {
  constructor(props) {
    super(props);
    const { trade } = props;
    this.customColors = {};
    for (let i = 0; i < trade.length; i += 1) {
      this.customColors[trade[i].src] = getColor(i);
    }
    this.state = {
      numberShown: 1,
    };
  }
  componentDidMount() {
    const { trade } = this.props;
    const tradeLength = trade.length;
    let numberShown = 1;
    this.numberShownInterval = window.setInterval(() => {
      if (numberShown === tradeLength - 1) {
        window.clearInterval(this.numberShownInterval);
      }
      numberShown += 1;
      this.setState({
        numberShown,
      });
    }, GLOBAL_TRADE_ANIMATION_DELAY);
  }
  componentWillUnmount() {
    window.clearInterval(this.numberShownInterval);
  }
  render() {
    const { countries, trade } = this.props;
    const { numberShown } = this.state;
    const tradeVisible = {};
    for (let i = 0; i < trade.length; i += 1) {
      if (i <= numberShown - 1) {
        tradeVisible[trade[i].src] = true;
      } else {
        tradeVisible[trade[i].src] = false;
      }
    }
    return (
      <div id={styles.root}>
        {trade.map(o => {
          const color = this.customColors[o.src];
          return (
            <div
              key={o.src}
              className={styles.rootSource}
              style={{
                visibility: tradeVisible[o.src] ? 'visible' : 'hidden',
                // eslint-disable-next-line
                backgroundColor: `rgb(${color.r.toString()}, ${color.g.toString()}, ${color.b.toString()}`,
              }}
            >{countries[o.src].name}</div>
          );
        })}
      </div>
    );
  }
}
GlobalTradeLegend.propTypes = {
  countries: PropTypes.object.isRequired,
  trade: PropTypes.array.isRequired,
};
export default GlobalTradeLegend;
