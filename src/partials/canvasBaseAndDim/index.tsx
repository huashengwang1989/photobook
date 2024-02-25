import { useMemo, useCallback, useState } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useCanvasSizeCommon } from '../canvasCommon';
import { exportCanvasToImage } from '../canvasCommon/exportToImage';
import { commonClasses } from './constants';

import type { ReactNode } from 'react';
import type { Props } from './types';

function useCanvasBaseAndDim(props: Props) {
  const {
    canvasDimensionCm,
    bleedingCm,
    contentPaddingCm,
    // Export
    noExport,
    exportUniqueId,
    exportOptions,
  } = props;

  const [exportingCanvasIds, setExportingCanvasIds] = useState<string[]>(
    exportOptions.exportingCanvasIds,
  );

  const { canvasDimensions } = useCanvasSizeCommon({
    canvasDimensionCm,
    bleedingCm,
    contentPaddingCm,
  });

  const BleedingMark = useMemo(() => {
    const s = canvasDimensions;
    const p = s.bleedingPaddings;
    if (
      (exportingCanvasIds &&
        (!exportOptions.inclBleedingArea ||
          !exportOptions.inclBleedingMarks)) ||
      (!p[0] && !p[1] && p[2] && !p[3])
    ) {
      return null;
    }
    // -1 for the border-width
    const pStr = p.map((n) => (n > 1 ? `${n - 1}px` : 0)).join(' ');
    const normP = (p: number, minus?: number) =>
      p > (minus || 1) ? p - (minus || 1) : 0;
    const genMarkStyle = (wIdx: number, hIdx: number) => ({
      width: normP(p[wIdx]),
      height: normP(p[hIdx]),
    });
    const commonClsMark = clsx(`absolute border-slate-900`);
    const genMarkLineStyle = (wIdx: number, hIdx: number) => ({
      width: Math.min(normP(p[wIdx], 3), 20),
      height: Math.min(normP(p[hIdx], 3), 20),
    });
    const TopLeftMark = (
      <div className={`absolute left-0 top-0`} style={genMarkStyle(3, 0)}>
        <div
          className={`${commonClsMark} bottom-0 right-0 border-b-[1px] border-r-[1px]`}
          style={genMarkLineStyle(3, 0)}
        ></div>
      </div>
    );
    const TopRightMark = (
      <div className={`absolute right-0 top-0`} style={genMarkStyle(1, 0)}>
        <div
          className={`${commonClsMark} bottom-0 left-0 border-b-[1px] border-l-[1px]`}
          style={genMarkLineStyle(1, 0)}
        ></div>
      </div>
    );
    const BottomRightMark = (
      <div className={`absolute bottom-0 right-0`} style={genMarkStyle(1, 2)}>
        <div
          className={`${commonClsMark} left-0 top-0 border-l-[1px] border-t-[1px]`}
          style={genMarkLineStyle(1, 2)}
        ></div>
      </div>
    );
    const BottomLeftMark = (
      <div className={`absolute bottom-0 left-0`} style={genMarkStyle(3, 2)}>
        <div
          className={`${commonClsMark} right-0 top-0 border-r-[1px] border-t-[1px]`}
          style={genMarkLineStyle(3, 2)}
        ></div>
      </div>
    );
    const CenterBlockMark = (
      <div
        className={clsx(
          `absolute left-0 top-0 border-[1px] border-slate-200`,
          commonClasses.BLEEDING_MARK_ASSIST_SQUARE_CLS,
        )}
        style={{ margin: pStr, width: s.canvasWidth, height: s.canvasHeight }}
      />
    );
    return (
      <div
        className={clsx(
          'pointer-events-none absolute left-0 top-0 z-20',
          commonClasses.BLEEDING_MARK_WRAPPER_CLS,
        )}
        style={{ width: s.width, height: s.height }}
        aria-hidden
      >
        {TopLeftMark}
        {TopRightMark}
        {BottomLeftMark}
        {BottomRightMark}
        {!exportingCanvasIds ? CenterBlockMark : null}
      </div>
    );
  }, [
    canvasDimensions,
    exportOptions.inclBleedingArea,
    exportOptions.inclBleedingMarks,
    exportingCanvasIds,
  ]);

  const handleExport = useCallback(
    (exportId: string) => {
      exportCanvasToImage(exportId, {
        exportOptions,
        exportStartCallback: () => {
          setExportingCanvasIds((curList) => {
            return curList.includes(exportId)
              ? curList
              : [...curList, exportId];
          });
        },
        exportEndCallback: (err) => {
          setExportingCanvasIds((curList) => {
            return curList.includes(exportId)
              ? curList.filter((id) => id !== exportId)
              : curList;
          });
          if (err) {
            console.error('Error export image', err);
          }
        },
      });
    },
    [exportOptions],
  );

  const renderExportButton = useCallback(
    (exportId: string) => {
      const isExporting = exportingCanvasIds.includes(exportId);
      const onClick = () => handleExport(exportId);
      const cls = clsx(
        'radui absolute right-0 top-0 ml-1 origin-bottom translate-y-[-2rem] rounded-sm border-slate-800 bg-white p-1 text-sm shadow-sm hover:border-lime-600 hover:bg-lime-100 disabled:bg-slate-400 disabled:text-slate-600 dark:border-slate-300 dark:disabled:bg-slate-500 dark:disabled:text-slate-400',
      );
      return (
        <button className={cls} disabled={isExporting} onClick={onClick}>
          <FontAwesomeIcon
            className={clsx('mr-1 animate-spin', {
              hidden: !isExporting,
            })}
            icon={faSpinner}
          />
          Export Image
        </button>
      );
    },
    [exportingCanvasIds, handleExport],
  );

  // Canvas is done with absolute position.
  // Tailwind CSS will be ineffective inside.
  const renderCanvas = useCallback(
    (options: { children: ReactNode, key?: string, idAppend?: string }) => {
      const { idAppend } = options;
      const s = canvasDimensions;
      const padding = s.bleedingPaddings
        .map((n) => (n ? `${n}px` : 0))
        .join(' ');

      const wrapperCls = clsx(commonClasses.CANVAS, `relative bg-white`, {
        'shadow-md': !exportingCanvasIds,
      });
      const canvasId = idAppend
        ? `${exportUniqueId}-${idAppend}`
        : exportUniqueId;
      const CanvasRendered = (
        <div className="relative m-5" id={canvasId} key={options.key}>
          {/** Canvas with bleeding */}
          <div
            className={wrapperCls}
            style={{
              width: s.width,
              height: s.height,
              padding,
            }}
          >
            {/** Bleeding Mark */}
            {BleedingMark}
            {/** Content */}
            <div
              className={clsx(commonClasses.CANVAS_CONTENT)}
              style={{
                width: s.canvasWidth,
                height: s.canvasHeight,
                // Future: borderless option
                padding: s.contentPadding,
              }}
            >
              {options.children}
            </div>
          </div>
          {!noExport && renderExportButton(canvasId)}
        </div>
      );
      return {
        canvas: CanvasRendered,
        canvasId,
        exportCanvas: () => handleExport(canvasId),
      };
    },
    [
      BleedingMark,
      canvasDimensions,
      exportUniqueId,
      exportingCanvasIds,
      handleExport,
      noExport,
      renderExportButton,
    ],
  );

  const output = useMemo(
    () => ({
      renderCanvas,
      canvasDimensions,
    }),
    [renderCanvas, canvasDimensions],
  );

  return output;
}

export { useCanvasBaseAndDim };
