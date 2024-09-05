import { useMemo, useRef, useState, useEffect } from 'react';

import { useCanvasBaseAndDim } from '../canvasBaseAndDim';

import { defaultMetaInfoTypes } from './constants';

import MetaPart from './partials/MetaPart';
import PhotosUnderMeta from './partials/PhotosUnderMeta';

import type { MetaContent } from './helpers/meta/types';
import type {
  MetaInfoTypeBase as MInfoB,
  FistPageWithMetaProps,
} from './types';

const CanvasFirstPageWithMeta = <T extends MInfoB = MInfoB>(
  props: FistPageWithMetaProps<T>,
) => {
  const {
    // Canvas
    canvasOptions,
    // Theme
    themeClassName,
    themeColor,
    // Meta
    metaFile = null,
    metaInfoTypes = defaultMetaInfoTypes as T[],
    // Photos
    underMetaPhotos,
    hasNextPages,
    // Export
    exportOptions,
    exportUniqueId,
    onCanvasIdUpdate,
    onCanvasExportHandlerUpdate,
  } = props;

  const metaRef = useRef<HTMLDivElement>(null);

  const { renderCanvas, canvasDimensions } = useCanvasBaseAndDim({
    ...canvasOptions,
    exportOptions,
    exportUniqueId,
  });

  const [metaContentLoaded, setMetaContentLoaded] =
    useState<MetaContent<T> | null>(null);

  const MetaPartRendered = useMemo(
    () => (
      <MetaPart<T>
        metaInfoTypes={metaInfoTypes}
        metaFile={metaFile}
        onMetaLoad={setMetaContentLoaded}
        themeClassName={themeClassName}
        themeColor={themeColor}
      />
    ),
    [metaFile, metaInfoTypes, themeClassName, themeColor],
  );

  const metaPartHeight = useMemo(() => {
    return metaRef.current?.getBoundingClientRect()?.height || 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaContentLoaded]);

  const CanvasOfPageWithMetaContent = useMemo(
    () => (
      <div className="max-h-full flex-col">
        {/** Meta Part */}
        <div ref={metaRef} className={'pb-6'}>
          {MetaPartRendered}
        </div>
        {/** Photo Collage (Part 1: under meta) */}
        <PhotosUnderMeta
          files={underMetaPhotos}
          canvasContentHeight={canvasDimensions.contentHeight}
          canvasContentWidth={canvasDimensions.canvasWidth}
          metaPartHeight={metaPartHeight}
        />
      </div>
    ),
    [
      MetaPartRendered,
      canvasDimensions.canvasWidth,
      canvasDimensions.contentHeight,
      metaPartHeight,
      underMetaPhotos,
    ],
  );

  const { canvas, canvasId, exportCanvas } = useMemo(
    () =>
      renderCanvas({
        children: CanvasOfPageWithMetaContent,
        idAppend: hasNextPages ? 'page_1' : undefined,
        key: `${exportUniqueId}-page_1`,
      }),
    [CanvasOfPageWithMetaContent, exportUniqueId, hasNextPages, renderCanvas],
  );

  useEffect(() => {
    onCanvasIdUpdate?.(canvasId);
  }, [onCanvasIdUpdate, canvasId]);

  useEffect(() => {
    onCanvasExportHandlerUpdate?.(exportCanvas);
  }, [exportCanvas, onCanvasExportHandlerUpdate]);

  return canvas;
};

export default CanvasFirstPageWithMeta;
