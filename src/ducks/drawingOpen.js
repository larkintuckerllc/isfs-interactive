import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'drawingOpen';
// ACTIONS
export const SET_DRAWINGS_OPEN = `${ACTION_PREFIX}SET_DRAWINGS_OPEN`;
// ACTION CREATOR VALIDATORS
const validDrawingOpen = value =>
  !(value === undefined || typeof value !== 'boolean');
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_DRAWINGS_OPEN:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getDrawingOpen = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setDrawingOpen = (value) => {
  if (!validDrawingOpen(value)) throw new Error();
  return ({
    type: SET_DRAWINGS_OPEN,
    value,
  });
};
