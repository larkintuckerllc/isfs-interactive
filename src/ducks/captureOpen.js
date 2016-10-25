import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'captureOpen';
// ACTIONS
export const SET_CAPTURE_OPEN = `${ACTION_PREFIX}SET_CAPTURE_OPEN`;
// ACTION CREATOR VALIDATORS
const validCaptureOpen = value =>
  !(value === undefined || typeof value !== 'boolean');
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_CAPTURE_OPEN:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getCaptureOpen = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setCaptureOpen = (value) => {
  if (!validCaptureOpen(value)) throw new Error();
  return ({
    type: SET_CAPTURE_OPEN,
    value,
  });
};
