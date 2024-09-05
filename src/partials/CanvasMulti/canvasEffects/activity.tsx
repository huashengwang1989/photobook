import { useCallback, useMemo, useState } from 'react';

import { useActivitiesData } from '../../CanvasActivity/data';
import {
  CanvasActivityFirstPageWithMeta,
  CanvasActivityNextPage,
} from '../../CanvasActivity';

import type {
  FistPageWithMetaProps,
  NextPageProps,
  CanvasOptions,
  CanvasToImageExportOptions,
  ActivityPageAdjust,
  ThemeProps,
} from '../types';

function useAvtivityPages(props: {
  theme: Pick<ThemeProps, 'themeClassName' | 'themeColor'>,
  baseFolder: string,
  ignoredExtensions: string[],
  canvasOptions: CanvasOptions,
  exportOptions: CanvasToImageExportOptions,
  pageAdjust: ActivityPageAdjust,
}) {
  const {
    theme,
    canvasOptions,
    baseFolder,
    ignoredExtensions,
    exportOptions,
    pageAdjust,
  } = props;

  const { allActivitiesPhotoFilesByPage } = useActivitiesData({
    baseFolder,
    ignoredExtensions,
    pageAdjust,
  });

  const [canvasIdsByActivity, setCanvasIdsByActivity] = useState<string[][]>(
    [],
  );
  const genOnCanvasIdUpdate = useCallback((activityIndex: number) => {
    return (id: string) => {
      setCanvasIdsByActivity((curIdss) => {
        const curList = curIdss[activityIndex];
        if (!Array.isArray(curList)) {
          const list = [...curIdss];
          list[activityIndex] = [id];
          return list;
        }
        if (curList.includes(id)) {
          return curIdss;
        }
        const list = [...curIdss];
        list[activityIndex] = [...curList, id];
        return list;
      });
    };
  }, []);

  const { activityCanvasesGrouped } = useMemo(() => {
    return allActivitiesPhotoFilesByPage.reduce<{
      activityCanvasesGrouped: React.ReactNode[],
      __byDateFolderCount: Partial<Record<string, number>>,
    }>(
      (acc, singleActivityInfo, activityIndex) => {
        const {
          folder,
          metaFile,
          photoFilesSplitToPages: photosByPages,
        } = singleActivityInfo;

        const folderDate = folder.meta.yyyyMmDd;
        const thisDateCnt = acc.__byDateFolderCount[folderDate] ?? NaN;
        if (Number.isNaN(thisDateCnt)) {
          acc.__byDateFolderCount[folderDate] = 0;
        }
        const folderId = `${folderDate}-${(thisDateCnt || 0) + 1}`;
        acc.__byDateFolderCount[folderDate] = (thisDateCnt || 0) + 1;
        const activityId = `activity-${folderId}`;

        const onCanvasIdUpdate = genOnCanvasIdUpdate(activityIndex);

        const firstPageProps: FistPageWithMetaProps = {
          ...theme,
          canvasOptions,
          metaFile,
          underMetaPhotos: photosByPages.underMeta,
          hasNextPages: photosByPages.nextPages.length > 0,
          exportOptions,
          exportUniqueId: activityId,
          onCanvasIdUpdate,
        };
        const FirstPageOfActivityWithMeta = (
          <CanvasActivityFirstPageWithMeta {...firstPageProps} />
        );

        const nextPagesRendered = photosByPages.nextPages.map(
          (nextPagePhotos, nextPageIndex) => {
            const nextPageProps: NextPageProps = {
              canvasOptions,
              nextPagePhotos,
              nextPageIndex,
              exportOptions,
              exportUniqueId: activityId,
              onCanvasIdUpdate,
            };
            return <CanvasActivityNextPage {...nextPageProps} />;
          },
        );

        acc.activityCanvasesGrouped.push(
          FirstPageOfActivityWithMeta,
          ...nextPagesRendered,
        );

        return acc;
      },
      {
        activityCanvasesGrouped: [],
        __byDateFolderCount: {},
      },
    );
  }, [
    allActivitiesPhotoFilesByPage,
    canvasOptions,
    exportOptions,
    genOnCanvasIdUpdate,
    theme,
  ]);

  const activityCanvasIds = useMemo(() => {
    return ([] as string[]).concat(
      ...canvasIdsByActivity.filter((ids) => Array.isArray(ids)),
    );
  }, [canvasIdsByActivity]);

  const output = useMemo(
    () => ({
      activityCanvasesGrouped,
      activityCanvasIds,
    }),
    [activityCanvasIds, activityCanvasesGrouped],
  );

  return output;
}

export { useAvtivityPages };
