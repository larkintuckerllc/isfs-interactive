import { BASE_URL_UPLOAD } from '../config';

// eslint-disable-next-line
export const getElement = (id) => (
  new Promise((resolve, reject) => {
    let element;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET',
      `${BASE_URL_UPLOAD}/world.geo.json/countries/${id}.geo.json`, true);
    xmlhttp.onreadystatechange = () => {
      const status = xmlhttp.status;
      if (xmlhttp.readyState !== 4) return;
      if (status !== 200) {
        reject({ message: status.toString() });
        return;
      }
      try {
        element = JSON.parse(xmlhttp.responseText);
      } catch (error) {
        reject({ message: '500' });
        return;
      }
      resolve(element);
    };
    xmlhttp.send();
  })
);
