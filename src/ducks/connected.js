import { combineReducers } from 'redux';
import * as fromThr0w from '../api/thr0w';
import { getChannel } from './channel';
import { Thr0wException } from '../util/exceptions';
import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'connected';
// ACTIONS
export const SET_CONNECTED_REQUEST = `${ACTION_PREFIX}SET_CONNECTED_REQUEST`;
export const SET_CONNECTED_SUCCESS = `${ACTION_PREFIX}SET_CONNECTED_SUCCESS`;
export const SET_CONNECTED_ERROR = `${ACTION_PREFIX}SET_CONNECTED_ERROR`;
// ACTION CREATOR VALIDATORS
// SCHEMA
// REDUCERS
const value = (state = false, action) => {
  switch (action.type) {
    case SET_CONNECTED_SUCCESS:
      return action.value;
    default:
      return state;
  }
};
const isSetting = (state = false, action) => {
  switch (action.type) {
    case SET_CONNECTED_REQUEST:
      return true;
    case SET_CONNECTED_SUCCESS:
    case SET_CONNECTED_ERROR:
      return false;
    default:
      return state;
  }
};
const settingErrorMessage = (state = null, action) => {
  switch (action.type) {
    case SET_CONNECTED_ERROR:
      return action.message;
    case SET_CONNECTED_REQUEST:
    case SET_CONNECTED_SUCCESS:
      return null;
    default:
      return state;
  }
};
export default combineReducers({
  value,
  isSetting,
  settingErrorMessage,
});
// ACCESSORS
export const getConnected = (state) => state[reducerMountPoint].value;
// ACTION CREATORS
export const connect = () => (dispatch, getState) => {
  dispatch({
    type: SET_CONNECTED_REQUEST,
    value: true,
  });
  return fromThr0w.connect(getChannel(getState()), () => {})
    .then(() => {
      dispatch({
        type: SET_CONNECTED_SUCCESS,
        value: true,
      });
    },
    error => {
      dispatch({
        type: SET_CONNECTED_ERROR,
        message: error.message,
      });
      throw new Thr0wException(error.message);
    }
  );
};
export const disconnect = () => (dispatch) => {
  dispatch({
    type: SET_CONNECTED_REQUEST,
    value: false,
  });
  fromThr0w.disconnect();
  dispatch({
    type: SET_CONNECTED_SUCCESS,
    value: false,
  });
};
