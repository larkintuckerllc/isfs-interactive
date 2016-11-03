import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { ACTION_PREFIX } from '../config';
import { ServerException } from '../util/exceptions';
// API
import { getCollection } from '../api/overweight';

// REDUCER MOUNT POINT
const reducerMountPoint = 'overweight';
// ACTIONS
export const FETCH_OVERWEIGHT_REQUEST = `${ACTION_PREFIX}FETCH_OVERWEIGHT_REQUEST`;
export const FETCH_OVERWEIGHT_SUCCESS = `${ACTION_PREFIX}FETCH_OVERWEIGHT_SUCCESS`;
export const FETCH_OVERWEIGHT_ERROR = `${ACTION_PREFIX}FETCH_OVERWEIGHT_ERROR`;
export const RESET_FETCH_OVERWEIGHT_ERROR = `${ACTION_PREFIX}RESET_FETCH_OVERWEIGHT_ERROR`;
export const RESET_OVERWEIGHT = `${ACTION_PREFIX}RESET_OVERWEIGHT`;
// SCHEMA
const elementSchema = new Schema('overweight');
const overweightSchema = arrayOf(elementSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_OVERWEIGHT_SUCCESS: {
      return {
        ...action.response.entities.overweight,
      };
    }
    case RESET_OVERWEIGHT: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_OVERWEIGHT_SUCCESS:
      return action.response.result;
    case RESET_OVERWEIGHT:
      return [];
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_OVERWEIGHT_REQUEST:
      return true;
    case FETCH_OVERWEIGHT_SUCCESS:
    case FETCH_OVERWEIGHT_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_OVERWEIGHT_ERROR:
      return action.message;
    case FETCH_OVERWEIGHT_REQUEST:
    case FETCH_OVERWEIGHT_SUCCESS:
    case RESET_FETCH_OVERWEIGHT_ERROR:
      return null;
    default:
      return state;
  }
};
const lastAsync = (state = null, action) => {
  switch (action.type) {
    case FETCH_OVERWEIGHT_REQUEST:
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
export const getOverweight = (state) =>
  state[reducerMountPoint].ids
  .map(id => getFishery(state, id));
export const getIsFetchingOverweight = (state) =>
  getLastAsync(state) === 'fetch' && getIsAsync(state);
export const getFetchOverweightErrorMessage = (state) => (
  getLastAsync(state) === 'fetch' ? state[reducerMountPoint].asyncErrorMessage : null);
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchOverweight = () => (dispatch, getState) => {
  if (getIsAsync(getState())) throw new Error();
  dispatch({
    type: FETCH_OVERWEIGHT_REQUEST,
  });
  return getCollection()
    .then(
      response => dispatch({
        type: FETCH_OVERWEIGHT_SUCCESS,
        response: normalize(response, overweightSchema),
      }),
      error => {
        dispatch({
          type: FETCH_OVERWEIGHT_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchOverweightError = () => ({
  type: RESET_FETCH_OVERWEIGHT_ERROR,
});
export const resetOverweight = () => ({
  type: RESET_OVERWEIGHT,
});
