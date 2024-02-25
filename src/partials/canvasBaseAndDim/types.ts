import type {
  CommonPropsForCanvasSize,
  CanvasToImageExportOptions,
  FileEntry,
} from '../canvasCommon/types';

type Props = CommonPropsForCanvasSize & {
  noExport?: boolean,
  exportOptions: CanvasToImageExportOptions,
  exportUniqueId: string,
};

export type { FileEntry, Props };
