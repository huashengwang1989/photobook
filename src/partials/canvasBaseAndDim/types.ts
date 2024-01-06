import type {
  CommonPropsForCanvasSize,
  CanvasToImageExportOptions,
  FileEntry,
} from '../canvasCommon/types';

type Props = CommonPropsForCanvasSize & {
  exportOptions: CanvasToImageExportOptions,
  exportUniqueId: string,
};

export type { FileEntry, Props };
