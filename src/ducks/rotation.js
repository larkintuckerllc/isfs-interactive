import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'rotation';
// ACTIONS
export const SET_ROTATION = `${ACTION_PREFIX}SET_ROTATION`;
// SCHEMA
// REDUCERS
export default (state = [0, 0, 0], action) => {
  switch (action.type) {
    case SET_ROTATION:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getRotation = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validRotation = value =>
  !(value === undefined || !Array.isArray(value));
// ACTION CREATORS
export const setRotation = (value) => {
  if (!validRotation(value)) throw new Error();
  return ({
    type: SET_ROTATION,
    value,
  });
};
