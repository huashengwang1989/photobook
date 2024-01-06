import { useMemo } from 'react';

import { cmToPixel } from '@/utils/dim';

import type { CommonPropsForCanvasSize as Props } from './types';

function useCanvasSizeCommon(props: Props) {
  const { canvasDimensionCm, contentPaddingCm, bleedingCm } = props;

  const canvasDimensions = useMemo(() => {
    const px = cmToPixel; // (n: number) => Math.round(cmToPixel(n));
    const w = px(canvasDimensionCm[0] + bleedingCm[1] + bleedingCm[3]);
    const h = px(canvasDimensionCm[1] + bleedingCm[0] + bleedingCm[2]);
    const bleedingPaddings = bleedingCm.map(px) as [
      number,
      number,
      number,
      number,
    ];
    const canvasWidth = w - bleedingPaddings[1] - bleedingPaddings[3];
    const canvasHeight = w - bleedingPaddings[0] - bleedingPaddings[2];
    const contentPadding = px(contentPaddingCm);
    const contentWidth = canvasWidth - 2 * contentPadding;
    const contentHeight = canvasHeight - 2 * contentPadding;
    return {
      width: w,
      height: h,
      canvasWidth,
      canvasHeight,
      bleedingPaddings,
      contentPadding,
      contentWidth,
      contentHeight,
    };
  }, [bleedingCm, canvasDimensionCm, contentPaddingCm]);

  const output = useMemo(() => ({ canvasDimensions }), [canvasDimensions]);

  return output;
}

export { useCanvasSizeCommon };
