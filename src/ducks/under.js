import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { ACTION_PREFIX } from '../config';
import { ServerException } from '../util/exceptions';
// API
import { getCollection } from '../api/under';

// REDUCER MOUNT POINT
const reducerMountPoint = 'under';
// ACTIONS
export const FETCH_UNDER_REQUEST = `${ACTION_PREFIX}FETCH_UNDER_REQUEST`;
export const FETCH_UNDER_SUCCESS = `${ACTION_PREFIX}FETCH_UNDER_SUCCESS`;
export const FETCH_UNDER_ERROR = `${ACTION_PREFIX}FETCH_UNDER_ERROR`;
export const RESET_FETCH_UNDER_ERROR = `${ACTION_PREFIX}RESET_FETCH_UNDER_ERROR`;
export const RESET_UNDER = `${ACTION_PREFIX}RESET_UNDER`;
// SCHEMA
const elementSchema = new Schema('under');
const underSchema = arrayOf(elementSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_UNDER_SUCCESS: {
      return {
        ...action.response.entities.under,
      };
    }
    case RESET_UNDER: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_UNDER_SUCCESS:
      return action.response.result;
    case RESET_UNDER:
      return [];
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_UNDER_REQUEST:
      return true;
    case FETCH_UNDER_SUCCESS:
    case FETCH_UNDER_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_UNDER_ERROR:
      return action.message;
    case FETCH_UNDER_REQUEST:
    case FETCH_UNDER_SUCCESS:
    case RESET_FETCH_UNDER_ERROR:
      return null;
    default:
      return state;
  }
};
const lastAsync = (state = null, action) => {
  switch (action.type) {
    case FETCH_UNDER_REQUEST:
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
export const getUnder = (state) =>
  state[reducerMountPoint].ids
  .map(id => getFishery(state, id));
export const getIsFetchingUnder = (state) =>
  getLastAsync(state) === 'fetch' && getIsAsync(state);
export const getFetchUnderErrorMessage = (state) => (
  getLastAsync(state) === 'fetch' ? state[reducerMountPoint].asyncErrorMessage : null);
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchUnder = () => (dispatch, getState) => {
  if (getIsAsync(getState())) throw new Error();
  dispatch({
    type: FETCH_UNDER_REQUEST,
  });
  return getCollection()
    .then(
      response => dispatch({
        type: FETCH_UNDER_SUCCESS,
        response: normalize(response, underSchema),
      }),
      error => {
        dispatch({
          type: FETCH_UNDER_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchUnderError = () => ({
  type: RESET_FETCH_UNDER_ERROR,
});
export const resetUnder = () => ({
  type: RESET_UNDER,
});
