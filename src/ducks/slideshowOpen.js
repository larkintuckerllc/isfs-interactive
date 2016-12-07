import { ACTION_PREFIX } from '../config';
import { getSlidePage } from '../util/parameters';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'slideshowOpen';
// ACTIONS
export const SET_SLIDESHOW_OPEN = `${ACTION_PREFIX}SET_SLIDESHOW_OPEN`;
// ACTION CREATOR VALIDATORS
const validSlideshowOpen = value =>
  !(value === undefined || typeof value !== 'number');
// SCHEMA
// REDUCERS
export default (state = getSlidePage(), action) => {
  switch (action.type) {
    case SET_SLIDESHOW_OPEN:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getSlideshowOpen = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setSlideshowOpen = (value) => {
  if (!validSlideshowOpen(value)) throw new Error();
  return ({
    type: SET_SLIDESHOW_OPEN,
    value,
  });
};
