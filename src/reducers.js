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
import thr0wCapture from './ducks/thr0wCapture';
import captureBlockOpen from './ducks/captureBlockOpen';
import fisheries from './ducks/fisheries';
import diseases from './ducks/diseases';
import popup from './ducks/popup';
import waypoint from './ducks/waypoint';
import idle from './ducks/idle';
import obesity from './ducks/obesity';
import overweight from './ducks/overweight';
import under from './ducks/under';
import inadequate from './ducks/inadequate';
import videosOpen from './ducks/videosOpen';
import marqueeOpen from './ducks/marqueeOpen';
import trade from './ducks/trade';
import slideshowOpen from './ducks/slideshowOpen';
import rotation from './ducks/rotation';
import scale from './ducks/scale';
import globalTrade from './ducks/globalTrade';
import globalTradeDetail from './ducks/globalTradeDetail';
import globalTradeOpen from './ducks/globalTradeOpen';

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
  thr0wCapture,
  captureBlockOpen,
  fisheries,
  diseases,
  popup,
  waypoint,
  idle,
  obesity,
  overweight,
  inadequate,
  under,
  videosOpen,
  marqueeOpen,
  trade,
  slideshowOpen,
  rotation,
  scale,
  globalTrade,
  globalTradeDetail,
  globalTradeOpen,
});
