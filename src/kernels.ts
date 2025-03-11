export const identityKernel = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
];

export const sobelXKernel = [
  [1, 0, -1],
  [2, 0, -2],
  [1, 0, -1],
];

export const sobelYKernel = [
  [1, 2, 1],
  [0, 0, 0],
  [-1, -2, -1],
];

// Final value to be multiplied by 1/16
export const gaussianBlurKernel = [
  [1, 2, 1],
  [2, 4, 2],
  [1, 2, 1],
];
