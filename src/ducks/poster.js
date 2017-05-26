import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'poster';
// ACTIONS
export const SET_POSTER = `${ACTION_PREFIX}SET_POSTER`;
// ACTION CREATOR VALIDATORS
const validPoster = value =>
  !(value === undefined || typeof value !== 'string');
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case SET_POSTER:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getPoster = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setPoster = (value) => {
  if (!validPoster(value)) throw new Error();
  return ({
    type: SET_POSTER,
    value,
  });
};
export const resetPoster = () => ({
  type: SET_POSTER,
  value: null,
});
