import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'popup';
// ACTIONS
export const SET_POPUP = `${ACTION_PREFIX}SET_POPUP`;
// ACTION CREATOR VALIDATORS
const validPopup = value =>
  !(value === undefined || typeof value !== 'object');
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case SET_POPUP:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getPopup = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setPopup = (value) => {
  if (!validPopup(value)) throw new Error();
  return ({
    type: SET_POPUP,
    value,
  });
};
export const removePopup = () => ({
  type: SET_POPUP,
  value: null,
});
