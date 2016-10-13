import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import thr0w from 'thr0w-client-module/lib/ducks/thr0w';

export default combineReducers({
  form: formReducer,
  routing: routerReducer,
  thr0w,
});
