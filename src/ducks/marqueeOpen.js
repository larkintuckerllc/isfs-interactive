import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'marqueeOpen';
// ACTIONS
export const SET_MARQUEE_OPEN = `${ACTION_PREFIX}SET_MARQUEE_OPEN`;
// ACTION CREATOR VALIDATORS
const validMarqueeOpen = value =>
  !(value === undefined || typeof value !== 'boolean');
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_MARQUEE_OPEN:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getMarqueeOpen = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setMarqueeOpen = (value) => {
  if (!validMarqueeOpen(value)) throw new Error();
  return ({
    type: SET_MARQUEE_OPEN,
    value,
  });
};
