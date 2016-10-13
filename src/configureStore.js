import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';
import thr0wMiddleware from 'thr0w-client-module/lib/thr0wMiddleware';
import { CHANNELS } from './config';
import reducers from './reducers';
import { SET_LAT_LNG } from './ducks/latLng';

export default () => {
  const middlewares = [
    thunk,
    // THR0W INTEGRATION
    thr0wMiddleware([SET_LAT_LNG], CHANNELS),
    // END THR0W INTEGRATION
    routerMiddleware(hashHistory),
  ];
  return createStore(
    reducers,
    compose(
      applyMiddleware(...middlewares),
      process.env.NODE_ENV !== 'production' && window.devToolsExtension ?
        window.devToolsExtension() : f => f
    )
  );
};
