import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'drawingColor';
// ACTIONS
export const SET_DRAWING_COLOR = `${ACTION_PREFIX}SET_DRAWING_COLOR`;
// ACTION CREATOR VALIDATORS
const validDrawingColor = value =>
  !(value === undefined || typeof value !== 'string');
// SCHEMA
// REDUCERS
export default (state = 'black', action) => {
  switch (action.type) {
    case SET_DRAWING_COLOR:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getDrawingColor = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setDrawingColor = (value) => {
  if (!validDrawingColor(value)) throw new Error();
  return ({
    type: SET_DRAWING_COLOR,
    value,
  });
};
