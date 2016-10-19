export const ACTION_PREFIX = 'app/';
const BASE = `${window.location.protocol}//${window.location.hostname}`;
export const BASE_URL_HTTP = `${BASE}:3000`;
export const BASE_URL_SOCKET = `${BASE}:3001`;
export const VIDEO_MAX_DRIFT = 0.03;
export const VIDEO_NETWORK_DELAY = 0.015;
export const VIDEO_INITIAL_RESTART_DELAY = 0.1;
export const VIDEO_RESTART_DELAY_SHIFT = 0.01;
export const MODES = {
  single6: {
    masterChannel: 6,
    channels: [6],
    matrix: [[6]],
    dimensions: [{
      width: 1080,
      height: 1920,
      scale: 1,
      padding: 0,
      spacing: 0,
      margin: 0,
    }],
    leftBottom: 0,
  },
  full: {
    masterChannel: 0,
    channels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    matrix: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8, 9],
    ],
    dimensions: [{
      width: 1920,
      height: 1080,
      scale: 0.84,
      padding: 0,
      spacing: 28,
      margin: 20,
    }, {
      width: 1920,
      height: 1080,
      scale: 0.84,
      padding: 0,
      spacing: 28,
      margin: 60,
    }, {
      width: 1080,
      height: 1920,
      scale: 1,
      padding: 111,
      spacing: 112,
      margin: 0,
    }],
    leftBottom: 111,
  },
};
export const CENTER = {
  lat: 0,
  lng: 0,
};
export const ZOOM = 5;
export const ZOOM_MIN = 5;
export const ZOOM_MAX = 7;
export const MAX_LAT = 85;
export const MIN_LAT = -85;
export const HAND_WIDTH = 400;
export const TILES = {
  byId: {
    satellite: {
      id: 'satellite',
      url: 'http://192.168.1.2:8080/satellite/{z}/{y}/{x}',
      bg: 'rgb(0,0,0)',
    },
    street: {
      id: 'street',
      url: 'http://192.168.1.2:8081/street/{z}/{x}/{y}.png',
      bg: 'rgb(255,255,255)',
    },
    night: {
      id: 'night',
      url: 'http://192.168.1.2:8082/night/{z}/{x}/{y}.png',
      bg: 'rgb(0,0,0)',
    },
    lights: {
      id: 'lights',
      url: 'http://192.168.1.2:8083/lights/{z}/{y}/{x}.jpeg',
      bg: 'rgb(0,0,0)',
    },
    white: {
      id: 'white',
      url: null,
      bg: 'rgb(255,255,255)',
    },
    black: {
      id: 'black',
      url: null,
      bg: 'rgb(0,0,0)',
    },
  },
  ids: [
    'satellite',
    'street',
    'night',
    'lights',
    'white',
    'black',
  ],
};
