import { getChannel as thr0wGetChannel } from '../api/thr0w';
import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'channel';
// ACTIONS
export const SET_CHANNEL = `${ACTION_PREFIX}SET_CHANNEL`;
// ACTION CREATOR VALIDATORS
const validChannel = value =>
  !(value === undefined || typeof value !== 'number');
// SCHEMA
// REDUCERS
export default (state = thr0wGetChannel(), action) => {
  switch (action.type) {
    case SET_CHANNEL:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getChannel = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setChannel = (value) => {
  if (!validChannel(value)) throw new Error();
  return ({
    type: SET_CHANNEL,
    value,
  });
};
export const removeChannel = () => ({
  type: SET_CHANNEL,
  value: null,
});
