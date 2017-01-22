import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'scale';
// ACTIONS
export const SET_SCALE = `${ACTION_PREFIX}SET_SCALE`;
// SCHEMA
// REDUCERS
export default (state = 1, action) => {
  switch (action.type) {
    case SET_SCALE:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getScale = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validScale = value =>
  !(value === undefined || typeof value !== 'number');
// ACTION CREATORS
export const setScale = (value) => {
  if (!validScale(value)) throw new Error();
  return ({
    type: SET_SCALE,
    value,
  });
};
