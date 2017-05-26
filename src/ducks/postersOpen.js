import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'postersOpen';
// ACTIONS
export const SET_POSTERS_OPEN = `${ACTION_PREFIX}SET_POSTERS_OPEN`;
// ACTION CREATOR VALIDATORS
const validPostersOpen = value =>
  !(value === undefined || typeof value !== 'boolean');
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_POSTERS_OPEN:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getPostersOpen = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setPostersOpen = (value) => {
  if (!validPostersOpen(value)) throw new Error();
  return ({
    type: SET_POSTERS_OPEN,
    value,
  });
};
