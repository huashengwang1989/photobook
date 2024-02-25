import type { CommonPropsForCanvasSize } from '../types';

const folderBaseSrcForCal =
  '/Users/huasheng/Pictures/Photos/2023 Chuling Check-in-out at PCF Sparkletots';

const folderBaseSrcForActivity =
  '/Users/huasheng/Pictures/Photos/2023 Chuling at PCF Sparkletots';

// Canvas dimensions in centimeter
const canvasSizeProps: CommonPropsForCanvasSize = {
  canvasDimensionCm: [20, 20],
  bleedingCm: [0.5, 0.5, 0.5, 0.5],
  contentPaddingCm: 0.5,
};

export { folderBaseSrcForCal, folderBaseSrcForActivity, canvasSizeProps };
