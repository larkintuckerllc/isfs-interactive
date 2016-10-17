import io from 'socket.io-client';

let baseHttp;
let baseSocket;
const channelStorage = parseInt(window.localStorage.getItem('thr0w_channel'), 10);
let channel = isNaN(channelStorage) ? null : channelStorage;
let token = window.localStorage.getItem('thr0w_token');
let socket = null;
export const setBaseHttp = (b) => {
  baseHttp = b;
};
export const setBaseSocket = (b) => {
  baseSocket = b;
};
export const getChannel = () => channel;
export const authenticated = () => token !== null;
export const login = (username, password) => {
  if (baseHttp === undefined) throw new Error();
  if (username === undefined || typeof username !== 'string') throw new Error();
  if (password === undefined || typeof password !== 'string') throw new Error();
  return new Promise((resolve, reject) => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST',
      `${baseHttp}/api/login/`, true);
    xmlhttp.setRequestHeader('Content-type',
      'application/x-www-form-urlencoded');
    xmlhttp.onreadystatechange = () => {
      const status = xmlhttp.status;
      if (xmlhttp.readyState !== 4) return;
      if (status !== 200) {
        reject({ message: status.toString() });
        return;
      }
      try {
        token = JSON.parse(xmlhttp.responseText).token;
      } catch (error) {
        reject({ message: '500' });
        return;
      }
      if (token === null) {
        reject({ message: '500' });
        return;
      }
      window.localStorage.setItem('thr0w_token', token);
      resolve();
    };
    xmlhttp.send(`username=${username}&password=${password}`);
  });
};
export const logout = () => {
  window.localStorage.removeItem('thr0w_token');
};
export const disconnect = () => {
  if (socket === null) return;
  socket.disconnect();
  window.localStorage.removeItem('thr0w_channel');
  socket = null;
  channel = null;
};
export const connect = (c, msgCb) => {
  if (baseSocket === undefined) throw new Error();
  if (!authenticated()) throw new Error();
  if (c === undefined || typeof c !== 'number') throw new Error();
  if (msgCb === undefined || typeof msgCb !== 'function') throw new Error();
  if (socket !== null) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let connected = false;
    const timeout = window.setTimeout(() => {
      if (socket !== null) socket.disconnect();
      socket = null;
      reject({ message: '500' });
    }, 5000);
    const authenticate = () => {
      socket.emit('authenticate',
        JSON.stringify({ token, channel: c }));
    };
    socket = io(baseSocket);
    socket.on('authenticated', () => {
      if (connected) return;
      connected = true;
      channel = c;
      window.localStorage.setItem('thr0w_channel', channel.toString());
      window.clearTimeout(timeout);
      socket.on('message', msgCb);
      // TODO: HANDLE DUPLICATE
      socket.on('duplicate', () => {});
      resolve(channel);
    });
    socket.on('reconnect', authenticate);
    authenticate();
  });
};
export const thr0w = (channels, message) => {
  if (socket == null) throw new Error();
  if (channels === undefined || !Array.isArray(channels)) {
    throw new Error();
  }
  if (message === undefined) throw new Error();
  if (channels.length === 0) {
    return;
  }
  socket.emit('thr0w', JSON.stringify({ channels, message }));
};
export const onMessage = (messageCb) => {
  if (socket == null) throw new Error();
  if (messageCb === undefined ||
    typeof messageCb !== 'function') throw new Error();
  socket.on('message', messageCb);
};
export const offMessage = (messageCb) => {
  if (socket == null) throw new Error();
  if (messageCb === undefined ||
    typeof messageCb !== 'function') throw new Error();
  socket.off('message', messageCb);
};
