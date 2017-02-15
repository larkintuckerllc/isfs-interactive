import React, { PropTypes } from 'react';

const GlobalTradeTitle = ({ commodity, dst }) => (
  <h2 style={{ color: 'white' }}>{dst} {commodity} imports</h2>
);
GlobalTradeTitle.propTypes = {
  commodity: PropTypes.string.isRequired,
  dst: PropTypes.string.isRequired,
};
export default GlobalTradeTitle;
