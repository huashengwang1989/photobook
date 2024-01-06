const CM_TO_PIXEL_MULTIPLY = 37.7952755906;

const cmToPixel = (cmNum: number): number => {
  const m = CM_TO_PIXEL_MULTIPLY;
  return m * cmNum;
};

export { cmToPixel };
