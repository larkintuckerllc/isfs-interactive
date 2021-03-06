import { getChannel, onMessage, offMessage, thr0w } from '../api/thr0w';
import { SET_CONNECTED_SUCCESS, SET_CONNECTED_REQUEST, getConnected } from '../ducks/connected';
import { SET_CAPTURE_BLOCK_OPEN } from '../ducks/captureBlockOpen';

export default (actionTypes, channels) => {
  const actionTypesLookup = {};
  for (let i = 0; i < actionTypes.length; i++) {
    actionTypesLookup[actionTypes[i]] = true;
  }
  return (store) => {
    const handleMessage = (data) => {
      if (data.source !== getChannel()) {
        if (data.message.thr0w.type !== undefined) {
          store.dispatch({
            type: 'THR0W_CAPTURE',
            source: data.source,
            dataUrl: data.message.thr0w.dataUrl,
          });
          store.dispatch({
            type: SET_CAPTURE_BLOCK_OPEN,
            value: true,
          });
        } else {
          store.dispatch(data.message);
        }
      }
    };
    return next => (
      action => {
        if (action.type === SET_CONNECTED_SUCCESS && action.value) {
          onMessage(handleMessage);
        }
        if (action.type === SET_CONNECTED_REQUEST && !action.value) {
          offMessage(handleMessage);
        }
        if (
          getConnected(store.getState()) &&
          !action.thr0w &&
          actionTypesLookup[action.type] !== undefined
        ) {
          const newAction = action;
          newAction.thr0w = true;
          thr0w(channels, newAction);
        }
        return next(action);
      }
    );
  };
};
