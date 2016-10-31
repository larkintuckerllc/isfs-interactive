import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'waypoint';
// ACTIONS
export const SET_WAYPOINT = `${ACTION_PREFIX}SET_WAYPOINT`;
// ACTION CREATOR VALIDATORS
const validWaypoint = value =>
  !(value === undefined || typeof value !== 'number');
// SCHEMA
// REDUCERS
export default (state = 0, action) => {
  switch (action.type) {
    case SET_WAYPOINT:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getWaypoint = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setWaypoint = (value) => {
  if (!validWaypoint(value)) throw new Error();
  return ({
    type: SET_WAYPOINT,
    value,
  });
};
