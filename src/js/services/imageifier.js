import { canvasToDataURL } from '../utils';

export const getImageDataURL = postURL => new Promise((resolve, reject) => {
  const image = new Image();
  const xmlHTTP = new XMLHttpRequest();
  let totalSize;

  image.addEventListener('error', (error) => {
    reject(error);
  });

  image.addEventListener('load', (event) => {
    let compress = 0.6;

    if (totalSize > 10000000) {
      compress = 0.2;
    } else if (totalSize > 5000000) {
      compress = 0.3;
    }

    const dataURL = canvasToDataURL(event.target, compress);

    resolve(dataURL);
  });

  xmlHTTP.onerror = (error) => {
    reject(error);
  };

  xmlHTTP.onload = () => {
    const blob = new Blob([xmlHTTP.response]);
    image.src = window.URL.createObjectURL(blob);
  };

  xmlHTTP.onprogress = (event) => {
    if (totalSize === undefined) {
      totalSize = event.total;
    }
  };

  xmlHTTP.open('GET', `${postURL}/download`, true);
  xmlHTTP.responseType = 'arraybuffer';
  xmlHTTP.send();
});
