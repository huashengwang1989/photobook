import type { FileEntry } from '@tauri-apps/api/fs';

type CommonPropsForImageFiles = {
  folderSrc: string,
  preventRecursiveCheck?: boolean,
  checkFileApplicability?: (file: FileEntry) => boolean,
  supportedExtensions?: string[],
  // Not setting optional here to avoid missed out handlings at other places. Feed in [] as default
  ignoredExtensions: string[],
};

type CommonPropsForImageFilesWithMeta<Meta extends Record<string, unknown>> =
  CommonPropsForImageFiles & {
    customMetaGeneration: CustomMetaGeneration<Meta>,
  };

/** Props with "Cm" refers to numerical values as centimeter. */
type CommonPropsForCanvasSize = {
  /**
   * Dimension NOT including bleeding. It refers to the actual product page's
   * dimension. Unit: centimeter
   */
  canvasDimensionCm: [number, number],
  /**
   * Top, Right, Bottom, Left. This portal should be cut out in production.
   * Unit: centimeter
   */
  bleedingCm: [number, number, number, number],
  /** This is the additional padding for visual style. Unit: centimeter */
  contentPaddingCm: number,
};

/** Return undefined if invalid */
type CustomMetaGeneration<Meta extends Record<string, unknown>> = (
  file: Record<'path' | 'name', string>,
) => Meta | undefined;

type FileEntryWithMeta<Meta extends Record<string, unknown>> = {
  path: string,
  name: string,
  assetUrl: string,
  meta: Meta,
};

type ImageExportFormat = 'jpg' | 'png';

type CanvasToImageExportOptions = {
  /**
   * Some styles will be off when it is to export, e.g. shadows., and square to
   * mark the boundary.
   */
  exportingCanvasIds: string[],
  inclBleedingArea: boolean,
  /** Only applicable wieh inclBleedingArea is true */
  inclBleedingMarks: boolean,
  /** Default 300 */
  targetDpi: number,
  /** Default jpg */
  exportFormat: ImageExportFormat,
};

export type {
  CommonPropsForImageFiles,
  CommonPropsForImageFilesWithMeta,
  CommonPropsForCanvasSize,
  CustomMetaGeneration,
  FileEntry,
  FileEntryWithMeta,
  CanvasToImageExportOptions,
  ImageExportFormat,
};
