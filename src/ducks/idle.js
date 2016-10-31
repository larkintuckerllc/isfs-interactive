import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'idle';
// ACTIONS
export const SET_IDLE = `${ACTION_PREFIX}SET_IDLE`;
// ACTION CREATOR VALIDATORS
const validIdle = value =>
  !(value === undefined || typeof value !== 'boolean');
// SCHEMA
// REDUCERS
export default (state = true, action) => {
  switch (action.type) {
    case SET_IDLE:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getIdle = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setIdle = (value) => {
  if (!validIdle(value)) throw new Error();
  return ({
    type: SET_IDLE,
    value,
  });
};
