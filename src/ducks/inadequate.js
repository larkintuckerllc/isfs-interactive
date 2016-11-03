import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { ACTION_PREFIX } from '../config';
import { ServerException } from '../util/exceptions';
// API
import { getCollection } from '../api/inadequate';

// REDUCER MOUNT POINT
const reducerMountPoint = 'inadequate';
// ACTIONS
export const FETCH_INADEQUATE_REQUEST = `${ACTION_PREFIX}FETCH_INADEQUATE_REQUEST`;
export const FETCH_INADEQUATE_SUCCESS = `${ACTION_PREFIX}FETCH_INADEQUATE_SUCCESS`;
export const FETCH_INADEQUATE_ERROR = `${ACTION_PREFIX}FETCH_INADEQUATE_ERROR`;
export const RESET_FETCH_INADEQUATE_ERROR = `${ACTION_PREFIX}RESET_FETCH_INADEQUATE_ERROR`;
export const RESET_INADEQUATE = `${ACTION_PREFIX}RESET_INADEQUATE`;
// SCHEMA
const elementSchema = new Schema('inadequate');
const inadequateSchema = arrayOf(elementSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_INADEQUATE_SUCCESS: {
      return {
        ...action.response.entities.inadequate,
      };
    }
    case RESET_INADEQUATE: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_INADEQUATE_SUCCESS:
      return action.response.result;
    case RESET_INADEQUATE:
      return [];
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_INADEQUATE_REQUEST:
      return true;
    case FETCH_INADEQUATE_SUCCESS:
    case FETCH_INADEQUATE_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_INADEQUATE_ERROR:
      return action.message;
    case FETCH_INADEQUATE_REQUEST:
    case FETCH_INADEQUATE_SUCCESS:
    case RESET_FETCH_INADEQUATE_ERROR:
      return null;
    default:
      return state;
  }
};
const lastAsync = (state = null, action) => {
  switch (action.type) {
    case FETCH_INADEQUATE_REQUEST:
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
export const getInadequate = (state) =>
  state[reducerMountPoint].ids
  .map(id => getFishery(state, id));
export const getIsFetchingInadequate = (state) =>
  getLastAsync(state) === 'fetch' && getIsAsync(state);
export const getFetchInadequateErrorMessage = (state) => (
  getLastAsync(state) === 'fetch' ? state[reducerMountPoint].asyncErrorMessage : null);
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchInadequate = () => (dispatch, getState) => {
  if (getIsAsync(getState())) throw new Error();
  dispatch({
    type: FETCH_INADEQUATE_REQUEST,
  });
  return getCollection()
    .then(
      response => dispatch({
        type: FETCH_INADEQUATE_SUCCESS,
        response: normalize(response, inadequateSchema),
      }),
      error => {
        dispatch({
          type: FETCH_INADEQUATE_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchInadequateError = () => ({
  type: RESET_FETCH_INADEQUATE_ERROR,
});
export const resetInadequate = () => ({
  type: RESET_INADEQUATE,
});
