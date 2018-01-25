import { MODE_BY_ID, SAVER_END, SAVER_START } from '../config';
import { getChannel } from '../api/thr0w';

const parseQueryString = () => {
  const parsed = {};
  const qs = window.location.search;
  if (!qs) {
    return parsed;
  }
  const qsArray = qs.substr(1).split('&');
  for (let i = 0; i < qsArray.length; ++i) {
    const parameterArray = qsArray[i].split('=', 2);
    if (parameterArray.length === 1) {
      parsed[parameterArray[0]] = '';
    } else {
      parsed[parameterArray[0]] =
      decodeURIComponent(parameterArray[1].replace(/\+/g, ' '));
    }
  }
  return parsed;
};
const parsed = parseQueryString();
const hour = (new Date()).getHours();
const newTileId = hour >= SAVER_START && hour <= SAVER_END ?
  'satellite' : 'lights';
let modeId = parseQueryString().mode;
modeId = modeId !== undefined ? modeId : 'fullNoMenu';
const mode = MODE_BY_ID[modeId];
const tile = parsed.tile;
const lat = parsed.lat;
const lng = parsed.lng;
const zoom = parsed.zoom;
const slideFile = parsed.slideFile;
const slideCycle = parsed.slideCycle !== 'false';
const slidePage = parsed.slidePage !== undefined ? parseInt(parsed.slidePage, 10) : 1;
export const fresh = parsed.fresh !== undefined;
export const getChannels = () => (modeId === 'single' ? [] : mode.channels);
export const getMasterChannel = () => (modeId === 'single' ? getChannel() : mode.masterChannel);
export const getMatrix = () => (modeId === 'single' ? [[getChannel()]] : mode.matrix);
export const getDimensions = () => mode.dimensions;
export const getLeftBottom = () => mode.leftBottom;
export const getRightBottom = () => mode.rightBottom;
export const getZoomMin = () => mode.zoomMin;
export const getModeId = () => modeId;
export const getMenu = () => mode.menu;
export const getTile = () => (tile !== undefined ? tile : newTileId);
export const getLat = () => (lat !== undefined ? lat : 0);
export const getLng = () => (lng !== undefined ? lng : 0);
export const getZoom = () => (zoom !== undefined ? Math.max(zoom, mode.zoomMin) : mode.zoomMin);
export const getBlockingWidth = () => mode.blockingWidth;
export const getMarquee = () => mode.marquee;
export const getSlideFile = () => (slideFile !== undefined ? slideFile : 'sample.pdf');
export const getSlideCycle = () => slideCycle;
export const getSlidePage = () => slidePage;
export const getSingle = () => modeId === 'single';
