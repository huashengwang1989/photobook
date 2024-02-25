import { useMemo, useState, type ReactNode } from 'react';

import { useFetch } from '@/utils/hooks/useFetch';

import { useImageFileSrcCommon } from '../../canvasCommon/fileSrc';
import CanvasActivity from '../../CanvasActivity';

import {
  fileNamePathToDateInfo as imageFileToDateInfoForActivity,
  activityFolderNameToDateInfo,
  foldersLimitToTwoPhotosPerPage,
  foldersWithLastPageToSplitToTwo,
} from '../configs/activity';

import { canvasSizeProps, folderBaseSrcForActivity } from '../configs/base';

import type {
  CanvasActivityProps,
  FileEntry,
  CanvasToImageExportOptions,
} from '../types';

const commonCanvasActivityProps: Omit<
  CanvasActivityProps,
  // eslint-disable-next-line prettier/prettier
  'folderSrc' | 'exportUniqueId' | 'exportOptions'
> = {
  fileNamePathToDateInfo: imageFileToDateInfoForActivity,
  ...canvasSizeProps,
};

const checkApplicabilityAsParentFolder = (f: FileEntry) =>
  Boolean(f.children && f.path);

function useAvtivityPages(props: {
  exportOptions: CanvasToImageExportOptions,
}) {
  const { exportOptions } = props;

  const [canvasIdsByActivity, setCanvasIdsByActivity] = useState<string[][]>(
    [],
  );

  const [exportsByActivity, setExportsByActivity] = useState<(() => void)[][]>(
    [],
  );

  const { getAllApplicableFilesInFolder } = useImageFileSrcCommon({
    folderSrc: folderBaseSrcForActivity,
    preventRecursiveCheck: true,
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
          ...commonCanvasActivityProps,
          folderSrc,
          limitToTwoPerPage:
            foldersLimitToTwoPhotosPerPage.includes(folderName),
          lastPageSplitToTwo:
            foldersWithLastPageToSplitToTwo.includes(folderName),
          exportOptions,
          exportUniqueId: activityId,
          onCanvasExportHandlersUpdate: (exports) => {
            setExportsByActivity((curExports) => {
              const list = [...curExports];
              list[i] = exports;
              return list;
            });
          },
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
  }, [exportOptions, subFolders]);

  const activityCanvasIds = useMemo(() => {
    return ([] as string[]).concat(
      ...canvasIdsByActivity.filter((ids) => Array.isArray(ids)),
    );
  }, [canvasIdsByActivity]);

  const activityCanvasExports = useMemo(() => {
    return ([] as (() => void)[]).concat(
      ...exportsByActivity.filter((exports) => Array.isArray(exports)),
    );
  }, [exportsByActivity]);

  const output = useMemo(
    () => ({
      activityCanvasesGrouped,
      activityCanvasIds,
      activityCanvasExports,
    }),
    [activityCanvasesGrouped, activityCanvasIds, activityCanvasExports],
  );

  return output;
}

export { useAvtivityPages };
