import { useMemo } from 'react';

import { useCanvasBaseAndDim } from '../canvasBaseAndDim';
import { canvasSizeProps } from './configs/base';

import { useCalPages } from './canvasEffects/calendar';
import { useAvtivityPages } from './canvasEffects/activity';

import type { CanvasToImageExportOptions } from './types';

function useCanvasMulti(props: { exportOptions: CanvasToImageExportOptions }) {
  const { renderCanvas: renderBlankCanvas } = useCanvasBaseAndDim({
    ...props,
    noExport: true,
    exportUniqueId: 'blank',
    ...canvasSizeProps,
  });
  // ---- Calendar Canvas ----
  const { calCanvases, calCanvasIds, calCanvasExports } = useCalPages(props);
  const { activityCanvasesGrouped, activityCanvasIds, activityCanvasExports } =
    useAvtivityPages(props);

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
