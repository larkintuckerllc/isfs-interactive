import { ACTION_PREFIX, CENTER } from '../config';
import { getZoomMin } from '../util/parameters';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'mapView';
// ACTIONS
export const SET_MAP_VIEW = `${ACTION_PREFIX}SET_MAP_VIEW`;
// ACTION CREATOR VALIDATORS
const validMapView = value =>
  !(value === undefined || typeof value !== 'object');
// SCHEMA
// REDUCERS
export default (state = {
  center: CENTER,
  zoom: getZoomMin(),
}, action) => {
  switch (action.type) {
    case SET_MAP_VIEW:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS
export const getMapView = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const setMapView = (value) => {
  if (!validMapView(value)) throw new Error();
  return ({
    type: SET_MAP_VIEW,
    value,
  });
};
