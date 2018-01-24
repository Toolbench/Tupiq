const canvasToDataUrl = (image, compress) => {
  const canvas = document.createElement('canvas');

  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL('image/webp', compress);
};

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
      compress = 0.4;
    }

    resolve(canvasToDataUrl(event.target, compress));
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
