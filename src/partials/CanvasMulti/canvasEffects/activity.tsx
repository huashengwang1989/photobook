import { useMemo, useState, type ReactNode } from 'react';

import { useFetch } from '@/utils/hooks/useFetch';

import { useImageFileSrcCommon } from '../../canvasCommon/fileSrc';
import CanvasActivity from '../../CanvasActivity';

import {
  fileNamePathToDateInfo as imageFileToDateInfoForActivity,
  activityFolderNameToDateInfo,
} from '../configs/activity';

import type {
  CanvasActivityProps,
  FileEntry,
  CanvasOptions,
  CanvasToImageExportOptions,
  ActivityPageAdjust,
} from '../types';

const checkApplicabilityAsParentFolder = (f: FileEntry) =>
  Boolean(f.children && f.path);

function useAvtivityPages(props: {
  baseFolder: string,
  ignoredExtensions: string[],
  canvasOptions: CanvasOptions,
  exportOptions: CanvasToImageExportOptions,
  pageAdjust: ActivityPageAdjust,
}) {
  const {
    canvasOptions,
    baseFolder,
    ignoredExtensions,
    exportOptions,
    pageAdjust,
  } = props;

  const [canvasIdsByActivity, setCanvasIdsByActivity] = useState<string[][]>(
    [],
  );

  const { getAllApplicableFilesInFolder } = useImageFileSrcCommon({
    folderSrc: baseFolder,
    preventRecursiveCheck: true,
    ignoredExtensions,
    customMetaGeneration: activityFolderNameToDateInfo,
    checkFileApplicability: checkApplicabilityAsParentFolder,
  });

  const { data: subFolders } = useFetch({
    func: getAllApplicableFilesInFolder,
    defaultValue: [],
  });

  const { activityCanvasesGrouped } = useMemo(() => {
    return subFolders.reduce<{
      activityCanvasesGrouped: ReactNode[],
      activityCanvasIdsDeprecated: string[],
      __byDateFolderCount: Partial<Record<string, number>>,
    }>(
      (acc, folder, i) => {
        const folderDate = folder.meta.yyyyMmDd;
        const thisDateCnt = acc.__byDateFolderCount[folderDate] ?? NaN;
        if (Number.isNaN(thisDateCnt)) {
          acc.__byDateFolderCount[folderDate] = 0;
        }
        const folderId = `${folderDate}-${(thisDateCnt || 0) + 1}`;
        acc.__byDateFolderCount[folderDate] = (thisDateCnt || 0) + 1;
        const activityId = `activity-${folderId}`;
        const folderSrc = folder.path;
        const folderName = folder.name.trim();
        const canvasActivityProps: CanvasActivityProps = {
          fileNamePathToDateInfo: imageFileToDateInfoForActivity,
          ...canvasOptions,
          folderSrc,
          ignoredExtensions,
          limitToTwoPerPage:
            pageAdjust.foldersLimitToTwoPhotosPerPage.includes(folderName),
          lastPageSplitToTwo:
            pageAdjust.foldersWithLastPageToSplitToTwo.includes(folderName),
          exportOptions,
          exportUniqueId: activityId,
          onCanvasIdsUpdate: (ids) => {
            setCanvasIdsByActivity((curIds) => {
              const curList = curIds[i];
              if (
                Array.isArray(curList) &&
                curList.length === curIds.length &&
                !curList.find((id) => !ids.includes(id)) &&
                !ids.find((id) => !curList.includes(id))
              ) {
                return curIds;
              }
              const list = [...curIds];
              list[i] = ids;
              return list;
            });
          },
        };
        const ActivityCanvasRendered = (
          <CanvasActivity key={folderId} {...canvasActivityProps} />
        );
        acc.activityCanvasIdsDeprecated.push(activityId);
        acc.activityCanvasesGrouped.push(ActivityCanvasRendered);
        return acc;
      },
      {
        activityCanvasesGrouped: [],
        activityCanvasIdsDeprecated: [],
        __byDateFolderCount: {},
      },
    );
  }, [
    canvasOptions,
    exportOptions,
    ignoredExtensions,
    pageAdjust.foldersLimitToTwoPhotosPerPage,
    pageAdjust.foldersWithLastPageToSplitToTwo,
    subFolders,
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
    [activityCanvasesGrouped, activityCanvasIds],
  );

  return output;
}

export { useAvtivityPages };
