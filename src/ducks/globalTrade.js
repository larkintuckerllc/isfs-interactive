import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { ACTION_PREFIX } from '../config';
import { ServerException } from '../util/exceptions';
// API
import { getCollection } from '../api/globalTrade';

// REDUCER MOUNT POINT
const reducerMountPoint = 'globalTrade';
// ACTIONS
export const FETCH_GLOBAL_TRADE_REQUEST = `${ACTION_PREFIX}FETCH_GLOBAL_TRADE_REQUEST`;
export const FETCH_GLOBAL_TRADE_SUCCESS = `${ACTION_PREFIX}FETCH_GLOBAL_TRADE_SUCCESS`;
export const FETCH_GLOBAL_TRADE_ERROR = `${ACTION_PREFIX}FETCH_GLOBAL_TRADE_ERROR`;
export const RESET_FETCH_GLOBAL_TRADE_ERROR = `${ACTION_PREFIX}RESET_FETCH_GLOBAL_TRADE_ERROR`;
export const RESET_GLOBAL_TRADE = `${ACTION_PREFIX}RESET_GLOBAL_TRADE`;
// SCHEMA
const elementSchema = new Schema('globalTrade');
const globalTradeSchema = arrayOf(elementSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_GLOBAL_TRADE_SUCCESS: {
      return {
        ...action.response.entities.globalTrade,
      };
    }
    case RESET_GLOBAL_TRADE: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_GLOBAL_TRADE_SUCCESS:
      return action.response.result;
    case RESET_GLOBAL_TRADE:
      return [];
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_GLOBAL_TRADE_REQUEST:
      return true;
    case FETCH_GLOBAL_TRADE_SUCCESS:
    case FETCH_GLOBAL_TRADE_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_GLOBAL_TRADE_ERROR:
      return action.message;
    case FETCH_GLOBAL_TRADE_REQUEST:
    case FETCH_GLOBAL_TRADE_SUCCESS:
    case RESET_FETCH_GLOBAL_TRADE_ERROR:
      return null;
    default:
      return state;
  }
};
const lastAsync = (state = null, action) => {
  switch (action.type) {
    case FETCH_GLOBAL_TRADE_REQUEST:
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
export const getGlobalTrade = (state) =>
  state[reducerMountPoint].ids
  .map(id => getFishery(state, id));
export const getIsFetchingGlobalTrade = (state) =>
  getLastAsync(state) === 'fetch' && getIsAsync(state);
export const getFetchGlobalTradeErrorMessage = (state) => (
  getLastAsync(state) === 'fetch' ? state[reducerMountPoint].asyncErrorMessage : null);
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchGlobalTrade = () => (dispatch, getState) => {
  if (getIsAsync(getState())) throw new Error();
  dispatch({
    type: FETCH_GLOBAL_TRADE_REQUEST,
  });
  return getCollection()
    .then(
      response => dispatch({
        type: FETCH_GLOBAL_TRADE_SUCCESS,
        response: normalize(response, globalTradeSchema),
      }),
      error => {
        dispatch({
          type: FETCH_GLOBAL_TRADE_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchGlobalTradeError = () => ({
  type: RESET_FETCH_GLOBAL_TRADE_ERROR,
});
export const resetGlobalTrade = () => ({
  type: RESET_GLOBAL_TRADE,
});
