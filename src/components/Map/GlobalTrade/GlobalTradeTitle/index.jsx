import React, { PropTypes } from 'react';
import style from './index.scss';

const GlobalTradeTitle = ({ commodity, dst }) => (
  <div id={style.root}>{dst} {commodity} Imports</div>
);
GlobalTradeTitle.propTypes = {
  commodity: PropTypes.string.isRequired,
  dst: PropTypes.string.isRequired,
};
export default GlobalTradeTitle;
