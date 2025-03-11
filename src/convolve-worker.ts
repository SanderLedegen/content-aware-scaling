import { sobelXKernel, sobelYKernel } from './kernels';

addEventListener('message', (event) => {  
  const { imageData, start, end, width, height } = event.data;
  const data = convolve(imageData, start, end, width, height);
  postMessage({ data, start });
});

function convolve(
  data: Uint8ClampedArray,
  start: number,
  end: number,
  width: number,
  height: number
): Uint8ClampedArray {
  // Everything's assumed to be grayscale, meaning it shouldn't matter the R
  // component is used as it should be equal to G and B anyway.
  const output = new Uint8ClampedArray(end - start);

  for (let idx = start; idx < end; idx += 4) {
    const alpha = data[idx + 3];

    let sumX = 0;
    let sumY = 0;

    for (let ky = -1; ky <= 1; ky += 1) {
      for (let kx = -1; kx <= 1; kx += 1) {
        const kernelValX = sobelXKernel[ky + 1][kx + 1];
        const kernelValY = sobelYKernel[ky + 1][kx + 1];
        const pixel = getPixel(data, width, height, idx, ky, kx);
        sumX += kernelValX * pixel;
        sumY += kernelValY * pixel;
      }
    }

    const newPixel = Math.sqrt(sumX ** 2 + sumY ** 2);

    output[idx - start + 0] = newPixel;
    output[idx - start + 1] = newPixel;
    output[idx - start + 2] = newPixel;
    output[idx - start + 3] = alpha;
  }

  return output;
}

function getPixel(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  index: number,
  offsetY: number,
  offsetX: number
): number {
  let x = ((index / 4) % width) + offsetX;
  let y = Math.floor(index / 4 / width) + offsetY;
  // Keep within the bounds of the image
  x = Math.max(0, Math.min(x, width - 1));
  y = Math.max(0, Math.min(y, height - 1));

  return data[y * width * 4 + x * 4];
}
