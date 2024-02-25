import { dd } from '@/utils/num/dd';
import type { ImageFileToDateInfo, FileMeta } from '../../CanvasActivity/types';

const foldersLimitToTwoPhotosPerPage: string[] = [
  '2023_09_27 Growth Activity - 探索颜料 [Fang Jing]',
  '2023_10_10 Growth Activity - 儿歌-我爱我的动物 [Fang Jing]',
];

const foldersWithLastPageToSplitToTwo: string[] = [
  '2023_10_24 Growth Activity - 探索声音 [Fang Jing]',
];

const folderNameToMeta = (
  parentFolderName: string,
): Omit<FileMeta, 'type'> | undefined => {
  const [, yyyy, mmRaw, ddRaw] =
    parentFolderName.match(
      /([0-9]{4})[_\-/]?([0-9]{1,2})[_\-/]?([0-9]{1,2})/,
    ) || [];

  if (!yyyy || !mmRaw || !ddRaw) {
    return undefined; // INVALID
  }

  return {
    yyyyMmDd: `${yyyy}${dd(mmRaw)}${dd(ddRaw)}`,
  };
};

const fileNamePathToDateInfo: ImageFileToDateInfo = (file) => {
  const pathsSplit = file.path.split(/[/\\]/);
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  if (!fileExt) {
    return undefined; // INVALID
  }
  const type: FileMeta['type'] = fileExt === 'md' ? 'meta' : 'photo';

  const parentFolderName = pathsSplit[pathsSplit.length - 2] || '';

  const metaBase = folderNameToMeta(parentFolderName);
  if (!metaBase) {
    return undefined; // INVALID
  }

  return {
    ...metaBase,
    type,
  };
};

const activityFolderNameToDateInfo: ImageFileToDateInfo = (file) => {
  const metaBase = folderNameToMeta(file.name);
  if (!metaBase) {
    return undefined; // INVALID
  }

  return {
    ...metaBase,
    type: 'folder',
  };
};

export {
  fileNamePathToDateInfo,
  activityFolderNameToDateInfo,
  foldersLimitToTwoPhotosPerPage,
  foldersWithLastPageToSplitToTwo,
};
