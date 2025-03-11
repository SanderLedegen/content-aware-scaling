import { computeEnergy, findIndicesLeastEnergySeam } from './energy';
import { grayscale } from './grayscale';
import { colorSeam, removeSeam } from './seam';

export class ContentAwareScaling {
  private readonly workers: Worker[] = [];

  constructor(private imageData: ImageData, private numWorkers = 2) {
    for (let workerIdx = 0; workerIdx < this.numWorkers; workerIdx += 1) {
      const worker = new Worker(new URL('./convolve-worker.ts', import.meta.url), {
        type: 'module',
      });
      this.workers.push(worker);
    }
  }

  async runIteration(): Promise<{
    grayscaleImage: ImageData;
    sobelImage: ImageData;
    seamsImage: ImageData;
    shrunkImage: ImageData;
  }> {
    const grayscaleImage = grayscale(this.imageData);
    const sobelImage = await this.convolve(grayscaleImage);
    const energy = computeEnergy(sobelImage);
    const indicesToRemove = findIndicesLeastEnergySeam(energy, sobelImage.width, sobelImage.height);
    const seamsImage = colorSeam(this.imageData, indicesToRemove);
    const shrunkImage = removeSeam(this.imageData, indicesToRemove);

    this.imageData = shrunkImage;

    return {
      grayscaleImage,
      sobelImage,
      seamsImage,
      shrunkImage,
    };
  }

  stop(): void {
    for (const worker of this.workers) {
      worker.terminate();
    }
  }

  private convolve(imageData: ImageData): Promise<ImageData> {
    const numPixels = imageData.width * imageData.height;
    const partSize = Math.floor(numPixels / this.numWorkers);
    const remainingPartSize = numPixels % this.numWorkers;

    let finishedWorkers = 0;

    const output = new Uint8ClampedArray(numPixels * 4);

    return new Promise((resolve, reject) => {
      for (let workerIdx = 0; workerIdx < this.numWorkers; workerIdx += 1) {
        const worker = this.workers[workerIdx];

        worker.onerror = (event) => reject(event);
        worker.onmessageerror = (event) => reject(event);
        worker.onmessage = (event) => {
          const { data, start } = event.data;
          finishedWorkers += 1;

          output.set(data, start);

          if (finishedWorkers === this.numWorkers) {
            const outputImageData = new ImageData(output, imageData.width, imageData.height);
            resolve(outputImageData);
          }
        };

        const isLastWorker = workerIdx === this.numWorkers - 1;

        worker.postMessage({
          imageData: imageData.data,
          start: partSize * 4 * workerIdx,
          end: partSize * 4 * (workerIdx + 1) + (isLastWorker ? remainingPartSize * 4 : 0),
          width: imageData.width,
          height: imageData.height,
        });
      }
    });
  }
}
