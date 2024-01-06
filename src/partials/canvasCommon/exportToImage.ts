import { save } from '@tauri-apps/api/dialog';
import { writeBinaryFile } from '@tauri-apps/api/fs';
import { pictureDir } from '@tauri-apps/api/path';

import { generateImageDataUrl } from '@/utils/image/toImageWithCanvas';
import { sleep } from '@/utils/promise/sleep';
import { commonClasses } from './constants';

import type { CanvasToImageExportOptions } from './types';

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

async function exportCanvasToImage(
  type: 'calender' | 'collage',
  id: string,
  options: {
    exportOptions: Omit<CanvasToImageExportOptions, 'isToExport'>,
    exportStartCallback: () => void,
    exportEndCallback: (error: Error | undefined, dataUrl: string) => void,
  },
) {
  const { exportOptions, exportStartCallback, exportEndCallback } = options;
  const mainDom = document.getElementById(id);
  const targetDom = (() => {
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
  })();

  if (!targetDom) {
    throw new Error('no-dom-found');
  }

  exportStartCallback();

  await sleep(100);

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
    return;
  }
  if (!dataUrl) {
    throw new Error('no-data-url');
  }
  const suggestedFilenameBase = `${type}-${id}`;

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

export { exportCanvasToImage };
