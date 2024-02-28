import { dd } from '@/utils/num/dd';

import type { ImageFileToDateInfo, FileMeta } from '../../CanvasActivity/types';

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

export { fileNamePathToDateInfo, activityFolderNameToDateInfo };
