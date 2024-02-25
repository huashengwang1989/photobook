import type {
  CommonPropsForImageFiles,
  CommonPropsForCanvasSize,
  FileEntry,
  CanvasToImageExportOptions,
} from '../canvasCommon/types';

import type { MetaInfoTypeBase } from './types.config';
import type {
  FileMeta,
  FileInfoWithMeta,
  ImageFileToDateInfo,
} from './types.file';

type Props<MetaInfoType extends MetaInfoTypeBase = MetaInfoTypeBase> =
  CommonPropsForImageFiles &
    CommonPropsForCanvasSize & {
      fileNamePathToDateInfo: ImageFileToDateInfo,
      exportUniqueId: string,
      exportOptions: CanvasToImageExportOptions,
      metaInfoTypes?: MetaInfoType[],
      // Adjust photo arrangement for next pages (pages after first page with meta)
      limitToTwoPerPage?: boolean,
      lastPageSplitToTwo?: boolean,
      onCanvasIdsUpdate?: (ids: string[]) => void,
      onCanvasExportHandlersUpdate?: (exports: (() => void)[]) => void,
    };

export type {
  FileEntry,
  FileMeta,
  FileInfoWithMeta,
  ImageFileToDateInfo,
  MetaInfoTypeBase,
  Props,
};
