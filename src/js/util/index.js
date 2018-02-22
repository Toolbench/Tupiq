export const canvasToDataURL = (image, compress) => {
  const canvas = document.createElement('canvas');

  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL('image/webp', compress);
};

export const toQueryString = object => Object.keys(object).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`).join('&');
