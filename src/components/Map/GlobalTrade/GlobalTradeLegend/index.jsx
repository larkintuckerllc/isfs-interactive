import React, { PropTypes } from 'react';
import getColor from '../../../../util/color';
import styles from './index.scss';

const GlobalTradeLegend = ({ countries, trade }) => {
  const customColors = {};
  for (let i = 0; i < trade.length; i += 1) {
    customColors[trade[i].src] = getColor(i);
  }
  return (
    <div id={styles.root}>
      {trade.map(o => {
        const color = customColors[o.src];
        return (
          <div
            key={o.src}
            className={styles.rootSource}
            style={{
              // eslint-disable-next-line
              backgroundColor: `rgb(${color.r.toString()}, ${color.g.toString()}, ${color.b.toString()}`,
            }}
          >{countries[o.src].name}</div>
        );
      })}
    </div>
  );
};
GlobalTradeLegend.propTypes = {
  countries: PropTypes.object.isRequired,
  trade: PropTypes.array.isRequired,
};
export default GlobalTradeLegend;
