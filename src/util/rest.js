import { BASE_URL_UPLOAD } from '../config';

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
