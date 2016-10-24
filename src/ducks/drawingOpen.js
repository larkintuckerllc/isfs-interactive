import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'drawingOpen';
// ACTIONS
export const SET_DRAWING_OPEN = `${ACTION_PREFIX}SET_DRAWING_OPEN`;
// ACTION CREATOR VALIDATORS
const validDrawingOpen = value =>
  !(value === undefined || typeof value !== 'boolean');
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_DRAWING_OPEN:
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
    type: SET_DRAWING_OPEN,
    value,
  });
};
