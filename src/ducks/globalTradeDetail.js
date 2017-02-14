import { combineReducers } from 'redux';
import { normalize, Schema, arrayOf } from 'normalizr';
import { ACTION_PREFIX } from '../config';
import { ServerException } from '../util/exceptions';
// API
import { getCollection } from '../api/globalTradeDetail';

// REDUCER MOUNT POINT
const reducerMountPoint = 'globalTradeDetail';
// ACTIONS
export const FETCH_GLOBAL_TRADE_DETAIL_REQUEST
  = `${ACTION_PREFIX}FETCH_GLOBAL_TRADE_DETAIL_REQUEST`;
export const FETCH_GLOBAL_TRADE_DETAIL_SUCCESS
  = `${ACTION_PREFIX}FETCH_GLOBAL_TRADE_DETAIL_SUCCESS`;
export const FETCH_GLOBAL_TRADE_DETAIL_ERROR = `${ACTION_PREFIX}FETCH_GLOBAL_TRADE_DETAIL_ERROR`;
export const RESET_FETCH_GLOBAL_TRADE_DETAIL_ERROR
  = `${ACTION_PREFIX}RESET_FETCH_GLOBAL_TRADE_DETAIL_ERROR`;
export const RESET_GLOBAL_TRADE_DETAIL = `${ACTION_PREFIX}RESET_GLOBAL_TRADE_DETAIL`;
// SCHEMA
const elementSchema = new Schema('globalTradeDetail');
const globalTradeDetailSchema = arrayOf(elementSchema);
// REDUCERS
const byId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_GLOBAL_TRADE_DETAIL_SUCCESS: {
      return {
        ...action.response.entities.globalTradeDetail,
      };
    }
    case RESET_GLOBAL_TRADE_DETAIL: {
      return {};
    }
    default:
      return state;
  }
};
const ids = (state = [], action) => {
  switch (action.type) {
    case FETCH_GLOBAL_TRADE_DETAIL_SUCCESS:
      return action.response.result;
    case RESET_GLOBAL_TRADE_DETAIL:
      return [];
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_GLOBAL_TRADE_DETAIL_REQUEST:
      return true;
    case FETCH_GLOBAL_TRADE_DETAIL_SUCCESS:
    case FETCH_GLOBAL_TRADE_DETAIL_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_GLOBAL_TRADE_DETAIL_ERROR:
      return action.message;
    case FETCH_GLOBAL_TRADE_DETAIL_REQUEST:
    case FETCH_GLOBAL_TRADE_DETAIL_SUCCESS:
    case RESET_FETCH_GLOBAL_TRADE_DETAIL_ERROR:
      return null;
    default:
      return state;
  }
};
const lastAsync = (state = null, action) => {
  switch (action.type) {
    case FETCH_GLOBAL_TRADE_DETAIL_REQUEST:
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
export const getGlobalTradeDetail = (state) =>
  state[reducerMountPoint].ids
  .map(id => getFishery(state, id));
export const getIsFetchingGlobalTradeDetail = (state) =>
  getLastAsync(state) === 'fetch' && getIsAsync(state);
export const getFetchGlobalTradeDetailErrorMessage = (state) => (
  getLastAsync(state) === 'fetch' ? state[reducerMountPoint].asyncErrorMessage : null);
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchGlobalTradeDetail = () => (dispatch, getState) => {
  if (getIsAsync(getState())) throw new Error();
  dispatch({
    type: FETCH_GLOBAL_TRADE_DETAIL_REQUEST,
  });
  return getCollection()
    .then(
      response => dispatch({
        type: FETCH_GLOBAL_TRADE_DETAIL_SUCCESS,
        response: normalize(response, globalTradeDetailSchema),
      }),
      error => {
        dispatch({
          type: FETCH_GLOBAL_TRADE_DETAIL_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
export const resetFetchGlobalTradeDetailError = () => ({
  type: RESET_FETCH_GLOBAL_TRADE_DETAIL_ERROR,
});
export const resetGlobalTradeDetail = () => ({
  type: RESET_GLOBAL_TRADE_DETAIL,
});
