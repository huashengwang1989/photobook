import { useCallback, useMemo } from 'react';
import { readDir } from '@tauri-apps/api/fs';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { getExtensionFromSrc } from '@/utils/file/extension';

import type {
  FileEntryWithMeta,
  CommonPropsForImageFilesWithMeta as Props,
} from './types';

function useImageFileSrcCommon<Meta extends Record<string, unknown>>(
  props: Props<Meta>,
) {
  const {
    folderSrc,
    supportedExtensions,
    checkFileApplicability,
    customMetaGeneration,
  } = props;
  const normalisedSupportedExtensions = useMemo(() => {
    if (!supportedExtensions?.length) {
      return undefined;
    }
    return supportedExtensions.reduce(
      (acc, ext) => {
        const normalisedExt = ext.split('.')?.pop()?.toLocaleLowerCase() || '';
        acc[normalisedExt] = true;
        return acc;
      },
      {} as Partial<Record<string, true>>,
    );
  }, [supportedExtensions]);

  const getAllApplicableFilesInFolder = useCallback(async () => {
    if (!folderSrc) {
      return [];
    }
    const fileEntries = await readDir(folderSrc, {
      dir: undefined,
      recursive: true,
    });
    return fileEntries.reduce<FileEntryWithMeta<Meta>[]>((acc, file) => {
      if (!file.name || !file.path) {
        return acc;
      }
      // If checkFileApplicability is not specified,
      // ignore the check.
      const isApplicable =
        !checkFileApplicability || checkFileApplicability(file);
      if (!isApplicable) {
        return acc;
      }
      // If not specified any, normalisedSupportedExtensions is undefined.
      // In this case, ignore the file extension check.
      if (normalisedSupportedExtensions) {
        const ext = getExtensionFromSrc(file.path);
        const isExtApplicable = normalisedSupportedExtensions[ext];
        if (!isExtApplicable) {
          return acc;
        }
      }
      // All checks passed. Let's do some treatment and generate meta.
      const f = file as Record<'path' | 'name', string>;
      const meta = customMetaGeneration(f);
      const fileWithMeta: FileEntryWithMeta<Meta> = {
        ...f,
        assetUrl: convertFileSrc(file.path),
        meta,
      };
      acc.push(fileWithMeta);
      return acc;
    }, []);
  }, [
    checkFileApplicability,
    customMetaGeneration,
    folderSrc,
    normalisedSupportedExtensions,
  ]);

  const output = useMemo(
    () => ({ getAllApplicableFilesInFolder }),
    [getAllApplicableFilesInFolder],
  );

  return output;
}

export { useImageFileSrcCommon };
