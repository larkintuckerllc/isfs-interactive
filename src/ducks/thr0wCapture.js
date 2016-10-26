import { SET_CAPTURE_BLOCK_OPEN } from './captureBlockOpen';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'thr0wCapture';
// ACTIONS
export const THR0W_CAPTURE = 'THR0W_CAPTURE';
// ACTION CREATOR VALIDATORS
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case THR0W_CAPTURE:
      return action.dataUrl;
    default:
      return state;
  }
};
// ACCESSORS
export const getThr0wCapture = (state) => state[reducerMountPoint];
// ACTION CREATORS
export const removeThr0wCapture = () => (dispatch) => {
  dispatch({
    type: THR0W_CAPTURE,
    dataUrl: null,
  });
  dispatch({
    type: SET_CAPTURE_BLOCK_OPEN,
    value: false,
  });
};
