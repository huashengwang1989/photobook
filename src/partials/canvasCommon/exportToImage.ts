import { save } from '@tauri-apps/api/dialog';
import { writeBinaryFile } from '@tauri-apps/api/fs';
import { pictureDir } from '@tauri-apps/api/path';

import { generateImageDataUrl } from '@/utils/image/toImageWithCanvas';
import { sleep } from '@/utils/promise/sleep';
import { commonClasses } from './constants';

import type { CanvasToImageExportOptions } from './types';

type ExportMergedOptions = {
  exportOptions: Omit<CanvasToImageExportOptions, 'exportingCanvasIds'>,
  exportStartCallback: () => void,
  exportEndCallback: (error: Error | undefined, dataUrl: string) => void,
};

const saveImage = async (dataUrl: string, suggestedFilename: string) => {
  const filePath = await save({
    title: 'Export Image',
    defaultPath: (await pictureDir()) + '/' + suggestedFilename,
  });
  if (!filePath) {
    throw new Error('no-save-file-path');
  }
  const file = await fetch(dataUrl).then((r) => r.arrayBuffer());
  return await writeBinaryFile(filePath, file);
};

const saveImages = async (
  files: { dataUrl: string, suggestedFilename: string }[],
  options?: {
    onProgress?: (progress: number) => void,
  },
) => {
  const { onProgress } = options || {};
  const filePath = await save({
    title: 'Export Image',
    defaultPath: (await pictureDir()) + '/',
  });
  if (!filePath) {
    throw new Error('no-save-file-path');
  }
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const file = await fetch(f.dataUrl).then((r) => r.arrayBuffer());
    onProgress?.((i + 0.5) / files.length);
    await writeBinaryFile(filePath + f.suggestedFilename, file);
    onProgress?.((i + 1) / files.length);
  }
  return;
};

const getDomToExport = (
  id: string,
  exportOptions: ExportMergedOptions['exportOptions'],
) => {
  const mainDom = document.getElementById(id);
  if (!mainDom) {
    return null;
  }
  if (!exportOptions.inclBleedingArea) {
    return mainDom.querySelector(
      `.${commonClasses.CANVAS_CONTENT}`,
    ) as HTMLElement | null;
  }
  if (mainDom.classList.contains(commonClasses.CANVAS)) {
    return mainDom;
  }
  return mainDom.querySelector(
    `.${commonClasses.CANVAS}`,
  ) as HTMLElement | null;
};

const getTargetDomToImageExportNeccessasities = async (
  id: string,
  targetDom: HTMLElement,
  options: ExportMergedOptions,
) => {
  const { exportOptions, exportEndCallback } = options;

  let dataUrl = '';
  try {
    dataUrl = await generateImageDataUrl(targetDom, {
      format: exportOptions.exportFormat,
      dpi: exportOptions.targetDpi,
    });
  } catch (error) {
    const err =
      (error as Error | undefined) || new Error('unknown-error-image-gen');
    exportEndCallback(err, dataUrl);
  }
  if (!dataUrl) {
    throw new Error('no-data-url');
  }
  const suggestedFilenameBase = id;

  const filenameAppend = (() => {
    const { inclBleedingMarks, inclBleedingArea, targetDpi } = exportOptions;
    if (!inclBleedingArea && targetDpi === 300) {
      return;
    }
    return [
      targetDpi,
      inclBleedingArea ? 'b' : '',
      inclBleedingMarks ? 'm' : '',
    ]
      .filter((s) => s)
      .join('_');
  })();

  const suggestedFilename = filenameAppend
    ? `${suggestedFilenameBase}_${filenameAppend}`
    : suggestedFilenameBase;

  return {
    dataUrl,
    suggestedFilename,
  };
};

async function exportCanvasToImage(id: string, options: ExportMergedOptions) {
  const { exportOptions, exportStartCallback, exportEndCallback } = options;
  const targetDom = getDomToExport(id, exportOptions);

  if (!targetDom) {
    throw new Error('no-dom-found');
  }

  exportStartCallback();

  await sleep(100);

  const { dataUrl, suggestedFilename } =
    await getTargetDomToImageExportNeccessasities(id, targetDom, options);

  try {
    const res = await saveImage(
      dataUrl,
      `${suggestedFilename}.${exportOptions.exportFormat}`,
    );
    exportEndCallback(undefined, dataUrl);
    return res;
  } catch (error) {
    const err =
      (error as Error | undefined) || new Error('unknown-error-export');
    exportEndCallback(err, dataUrl);
    return;
  }
}

async function exportMultipleCanvasesToImages(
  ids: string[],
  options: ExportMergedOptions & {
    onExportIntermediateCallback: (options: {
      progress: number,
      stage: 'dom' | 'dataUrl' | 'save',
    }) => void,
  },
) {
  const {
    exportOptions,
    exportStartCallback,
    exportEndCallback,
    onExportIntermediateCallback,
  } = options;

  exportStartCallback();

  type DomAndId = {
    dom: HTMLElement,
    id: string,
  };
  const domAndIds = ids.reduce<DomAndId[]>((acc, id) => {
    const dom = getDomToExport(id, exportOptions);
    if (!dom) {
      return acc;
    }
    acc.push({ dom, id });
    return acc;
  }, []);
  onExportIntermediateCallback({ progress: 1, stage: 'dom' });
  await sleep(100);

  type F = { dataUrl: string, suggestedFilename: string };
  const files: F[] = [];
  for (let i = 0; i < domAndIds.length; i++) {
    const { dom, id } = domAndIds[i];
    const f = await getTargetDomToImageExportNeccessasities(id, dom, options);
    files.push({
      ...f,
      // For multi-image export, have to add the extension behind
      suggestedFilename: `${f.suggestedFilename}.${exportOptions.exportFormat}`,
    });
    onExportIntermediateCallback({
      progress: (i + 1) / domAndIds.length,
      stage: 'dataUrl',
    });
  }

  try {
    const res = await saveImages(files, {
      onProgress: (pgs) =>
        onExportIntermediateCallback({ progress: pgs, stage: 'save' }),
    });
    exportEndCallback(undefined, ''); // TODO
    return res;
  } catch (error) {
    const err =
      (error as Error | undefined) || new Error('unknown-error-export');
    exportEndCallback(err, ''); // TODO
    return;
  }
}

export { exportCanvasToImage, exportMultipleCanvasesToImages };
