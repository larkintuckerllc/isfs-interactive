import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import authenticated from './ducks/authenticated';
import channel from './ducks/channel';
import connected from './ducks/connected';

export default combineReducers({
  form: formReducer,
  routing: routerReducer,
  authenticated,
  channel,
  connected,
});
