import { MODE_BY_ID } from '../config';
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
let modeId = parseQueryString().mode;
modeId = modeId !== undefined ? modeId : 'single';
const mode = MODE_BY_ID[modeId];
const tile = parseQueryString().tile;
export const getChannels = () => (modeId === 'single' ? [] : mode.channels);
export const getMasterChannel = () => (modeId === 'single' ? getChannel() : mode.masterChannel);
export const getMatrix = () => (modeId === 'single' ? [[getChannel()]] : mode.matrix);
export const getDimensions = () => mode.dimensions;
export const getLeftBottom = () => mode.leftBottom;
export const getZoomMin = () => mode.zoomMin;
export const getModeId = () => modeId;
export const getMenu = () => mode.menu;
export const getTile = () => (tile !== undefined ? tile : 'black');
