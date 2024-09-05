import { useEffect } from 'react';

import { useCanvasBaseAndDim } from '../canvasBaseAndDim';

import NextPageOfActivity from './partials/NextPageOfActivity';

import type { NextPageProps } from './types';

const CanvasActivityNextPage = (props: NextPageProps) => {
  const {
    // Canvas
    canvasOptions,
    // Photos
    nextPagePhotos,
    nextPageIndex,
    // Export
    exportOptions,
    exportUniqueId,
    onCanvasIdUpdate,
    onCanvasExportHandlerUpdate,
  } = props;

  const { renderCanvas, canvasDimensions } = useCanvasBaseAndDim({
    ...canvasOptions,
    exportOptions,
    exportUniqueId,
  });

  const PageCanvasContent = (
    <NextPageOfActivity
      files={nextPagePhotos}
      canvasContentHeight={canvasDimensions.contentHeight}
      canvasContentWidth={canvasDimensions.canvasWidth}
    />
  );
  const { canvas, canvasId, exportCanvas } = renderCanvas({
    children: PageCanvasContent,
    idAppend: `page_${nextPageIndex + 2}`,
    key: `${exportUniqueId}-page_${nextPageIndex + 2}`,
  });

  useEffect(() => {
    onCanvasIdUpdate?.(canvasId);
  }, [onCanvasIdUpdate, canvasId]);

  useEffect(() => {
    onCanvasExportHandlerUpdate?.(exportCanvas);
  }, [onCanvasExportHandlerUpdate, exportCanvas]);

  return canvas;
};

export default CanvasActivityNextPage;
