import { MODES } from '../config';

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
const modeId = parseQueryString().mode;
let mode = null;
if (modeId !== undefined && MODES[modeId] !== undefined) {
  mode = MODES[modeId];
}
export const valid = (channel) => (mode !== null && mode.channels.indexOf(channel) !== -1);
export const getMasterChannel = () => (mode != null ? mode.masterChannel : 0);
export const getChannels = () => (mode !== null ? mode.channels : []);
export const getMatrix = () => (mode !== null ? mode.matrix : [[]]);
export const getDimensions = () => (mode !== null ? mode.dimensions : []);
export const getLeftBottom = () => (mode !== null ? mode.leftBottom : 0);
export const getZoomMin = () => (mode !== null ? mode.zoomMin : 0);
