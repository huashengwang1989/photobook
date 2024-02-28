import { useMemo, useState } from 'react';

import { useCanvasBaseAndDim } from '../canvasBaseAndDim';

import { useCalPages } from './canvasEffects/calendar';
import { useAvtivityPages } from './canvasEffects/activity';

import type { MergedConfigs } from './types';

const defaultIgnoredExtensions: string[] = [];

function useCanvasMulti(props: { project: MergedConfigs }) {
  const { project } = props;

  const { exportOptions, canvasOptions } = project;

  // TODO: future to sync status
  const [exportingCanvasIds] = useState<string[]>([]);

  const mergedExportOptions = useMemo(
    () => ({
      ...exportOptions,
      exportingCanvasIds,
    }),
    [exportOptions, exportingCanvasIds],
  );

  const { renderCanvas: renderBlankCanvas } = useCanvasBaseAndDim({
    exportOptions: mergedExportOptions,
    noExport: true,
    exportUniqueId: 'blank',
    ...canvasOptions,
  });
  // ---- Calendar Canvas ----
  const { calCanvases, calCanvasIds, calCanvasExports } = useCalPages({
    exportOptions: mergedExportOptions,
    baseFolder: project.baseFolders.calendar,
    ignoredExtensions: project.ignoreFileExtensions || defaultIgnoredExtensions,
    canvasOptions: project.canvasOptions,
    calendarConfigs: project.pageConfig.calendar,
  });
  const { activityCanvasesGrouped, activityCanvasIds, activityCanvasExports } =
    useAvtivityPages({
      exportOptions: mergedExportOptions,
      baseFolder: project.baseFolders.activity,
      ignoredExtensions:
        project.ignoreFileExtensions || defaultIgnoredExtensions,
      canvasOptions: project.canvasOptions,
      pageAdjust: project.pageAdjust.activity,
    });

  const BlankCanvas = useMemo(
    () => renderBlankCanvas({ children: null }).canvas,
    [renderBlankCanvas],
  );

  const CanvasMultiRendered = useMemo(() => {
    return (
      <div className={'canvas-container flex flex-wrap justify-center'}>
        {BlankCanvas}
        {calCanvases}
        {activityCanvasesGrouped}
      </div>
    );
  }, [BlankCanvas, activityCanvasesGrouped, calCanvases]);

  const output = useMemo(
    () => ({
      CanvasMultiRendered,
      calendarCanvasIds: calCanvasIds,
      activityCanvasIds,
      calCanvasExports,
      activityCanvasExports,
    }),
    [
      CanvasMultiRendered,
      activityCanvasExports,
      activityCanvasIds,
      calCanvasExports,
      calCanvasIds,
    ],
  );

  return output;
}

export { useCanvasMulti };
