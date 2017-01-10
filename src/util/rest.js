import * as fromThr0w from '../api/thr0w';
import { BASE_URL_UPLOAD, BASE_URL_DS } from '../config';

// eslint-disable-next-line
export const getCollection = (endpoint) => (
  new Promise((resolve, reject) => {
    let collection;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET',
      `${BASE_URL_UPLOAD}${endpoint}`, true);
    xmlhttp.onreadystatechange = () => {
      const status = xmlhttp.status;
      if (xmlhttp.readyState !== 4) return;
      if (status !== 200) {
        reject({ message: status.toString() });
        return;
      }
      try {
        collection = JSON.parse(xmlhttp.responseText);
      } catch (error) {
        reject({ message: '500' });
        return;
      }
      resolve(collection);
    };
    xmlhttp.send();
  })
);
export const dsPost = (endpoint, data) => (
  new Promise((resolve, reject) => {
    let element;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener('load', () => {
      const status = xmlhttp.status;
      if (status !== 200) {
        reject({ message: status.toString() });
      }
      try {
        element = JSON.parse(xmlhttp.responseText);
      } catch (error) {
        reject({ message: '500' });
        return;
      }
      resolve(element);
    });
    xmlhttp.addEventListener('error', () => {
      reject({ message: '500' });
    });
    xmlhttp.addEventListener('abort', () => {
      reject({ message: '500' });
    });
    xmlhttp.open('POST', `${BASE_URL_DS}${endpoint}`, true);
    xmlhttp.setRequestHeader('Authorization', `bearer ${fromThr0w.getToken()}`);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify(data));
  })
);
