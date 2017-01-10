import { SET_CAPTURE_BLOCK_OPEN } from './captureBlockOpen';
import * as fromEmail from '../api/email';

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
    case THR0W_CAPTURE: {
      const newState = {
        left: state !== null ? state.left : null,
        leftMiddle: state !== null ? state.leftMiddle : null,
        rightMiddle: state !== null ? state.rightMiddle : null,
        right: state !== null ? state.right : null,
      };
      if (action.source === 16) {
        newState.left = action.dataUrl;
      }
      if (action.source === 17) {
        newState.leftMiddle = action.dataUrl;
      }
      if (action.source === 18) {
        newState.rightMiddle = action.dataUrl;
      }
      if (action.source === 19) {
        newState.right = action.dataUrl;
      }
      return newState;
    }
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
export const emailThr0wCapture = (email) => (dispatch, getState) => {
  // TODO: GET EMAIL ADDRESS FROM FORM
  const thr0wCapture = getThr0wCapture(getState());
  const buildAttachment = (name, dataUrl) => ({
    type: 'image/jpeg',
    name,
    content: dataUrl.substring(23),
  });
  const message = {
    html: '<p>Attached are the screen captures.</p>',
    text: 'Attached are the screen captures.',
    subject: 'Screen Captures - ISFS Wall Whiteboard',
    to: [{
      email,
      name: 'ISFS Wall User',
      type: 'to',
    }],
    attachments: [],
  };
  if (thr0wCapture.left !== null) {
    message.attachments.push(buildAttachment('left.jpg', thr0wCapture.left));
  }
  if (thr0wCapture.leftMiddle !== null) {
    message.attachments.push(buildAttachment('left_middle.jpg', thr0wCapture.leftMiddle));
  }
  if (thr0wCapture.rightMiddle !== null) {
    message.attachments.push(buildAttachment('right_middle.jpg', thr0wCapture.rightMiddle));
  }
  if (thr0wCapture.right !== null) {
    message.attachments.push(buildAttachment('left_middle.jpg', thr0wCapture.right));
  }
  fromEmail.post(message);
};
