import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'videosOpen';
// ACTIONS
export const SET_VIDEOS_OPEN = `${ACTION_PREFIX}SET_VIDEOS_OPEN`;
// ACTION CREATOR VALIDATORS
const validVideosOpen = value =>
  !(value === undefined || typeof value !== 'boolean');
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_VIDEOS_OPEN:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getVideosOpen = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setVideosOpen = (value) => {
  if (!validVideosOpen(value)) throw new Error();
  return ({
    type: SET_VIDEOS_OPEN,
    value,
  });
};
