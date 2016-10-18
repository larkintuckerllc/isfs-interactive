import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'video';
// ACTIONS
export const SET_VIDEO = `${ACTION_PREFIX}SET_VIDEO`;
// ACTION CREATOR VALIDATORS
const validVideo = value =>
  !(value === undefined || typeof value !== 'string');
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case SET_VIDEO:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getVideo = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setVideo = (value) => {
  if (!validVideo(value)) throw new Error();
  return ({
    type: SET_VIDEO,
    value,
  });
};
export const removeVideo = () => ({
  type: SET_VIDEO,
  value: null,
});
