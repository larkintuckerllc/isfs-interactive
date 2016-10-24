import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import authenticated from './ducks/authenticated';
import channel from './ducks/channel';
import connected from './ducks/connected';
import video from './ducks/video';
import videoCurrentTime from './ducks/videoCurrentTime';
import tile from './ducks/tile';
import mapView from './ducks/mapView';
import tilesOpen from './ducks/tilesOpen';
import layersOpen from './ducks/layersOpen';
import modesOpen from './ducks/modesOpen';
import drawingOpen from './ducks/drawingOpen';
import drawingColor from './ducks/drawingColor';

export default combineReducers({
  form: formReducer,
  routing: routerReducer,
  authenticated,
  channel,
  connected,
  video,
  videoCurrentTime,
  mapView,
  tile,
  tilesOpen,
  layersOpen,
  modesOpen,
  drawingOpen,
  drawingColor,
});
