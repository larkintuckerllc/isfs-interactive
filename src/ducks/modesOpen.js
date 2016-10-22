import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'modesOpen';
// ACTIONS
export const SET_MODES_OPEN = `${ACTION_PREFIX}SET_MODES_OPEN`;
// ACTION CREATOR VALIDATORS
const validModesOpen = value =>
  !(value === undefined || typeof value !== 'boolean');
// SCHEMA
// REDUCERS
export default (state = false, action) => {
  switch (action.type) {
    case SET_MODES_OPEN:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getModesOpen = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setModesOpen = (value) => {
  if (!validModesOpen(value)) throw new Error();
  return ({
    type: SET_MODES_OPEN,
    value,
  });
};
