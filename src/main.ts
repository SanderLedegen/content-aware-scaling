import './style.css';
import { ContentAwareScaling } from './content-aware-scaling';

// DOM selectors
const canvasInput = document.querySelector<HTMLCanvasElement>('#canvas-input')!;
const ctxInput = canvasInput?.getContext('2d')!;

const canvasOutput = document.querySelector<HTMLCanvasElement>('#canvas-output')!;
const ctxOutput = canvasOutput?.getContext('2d')!;
const canvasSobel = document.querySelector<HTMLCanvasElement>('#canvas-sobel')!;
const canvasSeams = document.querySelector<HTMLCanvasElement>('#canvas-seams')!;

const goButton = document.querySelector<HTMLButtonElement>('#go')!;
const stopButton = document.querySelector<HTMLButtonElement>('#stop')!;
const iterationsInput = document.querySelector<HTMLInputElement>('#iterations')!;
const thumbnails = document.querySelectorAll<HTMLImageElement>('.thumbnail');
const inputDimensions = document.querySelector<HTMLSpanElement>('#input-dimensions')!;
const outputDimensions = document.querySelector<HTMLSpanElement>('#output-dimensions')!;
const numWorkersInput = document.querySelector<HTMLInputElement>('#numWorkers')!;

let cas: ContentAwareScaling;

// Event listeners
goButton.addEventListener('click', async () => {
  const imageData = ctxInput.getImageData(0, 0, canvasInput.width, canvasInput.height);
  const numWorkers = +numWorkersInput.value;
  cas = new ContentAwareScaling(imageData, numWorkers);

  goButton.disabled = true;
  stopButton.disabled = false;
  const iterations = +iterationsInput.value;

  console.log(`Running ${iterations} iterations using ${numWorkers} workers`);
  console.time('Resizing image');

  for (let ii = 0; ii < iterations; ii += 1) {
    const { sobelImage, seamsImage, shrunkImage } = await cas.runIteration();

    drawImage(sobelImage, canvasSobel);
    drawImage(seamsImage, canvasSeams);
    drawImage(shrunkImage, canvasOutput);
  }

  goButton.disabled = false;
  stopButton.disabled = true;

  console.timeEnd(`Resizing image`);
});

stopButton.addEventListener('click', () => {
  cas.stop();

  stopButton.disabled = true;
  goButton.disabled = false;
});

// Helper functions
function drawImage(imageData: ImageData, canvas: HTMLCanvasElement) {
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  outputDimensions.textContent = `(${imageData.width} x ${imageData.height})`;
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(imageData, 0, 0);
}

async function selectThumbnail(thumbnail: HTMLImageElement) {
  const selectedImage = new Image();
  selectedImage.src = thumbnail.src;
  await selectedImage.decode();

  canvasInput.width = selectedImage.width;
  canvasInput.height = selectedImage.height;
  inputDimensions.textContent = `(${selectedImage.width} x ${selectedImage.height})`;
  ctxInput.drawImage(selectedImage, 0, 0);

  outputDimensions.textContent = '';
  canvasOutput.width = selectedImage.width;
  canvasOutput.height = selectedImage.height;
  ctxOutput.reset();

  canvasSeams.width = selectedImage.width;
  canvasSeams.height = selectedImage.height;
  canvasSobel.width = selectedImage.width;
  canvasSobel.height = selectedImage.height;

  thumbnails.forEach((thumbnail) => thumbnail.classList.remove('selected'));
  thumbnail.classList.add('selected');
}

for (const thumbnail of thumbnails) {
  thumbnail.addEventListener('click', async () => {
    selectThumbnail(thumbnail);
  });
}

selectThumbnail(thumbnails[0]);
