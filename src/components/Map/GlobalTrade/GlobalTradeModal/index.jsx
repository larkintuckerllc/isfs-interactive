import React, { PropTypes } from 'react';
import { getBlockingWidth } from '../../../../util/parameters';
import styles from './index.scss';

const GlobalTradeModal = ({ children, resetGlobalTradeOpen }) => (
  <div
    id={styles.root}
    onClick={() => resetGlobalTradeOpen()}
  >
    <div
      id={styles.rootContent}
      style={{
        width: `${getBlockingWidth()}%`,
      }}
      onClick={(e) => { e.stopPropagation(); }}
    >
      { children }
    </div>
  </div>
);
GlobalTradeModal.propTypes = {
  children: PropTypes.node,
  resetGlobalTradeOpen: PropTypes.func.isRequired,
};
export default GlobalTradeModal;
