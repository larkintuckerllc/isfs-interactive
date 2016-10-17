import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';
import thr0wMiddleware from './util/thr0wMiddleware';
import { CHANNELS } from './config';
import reducers from './reducers';
import { SET_MAP_VIEW } from './ducks/mapView';

export default () => {
  const middlewares = [
    thunk,
    thr0wMiddleware([SET_MAP_VIEW], CHANNELS),
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
