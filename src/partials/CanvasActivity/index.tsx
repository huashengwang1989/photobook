import { useMemo, useRef, useState, type FC, useEffect } from 'react';
import { useFetch } from '@/utils/hooks/useFetch';

import { useCanvasBaseAndDim } from '../canvasBaseAndDim';
import { useImageFileSrcCommon } from '../canvasCommon';

import { defaultMetaInfoTypes } from './constants';

import MetaPart from './partials/MetaPart';
import PhotosUnderMeta from './partials/PhotosUnderMeta';
import NextPageOfActivity from './partials/NextPageOfActivity';
import { allocPhotoFilesByPage } from './helpers/photo';

import type { MetaContent } from './helpers/meta/types';
import type {
  Props,
  FileInfoWithMeta,
  MetaInfoTypeBase as MInfoB,
} from './types';

const ActivityCanvas = <T extends MInfoB = MInfoB>(
  props: Props<T>,
): ReturnType<FC<Props<T>>> => {
  const {
    folderSrc,
    supportedExtensions,
    checkFileApplicability,
    fileNamePathToDateInfo,
    // Canvas
    canvasDimensionCm,
    bleedingCm,
    contentPaddingCm,
    // Meta
    metaInfoTypes = defaultMetaInfoTypes as T[],
    limitToTwoPerPage = false,
    lastPageSplitToTwo = false,
    // ID and Export Sync
    onCanvasIdsUpdate,
    onCanvasExportHandlersUpdate,
    // Export
    exportOptions,
    exportUniqueId,
  } = props;

  const metaRef = useRef<HTMLDivElement>(null);

  const supportedExtensionsInclMeta = useMemo(() => {
    if (!supportedExtensions?.length) {
      return undefined;
    }
    return supportedExtensions?.find((ext) => ext.toLowerCase() === 'md')
      ? supportedExtensions
      : [...supportedExtensions, 'md'];
  }, [supportedExtensions]);

  const { getAllApplicableFilesInFolder } = useImageFileSrcCommon({
    folderSrc,
    supportedExtensions: supportedExtensionsInclMeta,
    checkFileApplicability,
    // As filename is random, please use parent folder from path to generate it.
    customMetaGeneration: fileNamePathToDateInfo,
  });

  const { renderCanvas, canvasDimensions } = useCanvasBaseAndDim({
    canvasDimensionCm,
    bleedingCm,
    contentPaddingCm,
    exportOptions,
    exportUniqueId,
  });

  const { data: photoAndMetaFileData } = useFetch({
    func: getAllApplicableFilesInFolder,
    defaultValue: [],
  });

  const { photoFiles, metaFile } = useMemo(() => {
    return photoAndMetaFileData.reduce<{
      photoFiles: FileInfoWithMeta[],
      metaFile: FileInfoWithMeta | null,
    }>(
      (acc, f) => {
        if (f.meta.type === 'meta') {
          acc.metaFile = f;
        } else {
          acc.photoFiles.push(f);
        }
        return acc;
      },
      {
        photoFiles: [],
        metaFile: null,
      },
    );
  }, [photoAndMetaFileData]);

  const [metaContentLoaded, setMetaContentLoaded] =
    useState<MetaContent<T> | null>(null);

  const MetaPartRendered = useMemo(
    () => (
      <MetaPart<T>
        metaInfoTypes={metaInfoTypes}
        metaFile={metaFile}
        onMetaLoad={setMetaContentLoaded}
      />
    ),
    [metaFile, metaInfoTypes],
  );
  const metaPartHeight = useMemo(() => {
    return metaRef.current?.getBoundingClientRect()?.height || 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaContentLoaded]);

  const photosFilesByPage = useMemo(() => {
    const logTitle = (metaContentLoaded as MetaContent<MInfoB> | null)?.title
      ?.innerHtmlForHeading;
    return allocPhotoFilesByPage({
      files: photoFiles,
      log: logTitle,
      limitToTwoPerPage,
      lastPageSplitToTwo,
    });
  }, [lastPageSplitToTwo, limitToTwoPerPage, metaContentLoaded, photoFiles]);

  const CanvasOfPageWithMetaContent = useMemo(() => {
    return (
      <div className="max-h-full flex-col">
        {/** Meta Part */}
        <div ref={metaRef} className={'pb-6'}>
          {MetaPartRendered}
        </div>
        {/** Photo Collage (Part 1: under meta) */}
        <PhotosUnderMeta
          files={photosFilesByPage.underMeta}
          canvasContentHeight={canvasDimensions.contentHeight}
          canvasContentWidth={canvasDimensions.canvasWidth}
          metaPartHeight={metaPartHeight}
        />
      </div>
    );
  }, [
    MetaPartRendered,
    canvasDimensions.canvasWidth,
    canvasDimensions.contentHeight,
    metaPartHeight,
    photosFilesByPage.underMeta,
  ]);

  type CanvasReducer = {
    canvases: JSX.Element[],
    canvasIds: string[],
    exportCanvases: (() => void)[],
  };
  const {
    canvases: NextPages,
    canvasIds: nextPagesCanvasIds,
    exportCanvases: exportNextPageCanvases,
  } = useMemo(() => {
    return photosFilesByPage.nextPages.reduce<CanvasReducer>(
      (acc, page, i) => {
        const PageCanvasContent = (
          <NextPageOfActivity
            files={page}
            canvasContentHeight={canvasDimensions.contentHeight}
            canvasContentWidth={canvasDimensions.canvasWidth}
          />
        );
        const { canvas, canvasId, exportCanvas } = renderCanvas({
          children: PageCanvasContent,
          idAppend: `page_${i + 2}`,
          key: `${exportUniqueId}-page_${i + 2}`,
        });
        acc.canvases.push(canvas);
        acc.canvasIds.push(canvasId);
        acc.exportCanvases.push(exportCanvas);
        return acc;
      },
      { canvases: [], canvasIds: [], exportCanvases: [] },
    );
  }, [
    canvasDimensions.contentHeight,
    canvasDimensions.canvasWidth,
    exportUniqueId,
    photosFilesByPage.nextPages,
    renderCanvas,
  ]);

  const {
    canvas: PageWithMeta,
    canvasId: canvasIdForPageWithMeta,
    exportCanvas: exportMainCanvas,
  } = useMemo(
    () =>
      renderCanvas({
        children: CanvasOfPageWithMetaContent,
        idAppend: photosFilesByPage.nextPages.length ? 'page_1' : undefined,
        key: `${exportUniqueId}-page_1`,
      }),
    [
      CanvasOfPageWithMetaContent,
      exportUniqueId,
      photosFilesByPage.nextPages.length,
      renderCanvas,
    ],
  );

  const singleActivityCanvases = useMemo(
    () => [PageWithMeta, ...NextPages],
    [NextPages, PageWithMeta],
  );

  const singleActivityCanvasIds = useMemo(
    () => [canvasIdForPageWithMeta, ...nextPagesCanvasIds],
    [canvasIdForPageWithMeta, nextPagesCanvasIds],
  );

  const exportSingleActivityCanvases = useMemo(
    () => [exportMainCanvas, ...exportNextPageCanvases],
    [exportMainCanvas, exportNextPageCanvases],
  );

  useEffect(() => {
    onCanvasIdsUpdate?.(singleActivityCanvasIds);
  }, [onCanvasIdsUpdate, singleActivityCanvasIds]);

  useEffect(() => {
    onCanvasExportHandlersUpdate?.(exportSingleActivityCanvases);
  }, [onCanvasExportHandlersUpdate, exportSingleActivityCanvases]);

  return <>{singleActivityCanvases}</>;
};

export default ActivityCanvas;
