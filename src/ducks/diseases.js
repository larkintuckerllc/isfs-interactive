import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { ACTION_PREFIX } from '../config';
import { ServerException } from '../util/exceptions';
// API
import { getCollection } from '../api/diseases';

// REDUCER MOUNT POINT
const reducerMountPoint = 'diseases';
// ACTIONS
export const FETCH_DISEASES_REQUEST = `${ACTION_PREFIX}FETCH_DISEASES_REQUEST`;
export const FETCH_DISEASES_SUCCESS = `${ACTION_PREFIX}FETCH_DISEASES_SUCCESS`;
export const FETCH_DISEASES_ERROR = `${ACTION_PREFIX}FETCH_DISEASES_ERROR`;
export const RESET_FETCH_DISEASES_ERROR = `${ACTION_PREFIX}RESET_FETCH_DISEASES_ERROR`;
export const RESET_DISEASES = `${ACTION_PREFIX}RESET_DISEASES`;
// SCHEMA
const diseaseSchema = new Schema('diseases');
const diseasesSchema = arrayOf(diseaseSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_DISEASES_SUCCESS: {
      return {
        ...action.response.entities.diseases,
      };
    }
    case RESET_DISEASES: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_DISEASES_SUCCESS:
      return action.response.result;
    case RESET_DISEASES:
      return [];
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_DISEASES_REQUEST:
      return true;
    case FETCH_DISEASES_SUCCESS:
    case FETCH_DISEASES_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_DISEASES_ERROR:
      return action.message;
    case FETCH_DISEASES_REQUEST:
    case FETCH_DISEASES_SUCCESS:
    case RESET_FETCH_DISEASES_ERROR:
      return null;
    default:
      return state;
  }
};
const lastAsync = (state = null, action) => {
  switch (action.type) {
    case FETCH_DISEASES_REQUEST:
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
export const getDiseases = (state) =>
  state[reducerMountPoint].ids
  .map(id => getFishery(state, id));
export const getIsFetchingDiseases = (state) =>
  getLastAsync(state) === 'fetch' && getIsAsync(state);
export const getFetchDiseasesErrorMessage = (state) => (
  getLastAsync(state) === 'fetch' ? state[reducerMountPoint].asyncErrorMessage : null);
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchDiseases = () => (dispatch, getState) => {
  if (getIsAsync(getState())) throw new Error();
  dispatch({
    type: FETCH_DISEASES_REQUEST,
  });
  return getCollection()
    .then(
      response => dispatch({
        type: FETCH_DISEASES_SUCCESS,
        response: normalize(response, diseasesSchema),
      }),
      error => {
        dispatch({
          type: FETCH_DISEASES_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchDiseasesError = () => ({
  type: RESET_FETCH_DISEASES_ERROR,
});
export const resetDiseases = () => ({
  type: RESET_DISEASES,
});
