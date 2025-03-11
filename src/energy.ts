export const computeEnergy = (imageData: ImageData): number[] => {
  const energy = new Array(imageData.width * imageData.height);

  for (let yy = 0; yy < imageData.height; yy += 1) {
    for (let xx = 0; xx < imageData.width; xx += 1) {
      if (yy === 0) {
        energy[yy * imageData.width + xx] = imageData.data[yy * 4 * imageData.width + xx * 4];
        continue;
      }

      const topLeft = xx > 0 ? energy[(yy - 1) * imageData.width + xx - 1] : Infinity;
      const topCenter = energy[(yy - 1) * imageData.width + xx];
      const topRight =
        xx < imageData.width - 1 ? energy[(yy - 1) * imageData.width + xx + 1] : Infinity;

      energy[yy * imageData.width + xx] =
        imageData.data[yy * 4 * imageData.width + xx * 4] + Math.min(topLeft, topCenter, topRight);
    }
  }

  return energy;
};

export const findIndicesLeastEnergySeam = (
  cumulativeImportance: number[],
  width: number,
  height: number
): number[] => {
  const indices: number[] = [];

  const lastRow = cumulativeImportance.slice((height - 1) * width, height * width);
  const min = Math.min(...lastRow);
  let idx = lastRow.indexOf(min);
  indices.push(idx);

  for (let yy = height - 2; yy >= 0; yy -= 1) {
    const topLeft = idx > 0 ? cumulativeImportance[yy * width + idx - 1] : Infinity;
    const topCenter = cumulativeImportance[yy * width + idx];
    const topRight = idx < width - 1 ? cumulativeImportance[yy * width + idx + 1] : Infinity;

    const minIndex =
      idx + [topLeft, topCenter, topRight].indexOf(Math.min(topLeft, topCenter, topRight)) - 1;
    indices.push(minIndex);
    idx = minIndex;
  }

  return indices.reverse();
};
