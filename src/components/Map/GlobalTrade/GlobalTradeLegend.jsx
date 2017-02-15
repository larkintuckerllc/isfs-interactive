import React, { PropTypes } from 'react';
import getColor from '../../../util/color';

const GlobalTradeLegend = ({ trade }) => {
  const customColors = {};
  for (let i = 0; i < trade.length; i += 1) {
    customColors[trade[i].src] = getColor(i);
  }
  window.console.log(customColors);
  return (
    <div>
      {trade.map(o => {
        const color = customColors[o.src];
        return (
          <div
            key={o.src}
            style={{
              display: 'inline-block',
              backgroundColor: `rgb(${color.r.toString()}, ${color.g.toString()}, ${color.b.toString()}`,
              padding: '5px',
              margin: '5px',
            }}
          >{o.src}</div>
        );
      })}
    </div>
  );
};
GlobalTradeLegend.propTypes = {
  trade: PropTypes.array.isRequired,
};
export default GlobalTradeLegend;
