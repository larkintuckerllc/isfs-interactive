import { ACTION_PREFIX, TILES } from '../config';
import * as fromParameters from '../util/parameters';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'tile';
// ACTIONS
export const SET_TILE = `${ACTION_PREFIX}SET_TILE`;
// ACTION CREATOR VALIDATORS
const validTile = value =>
  !(value === undefined || typeof value !== 'object');
// SCHEMA
// REDUCERS
export default (state = TILES.byId[fromParameters.getTile()], action) => {
  switch (action.type) {
    case SET_TILE:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getTile = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setTile = (value) => {
  if (!validTile(value)) throw new Error();
  return ({
    type: SET_TILE,
    value,
  });
};
