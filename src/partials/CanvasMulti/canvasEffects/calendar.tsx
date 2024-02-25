import { useMemo, useState, type ReactNode } from 'react';

import { dd } from '@/utils/num/dd';

import CanvasCal from '../../CanvasCalendar';
import {
  year,
  monthsForPages,
  imageFileToDateInfo as imageFileToDateInfoForCal,
  specialDaysByYyyyMmDd,
} from '../configs/calendar';

import { canvasSizeProps, folderBaseSrcForCal } from '../configs/base';

import type { CanvasCalProps, CanvasToImageExportOptions } from '../types';

const commonCanvasCalProps: Omit<
  CanvasCalProps,
  // eslint-disable-next-line prettier/prettier
'folderSrc' | 'targetMonth' | 'exportUniqueId' | 'exportOptions'
> = {
  firstColumn: 'Sun',
  imageFileToDateInfo: imageFileToDateInfoForCal,
  targetYear: year,
  specialDaysByYyyyMmDd,
  ...canvasSizeProps,
};

function useCalPages(props: { exportOptions: CanvasToImageExportOptions }) {
  const { exportOptions } = props;

  const [exportsByMonth, setExportsByMonth] = useState<(() => void)[][]>([]);

  const { calCanvasIds, calCanvases } = useMemo(() => {
    return monthsForPages.reduce<{
      calCanvases: ReactNode[],
      calCanvasIds: string[],
    }>(
      (acc, m, i) => {
        const folderName = `${year}-${dd(m + 1)}`;
        const folderSrc = `${folderBaseSrcForCal}/${folderName}`;
        const targetMonth = m;

        const exportUniqueId = `cal-${year}-${dd(m + 1)}`;

        const canvasCalProps: CanvasCalProps = {
          ...commonCanvasCalProps,
          folderSrc,
          targetMonth,
          exportOptions,
          exportUniqueId,
          onCanvasExportHandlersUpdate: (exports) => {
            setExportsByMonth((curExports) => {
              const list = [...curExports];
              list[i] = exports;
              return list;
            });
          },
          // onCanvasIdsUpdate, // Only one canvas per month. So need not worry on this
        };
        const CalCanvasRendered = <CanvasCal key={m} {...canvasCalProps} />;
        acc.calCanvasIds.push(exportUniqueId);
        acc.calCanvases.push(CalCanvasRendered);
        return acc;
      },
      {
        calCanvases: [],
        calCanvasIds: [],
      },
    );
  }, [exportOptions]);

  const calCanvasExports = useMemo(() => {
    return ([] as (() => void)[]).concat(
      ...exportsByMonth.filter((exports) => Array.isArray(exports)),
    );
  }, [exportsByMonth]);

  const output = useMemo(
    () => ({
      calCanvasExports,
      calCanvasIds,
      calCanvases,
    }),
    [calCanvasExports, calCanvasIds, calCanvases],
  );
  return output;
}

export { useCalPages };
