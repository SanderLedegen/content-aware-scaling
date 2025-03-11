export const grayscale = (imageData: ImageData) => {
  const data = new Uint8ClampedArray(imageData.data.length);

  for (let ii = 0; ii < imageData.data.length; ii += 4) {
    const r = imageData.data[ii + 0];
    const g = imageData.data[ii + 1];
    const b = imageData.data[ii + 2];
    const a = imageData.data[ii + 3];

    const avg = r * 0.2126 + g * 0.7152 + b * 0.0722;

    data[ii + 0] = avg;
    data[ii + 1] = avg;
    data[ii + 2] = avg;
    data[ii + 3] = a;
  }

  return new ImageData(data, imageData.width, imageData.height);
};
