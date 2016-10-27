import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { ACTION_PREFIX } from '../config';
import { ServerException } from '../util/exceptions';
// API
import { getCollection } from '../api/fisheries';

// REDUCER MOUNT POINT
const reducerMountPoint = 'fisheries';
// ACTIONS
export const FETCH_FISHERIES_REQUEST = `${ACTION_PREFIX}FETCH_FISHERIES_REQUEST`;
export const FETCH_FISHERIES_SUCCESS = `${ACTION_PREFIX}FETCH_FISHERIES_SUCCESS`;
export const FETCH_FISHERIES_ERROR = `${ACTION_PREFIX}FETCH_FISHERIES_ERROR`;
export const RESET_FETCH_FISHERIES_ERROR = `${ACTION_PREFIX}RESET_FETCH_FISHERIES_ERROR`;
export const RESET_FISHERIES = `${ACTION_PREFIX}RESET_FISHERIES`;
// SCHEMA
const fisherySchema = new Schema('fisheries');
const fisheriesSchema = arrayOf(fisherySchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_FISHERIES_SUCCESS: {
      return {
        ...action.response.entities.fisheries,
      };
    }
    case RESET_FISHERIES: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_FISHERIES_SUCCESS:
      return action.response.result;
    case RESET_FISHERIES:
      return [];
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_FISHERIES_REQUEST:
      return true;
    case FETCH_FISHERIES_SUCCESS:
    case FETCH_FISHERIES_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_FISHERIES_ERROR:
      return action.message;
    case FETCH_FISHERIES_REQUEST:
    case FETCH_FISHERIES_SUCCESS:
    case RESET_FETCH_FISHERIES_ERROR:
      return null;
    default:
      return state;
  }
};
const lastAsync = (state = null, action) => {
  switch (action.type) {
    case FETCH_FISHERIES_REQUEST:
      return 'fetch';
    default:
      return state;
  }
};
export default combineReducers({
  byId,
  ids,
  isAsync,
  asyncErrorMessage,
  lastAsync,
});
// ACCESSORS
const getIsAsync = (state) => state[reducerMountPoint].isAsync;
const getLastAsync = (state) => state[reducerMountPoint].lastAsync;
export const getFishery = (state, id) => state[reducerMountPoint].byId[id];
export const getFisheries = (state) =>
  state[reducerMountPoint].ids
  .map(id => getFishery(state, id));
export const getIsFetchingFisheries = (state) =>
  getLastAsync(state) === 'fetch' && getIsAsync(state);
export const getFetchFisheriesErrorMessage = (state) => (
  getLastAsync(state) === 'fetch' ? state[reducerMountPoint].asyncErrorMessage : null);
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchFisheries = () => (dispatch, getState) => {
  if (getIsAsync(getState())) throw new Error();
  dispatch({
    type: FETCH_FISHERIES_REQUEST,
  });
  return getCollection()
    .then(
      response => dispatch({
        type: FETCH_FISHERIES_SUCCESS,
        response: normalize(response, fisheriesSchema),
      }),
      error => {
        dispatch({
          type: FETCH_FISHERIES_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchFisheriesError = () => ({
  type: RESET_FETCH_FISHERIES_ERROR,
});
export const resetFisheries = () => ({
  type: RESET_FISHERIES,
});
