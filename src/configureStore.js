import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';
import thr0wMiddleware from './util/thr0wMiddleware';
import reducers from './reducers';
import { SET_MAP_VIEW } from './ducks/mapView';
import { SET_TILE } from './ducks/tile';
import { SET_VIDEO } from './ducks/video';
import { SET_VIDEO_CURRENT_TIME } from './ducks/videoCurrentTime';
import { getChannels } from './util/parameters';

export default () => {
  const middlewares = [
    thunk,
    thr0wMiddleware(['@@router/LOCATION_CHANGE',
      SET_MAP_VIEW, SET_TILE, SET_VIDEO, SET_VIDEO_CURRENT_TIME], getChannels()),
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
