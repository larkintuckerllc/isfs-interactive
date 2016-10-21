import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'tilesOpen';
// ACTIONS
export const SET_TILES_OPEN = `${ACTION_PREFIX}SET_TILES_OPEN`;
// ACTION CREATOR VALIDATORS
const validTilesOpen = value =>
  !(value === undefined || typeof value !== 'boolean');
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_TILES_OPEN:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getTilesOpen = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setTilesOpen = (value) => {
  if (!validTilesOpen(value)) throw new Error();
  return ({
    type: SET_TILES_OPEN,
    value,
  });
};
