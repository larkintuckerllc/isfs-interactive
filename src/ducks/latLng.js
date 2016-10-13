import { ACTION_PREFIX, WAYPOINTS } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'latLng';
// ACTIONS
export const SET_LAT_LNG = `${ACTION_PREFIX}SET_LAT_LNG`;
// ACTION CREATOR VALIDATORS
const validLatLng = value =>
  !(value === undefined || typeof value !== 'object');
// SCHEMA
// REDUCERS
export default (state = WAYPOINTS[0], action) => {
  switch (action.type) {
    case SET_LAT_LNG:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getLatLng = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setLatLng = (value) => {
  if (!validLatLng(value)) throw new Error();
  return ({
    type: SET_LAT_LNG,
    value,
  });
};
