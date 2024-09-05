import { useCallback, useMemo } from 'react';
import { useFetch } from '@/utils/hooks/useFetch';
import { useImageFileSrcCommon } from '../canvasCommon/fileSrc';

import {
  fileNamePathToDateInfo as imageFileToDateInfoForActivity,
  activityFolderNameToDateInfo,
} from '../CanvasMulti/configs/activity';
import { allocPhotoFilesByPage } from './helpers/photo';

import type { DataHookProps, FileEntry, FileInfoWithMeta } from './types';

const checkApplicabilityAsParentFolder = (f: FileEntry) =>
  Boolean(f.children && f.path);

function useActivitiesData(props: DataHookProps) {
  const { baseFolder, ignoredExtensions, pageAdjust } = props;
  const { getAllApplicableFilesInFolder: getAllApplicableSubFolders } =
    useImageFileSrcCommon({
      folderSrc: baseFolder,
      preventRecursiveCheck: true,
      ignoredExtensions,
      customMetaGeneration: activityFolderNameToDateInfo,
      checkFileApplicability: checkApplicabilityAsParentFolder,
    });

  const { data: subFolders } = useFetch({
    func: getAllApplicableSubFolders,
    defaultValue: [],
  });

  const { getAllApplicableFilesInFolder } = useImageFileSrcCommon({
    folderSrc: '', // Must pass value to getAllApplicableFilesInFolder
    supportedExtensions: undefined, // if specified, please include "md"
    ignoredExtensions,
    checkFileApplicability: undefined,
    // As filename is random, please use parent folder from path to generate it.
    customMetaGeneration: imageFileToDateInfoForActivity,
  });

  const getAllFilesForAllSubfolders = useCallback(async () => {
    if (!subFolders.length) {
      return [];
    }
    const reses = await Promise.all(
      subFolders.map((subFolder) =>
        getAllApplicableFilesInFolder(subFolder.path),
      ),
    );
    return reses.map((res, i) => ({
      files: res,
      folder: subFolders[i],
    }));
  }, [getAllApplicableFilesInFolder, subFolders]);

  const { data: photoAndMetaFileDataForAllActivities } = useFetch({
    func: getAllFilesForAllSubfolders,
    defaultValue: [],
  });

  const activitiesPhotoAndMetaFileData = useMemo(() => {
    return photoAndMetaFileDataForAllActivities.map(({ files, folder }) =>
      files.reduce(
        (acc, f) => {
          if (f.meta.type === 'meta') {
            acc.metaFile = f;
          } else {
            acc.photoFiles.push(f);
          }
          return acc;
        },
        {
          photoFiles: [] as FileInfoWithMeta[],
          metaFile: null as FileInfoWithMeta | null,
          folder,
        },
      ),
    );
  }, [photoAndMetaFileDataForAllActivities]);

  const allActivitiesPhotoFilesByPage = useMemo(() => {
    return activitiesPhotoAndMetaFileData.map(
      ({ folder, photoFiles, metaFile }) => {
        const folderName = folder.name.trim();

        const photoFilesSplitToPages = allocPhotoFilesByPage({
          files: photoFiles,
          log: undefined, // logTitle,
          limitToTwoPerPage:
            pageAdjust.foldersLimitToTwoPhotosPerPage.includes(folderName),
          lastPageSplitToTwo:
            pageAdjust.foldersWithLastPageToSplitToTwo.includes(folderName),
        });

        return {
          folder,
          photoFiles,
          metaFile,
          photoFilesSplitToPages,
        };
      },
    );
  }, [
    activitiesPhotoAndMetaFileData,
    pageAdjust.foldersLimitToTwoPhotosPerPage,
    pageAdjust.foldersWithLastPageToSplitToTwo,
  ]);

  const output = useMemo(
    () => ({
      folders: subFolders,
      allActivitiesPhotoFilesByPage,
    }),
    [allActivitiesPhotoFilesByPage, subFolders],
  );

  return output;
}

export { useActivitiesData };
