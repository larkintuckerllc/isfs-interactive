import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'captureBlockOpen';
// ACTIONS
export const SET_CAPTURE_BLOCK_OPEN = `${ACTION_PREFIX}SET_CAPTURE_BLOCK_OPEN`;
// ACTION CREATOR VALIDATORS
const validCaptureBlockOpen = value =>
  !(value === undefined || typeof value !== 'boolean');
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_CAPTURE_BLOCK_OPEN:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getCaptureBlockOpen = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setCaptureBlockOpen = (value) => {
  if (!validCaptureBlockOpen(value)) throw new Error();
  return ({
    type: SET_CAPTURE_BLOCK_OPEN,
    value,
  });
};
