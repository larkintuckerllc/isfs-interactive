import { combineReducers } from 'redux';
import * as fromThr0w from '../api/thr0w';
import { Thr0wException } from '../util/exceptions';
import { ACTION_PREFIX } from '../config';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'authenticated';
// ACTIONS
export const SET_AUTHENTICATED_REQUEST = `${ACTION_PREFIX}SET_AUTHENTICATED_REQUEST`;
export const SET_AUTHENTICATED_SUCCESS = `${ACTION_PREFIX}SET_AUTHENTICATED_SUCCESS`;
export const SET_AUTHENTICATED_ERROR = `${ACTION_PREFIX}SET_AUTHENTICATED_ERROR`;
// ACTION CREATOR VALIDATORS
// SCHEMA
// REDUCERS
const value = (state = fromThr0w.authenticated(), action) => {
  switch (action.type) {
    case SET_AUTHENTICATED_SUCCESS:
      return action.value;
    default:
      return state;
  }
};
const isSetting = (state = false, action) => {
  switch (action.type) {
    case SET_AUTHENTICATED_REQUEST:
      return true;
    case SET_AUTHENTICATED_SUCCESS:
    case SET_AUTHENTICATED_ERROR:
      return false;
    default:
      return state;
  }
};
const settingErrorMessage = (state = null, action) => {
  switch (action.type) {
    case SET_AUTHENTICATED_ERROR:
      return action.message;
    case SET_AUTHENTICATED_REQUEST:
    case SET_AUTHENTICATED_SUCCESS:
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
export const getAuthenticated = (state) =>
  state[reducerMountPoint].value;
// ACTION CREATORS
export const login = (username, password) => (dispatch) => {
  dispatch({
    type: SET_AUTHENTICATED_REQUEST,
    value: true,
  });
  return fromThr0w.login(username, password)
    .then(() => {
      dispatch({
        type: SET_AUTHENTICATED_SUCCESS,
        value: true,
      });
    },
    error => {
      dispatch({
        type: SET_AUTHENTICATED_ERROR,
        message: error.message,
      });
      throw new Thr0wException(error.message);
    }
  );
};
export const logout = () => (dispatch) => {
  dispatch({
    type: SET_AUTHENTICATED_REQUEST,
    value: false,
  });
  fromThr0w.logout();
  dispatch({
    type: SET_AUTHENTICATED_SUCCESS,
    value: false,
  });
};
