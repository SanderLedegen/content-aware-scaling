export const colorSeam = (imageData: ImageData, indices: number[]): ImageData => {
  const data = Uint8ClampedArray.from(imageData.data);

  for (let ii = 0; ii < indices.length; ii += 1) {
    const idx = ii * 4 * imageData.width + indices[ii] * 4;
    data[idx + 0] = 255;
    data[idx + 1] = 0;
    data[idx + 2] = 0;
    data[idx + 3] = 255;
  }

  return new ImageData(data, imageData.width, imageData.height);
};

export const removeSeam = (imageData: ImageData, indices: number[]): ImageData => {
  const data = new Uint8ClampedArray((imageData.width - 1) * imageData.height * 4);

  for (let yy = 0; yy < imageData.height; yy += 1) {
    const left = imageData.data.slice(
      yy * imageData.width * 4,
      yy * imageData.width * 4 + indices[yy] * 4
    );
    const right = imageData.data.slice(
      yy * imageData.width * 4 + (indices[yy] + 1) * 4,
      (yy + 1) * imageData.width * 4
    );

    data.set(left, yy * (imageData.width - 1) * 4);
    data.set(right, yy * (imageData.width - 1) * 4 + left.length);
  }

  return new ImageData(data, imageData.width - 1, imageData.height);
};
