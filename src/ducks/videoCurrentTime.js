import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'videoCurrentTime';
// ACTIONS
export const SET_VIDEO_CURRENT_TIME = `${ACTION_PREFIX}SET_VIDEO_CURRENT_TIME`;
// ACTION CREATOR VALIDATORS
const validVideoCurrentTime = value =>
  !(value === undefined || typeof value !== 'number');
// SCHEMA
// REDUCERS
export default (state = 0, action) => {
  switch (action.type) {
    case SET_VIDEO_CURRENT_TIME:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getVideoCurrentTime = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setVideoCurrentTime = (value) => {
  if (!validVideoCurrentTime(value)) throw new Error();
  return ({
    type: SET_VIDEO_CURRENT_TIME,
    value,
  });
};
