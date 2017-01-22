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
import { SET_DRAWING_OPEN } from './ducks/drawingOpen';
import { SET_DRAWING_COLOR } from './ducks/drawingColor';
import { SET_CAPTURE_BLOCK_OPEN } from './ducks/captureBlockOpen';
import { SET_POPUP } from './ducks/popup';
import { SET_WAYPOINT } from './ducks/waypoint';
import { SET_IDLE } from './ducks/idle';
import { SET_MARQUEE_OPEN } from './ducks/marqueeOpen';
import { SET_SLIDESHOW_OPEN } from './ducks/slideshowOpen';
import { SET_ROTATION } from './ducks/rotation';
import { SET_SCALE } from './ducks/scale';
import { getChannels } from './util/parameters';

export default () => {
  const middlewares = [
    thunk,
    thr0wMiddleware(['@@router/LOCATION_CHANGE', SET_CAPTURE_BLOCK_OPEN,
      SET_DRAWING_COLOR, SET_DRAWING_OPEN, SET_IDLE, SET_MAP_VIEW,
      SET_MARQUEE_OPEN, SET_POPUP, SET_TILE, SET_SLIDESHOW_OPEN,
      SET_VIDEO, SET_VIDEO_CURRENT_TIME, SET_WAYPOINT, SET_ROTATION, SET_SCALE], getChannels()),
    routerMiddleware(hashHistory),
  ];
  return createStore(
    reducers,
    compose(
      applyMiddleware(...middlewares),
      window.devToolsExtension ?
        window.devToolsExtension() : f => f
    )
  );
};
