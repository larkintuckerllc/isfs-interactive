import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'layersOpen';
// ACTIONS
export const SET_LAYERS_OPEN = `${ACTION_PREFIX}SET_LAYERS_OPEN`;
// ACTION CREATOR VALIDATORS
const validLayersOpen = value =>
  !(value === undefined || typeof value !== 'boolean');
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_LAYERS_OPEN:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getLayersOpen = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setLayersOpen = (value) => {
  if (!validLayersOpen(value)) throw new Error();
  return ({
    type: SET_LAYERS_OPEN,
    value,
  });
};
