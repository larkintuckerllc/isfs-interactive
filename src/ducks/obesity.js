import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { ACTION_PREFIX } from '../config';
import { ServerException } from '../util/exceptions';
// API
import { getCollection } from '../api/obesity';

// REDUCER MOUNT POINT
const reducerMountPoint = 'obesity';
// ACTIONS
export const FETCH_OBESITY_REQUEST = `${ACTION_PREFIX}FETCH_OBESITY_REQUEST`;
export const FETCH_OBESITY_SUCCESS = `${ACTION_PREFIX}FETCH_OBESITY_SUCCESS`;
export const FETCH_OBESITY_ERROR = `${ACTION_PREFIX}FETCH_OBESITY_ERROR`;
export const RESET_FETCH_OBESITY_ERROR = `${ACTION_PREFIX}RESET_FETCH_OBESITY_ERROR`;
export const RESET_OBESITY = `${ACTION_PREFIX}RESET_OBESITY`;
// SCHEMA
const diseaseSchema = new Schema('obesity');
const obesitySchema = arrayOf(diseaseSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_OBESITY_SUCCESS: {
      return {
        ...action.response.entities.obesity,
      };
    }
    case RESET_OBESITY: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_OBESITY_SUCCESS:
      return action.response.result;
    case RESET_OBESITY:
      return [];
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_OBESITY_REQUEST:
      return true;
    case FETCH_OBESITY_SUCCESS:
    case FETCH_OBESITY_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_OBESITY_ERROR:
      return action.message;
    case FETCH_OBESITY_REQUEST:
    case FETCH_OBESITY_SUCCESS:
    case RESET_FETCH_OBESITY_ERROR:
      return null;
    default:
      return state;
  }
};
const lastAsync = (state = null, action) => {
  switch (action.type) {
    case FETCH_OBESITY_REQUEST:
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
export const getObesity = (state) =>
  state[reducerMountPoint].ids
  .map(id => getFishery(state, id));
export const getIsFetchingObesity = (state) =>
  getLastAsync(state) === 'fetch' && getIsAsync(state);
export const getFetchObesityErrorMessage = (state) => (
  getLastAsync(state) === 'fetch' ? state[reducerMountPoint].asyncErrorMessage : null);
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchObesity = () => (dispatch, getState) => {
  if (getIsAsync(getState())) throw new Error();
  dispatch({
    type: FETCH_OBESITY_REQUEST,
  });
  return getCollection()
    .then(
      response => dispatch({
        type: FETCH_OBESITY_SUCCESS,
        response: normalize(response, obesitySchema),
      }),
      error => {
        dispatch({
          type: FETCH_OBESITY_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchObesityError = () => ({
  type: RESET_FETCH_OBESITY_ERROR,
});
export const resetObesity = () => ({
  type: RESET_OBESITY,
});
