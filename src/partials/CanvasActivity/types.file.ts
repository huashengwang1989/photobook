import type {
  CustomMetaGeneration,
  FileEntryWithMeta,
} from '../canvasCommon/types';

type FileMeta = {
  yyyyMmDd: string,
  type: 'photo' | 'meta' | 'folder',
};
type ImageFileToDateInfo = CustomMetaGeneration<FileMeta>;
type FileInfoWithMeta = FileEntryWithMeta<FileMeta>;

export type { FileMeta, FileInfoWithMeta, ImageFileToDateInfo };
