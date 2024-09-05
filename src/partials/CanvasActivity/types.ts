import type {
  FileEntry,
  CanvasToImageExportOptions,
} from '../canvasCommon/types';

import type { CanvasOptions, ActivityPageAdjust } from '../../projects/types';

import type { MetaInfoTypeBase } from './types.config';
import type {
  FileMeta,
  FileInfoWithMeta,
  ImageFileToDateInfo,
} from './types.file';

type DataHookProps = {
  baseFolder: string,
  ignoredExtensions: string[],
  pageAdjust: ActivityPageAdjust,
};

type FistPageWithMetaProps<T extends MetaInfoTypeBase = MetaInfoTypeBase> = {
  canvasOptions: CanvasOptions,
  themeColor?: string,
  themeClassName?: string,
  underMetaPhotos: FileInfoWithMeta[],
  metaFile?: FileInfoWithMeta | null,
  metaInfoTypes?: T[],
  hasNextPages: boolean,
  exportOptions: CanvasToImageExportOptions,
  exportUniqueId: string,
  onCanvasIdUpdate?: (id: string) => void,
  onCanvasExportHandlerUpdate?: (exp: () => void) => void,
};

type NextPageProps = {
  canvasOptions: CanvasOptions,
  nextPagePhotos: FileInfoWithMeta[],
  nextPageIndex: number,
  exportOptions: CanvasToImageExportOptions,
  exportUniqueId: string,
  onCanvasIdUpdate?: (id: string) => void,
  onCanvasExportHandlerUpdate?: (exp: () => void) => void,
};

export type {
  CanvasOptions,
  FileEntry,
  FileMeta,
  FileInfoWithMeta,
  ImageFileToDateInfo,
  MetaInfoTypeBase,
  CanvasToImageExportOptions,
  // Props
  DataHookProps,
  FistPageWithMetaProps,
  NextPageProps,
};
