import React, { PropTypes } from 'react';
import style from './index.scss';

const GlobalTradeTitle = ({ commodity, direction, target }) => (
  <div id={style.root}>{target} {commodity} {direction === 'import' ? 'Imports' : 'Exports'}</div>
);
GlobalTradeTitle.propTypes = {
  commodity: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  direction: PropTypes.string.isRequired,
};
export default GlobalTradeTitle;
