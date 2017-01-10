export const ACTION_PREFIX = 'app/';
const BASE = `${window.location.protocol}//${window.location.hostname}`;
export const BASE_URL_APP = `${BASE}:${window.location.port}${window.location.pathname}`;
export const BASE_URL_HTTP = `${BASE}:3000`;
export const BASE_URL_SOCKET = `${BASE}:3001`;
export const BASE_URL_DS = `${BASE}:3010`;
export const BASE_URL_UPLOAD = '/upload/larkintuckerllc-isfs-interactive/';
// export const BASE_URL_UPLOAD = 'http://localhost:8081/upload/larkintuckerllc-isfs-interactive/';
export const VIDEO_MAX_DRIFT = 0.02;
export const VIDEO_NETWORK_DELAY = 0.015;
export const VIDEO_INITIAL_RESTART_DELAY = 0.1;
export const VIDEO_RESTART_DELAY_SHIFT = 0.001;
export const SLIDESHOW_INTERVAL = 30;
export const MODES = [
  'single',
  'quad',
  'full',
];
export const MODE_BY_ID = {
  single: {
    menu: true,
    marquee: false,
    blockingWidth: 80,
    zoomMin: 3,
    dimensions: [{
      width: 1080,
      height: 1920,
      scale: 1,
      padding: 0,
      spacing: 0,
      margin: 0,
    }],
    leftBottom: 0,
    rightBottom: 0,
  },
  quad: {
    menu: true,
    marquee: false,
    blockingWidth: 50,
    masterChannel: 6,
    channels: [6, 7, 8, 9],
    matrix: [
      [6, 7, 8, 9],
    ],
    zoomMin: 4,
    dimensions: [{
      width: 1080,
      height: 1920,
      scale: 1,
      padding: 0,
      spacing: 112,
      margin: 0,
    }],
    leftBottom: 0,
    rightBottom: 0,
  },
  full: {
    menu: true,
    marquee: true,
    blockingWidth: 80,
    masterChannel: 6,
    channels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    matrix: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8, 9],
    ],
    zoomMin: 4,
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
    rightBottom: 118,
  },
  top: {
    menu: false,
    marquee: true,
    blockingWidth: 80,
    masterChannel: 0,
    channels: [0, 1, 2, 3, 4, 5],
    matrix: [
      [0, 1, 2],
      [3, 4, 5],
    ],
    zoomMin: 4,
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
    }],
    leftBottom: 0,
    rightBottom: 0,
  },
  topNoMarquee: {
    menu: false,
    marquee: false,
    blockingWidth: 80,
    masterChannel: 0,
    channels: [0, 1, 2, 3, 4, 5],
    matrix: [
      [0, 1, 2],
      [3, 4, 5],
    ],
    zoomMin: 4,
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
    }],
    leftBottom: 0,
    rightBottom: 0,
  },
  fullNoMenu: {
    menu: false,
    marquee: true,
    blockingWidth: 80,
    masterChannel: 6,
    channels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    matrix: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8, 9],
    ],
    zoomMin: 4,
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
    rightBottom: 118,
  },
  fullNoMenuNoMarquee: {
    menu: false,
    marquee: false,
    blockingWidth: 80,
    masterChannel: 6,
    channels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    matrix: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8, 9],
    ],
    zoomMin: 4,
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
    rightBottom: 118,
  },
};
export const ZOOM_MAX = 19;
export const MAX_LAT = 85;
export const MIN_LAT = -85;
export const HAND_WIDTH = 400;
export const LAYERS = [
  'none',
  'trade',
  'fisheries',
  'disease',
  'obesity',
  'overweight',
  'inadequate',
  'under',
];
export const TILES = {
  byId: {
    satellite: {
      id: 'satellite',
      url: 'http://192.168.1.2:8080/satellite/{z}/{y}/{x}',
      // url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      bg: 'rgb(0,0,0)',
    },
    topo: {
      id: 'topo',
      url: 'http://192.168.1.2:8084/topo/{z}/{y}/{x}',
      bg: 'rgb(255,255,255)',
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
    'topo',
    'street',
    'lights',
    'night',
    'white',
    'black',
  ],
};
export const SAVER_WAYPOINTS = [{
  lat: 36,
  lng: -114,
}, {
  lat: 40,
  lng: -6,
}, {
  lat: 24,
  lng: 88,
}, {
  lat: 6,
  lng: 0,
}, {
  lat: -12,
  lng: -60,
}];
export const SAVER_DURATION = 240;
export const SAVER_DELAY = 300;
export const SAVER_CHECK = 60;
export const SAVER_START = 8;
export const SAVER_END = 17;
export const SAVER_ZOOM = 7;
export const SAVER_TIMEOUT = 60 * 60;
export const VIDEOS = [{
  id: 'ifas',
  caption: null,
  src: `${BASE_URL_UPLOAD}videos/ifas.mp4`,
}, {
  id: 'salmon',
  caption: `${BASE_URL_UPLOAD}videos/salmon.en.vtt`,
  src: `${BASE_URL_UPLOAD}videos/salmon.mp4`,
}];
export const MARQUEE_TEXT = [
  'Welcome to the Institute for Sustainable Food Systems. ',
  'Interested in supplying content for this wall? ',
  'Contact Jim Anderson.',
].join('');
export const MARQUEE_INTERVAL = 120;
export const MARQUEE_RUN = 60;
