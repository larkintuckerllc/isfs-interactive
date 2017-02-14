import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'globalTradeOpen';
// ACTIONS
export const SET_GLOBAL_TRADE_OPEN = `${ACTION_PREFIX}SET_GLOBAL_TRADE_OPEN`;
// ACTION CREATOR VALIDATORS
const validGlobalTradeOpen = value =>
  !(value === undefined || typeof value !== 'string');
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case SET_GLOBAL_TRADE_OPEN:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getGlobalTradeOpen = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setGlobalTradeOpen = (value) => {
  if (!validGlobalTradeOpen(value)) throw new Error();
  return ({
    type: SET_GLOBAL_TRADE_OPEN,
    value,
  });
};
export const resetGlobalTradeOpen = () => ({
  type: SET_GLOBAL_TRADE_OPEN,
  value: null,
});
