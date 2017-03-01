import React, { PropTypes } from 'react';
import style from './index.scss';

const GlobalTradeTitle = ({ commodity, direction, target, value }) => (
  <div id={style.root}>
    {target}{' '}
    {commodity}{' '}
    {direction === 'import' ? 'Imports' : 'Exports'} (${Math.round(value / 1000000)} Mil)
  </div>
);
GlobalTradeTitle.propTypes = {
  commodity: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  direction: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};
export default GlobalTradeTitle;
