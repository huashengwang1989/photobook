import { useMemo, useState, type ReactNode } from 'react';

import { dd } from '@/utils/num/dd';

import CanvasCal from '../../CanvasCalendar';
import { imageFileToDateInfo as imageFileToDateInfoForCal } from '../configs/calendar';

import type {
  CanvasCalProps,
  CanvasToImageExportOptions,
  CanvasOptions,
  CalendarPageConfig,
} from '../types';

function useCalPages(props: {
  baseFolder: string,
  ignoredExtensions: string[],
  canvasOptions: CanvasOptions,
  exportOptions: CanvasToImageExportOptions,
  calendarConfigs: CalendarPageConfig,
}) {
  const {
    exportOptions,
    baseFolder,
    ignoredExtensions,
    canvasOptions,
    calendarConfigs,
  } = props;

  const { firstDayOfWeek, specialDays, startYearMonth, endYearMonth } =
    calendarConfigs;

  const yearMonths = useMemo(() => {
    const [stY, stMDisplay] = startYearMonth
      .split('-')
      .map((str) => parseInt(str, 10));

    const [edY, edMDisplay] = endYearMonth
      .split('-')
      .map((str) => parseInt(str, 10));

    // Month is 0 to 11, where as their displays are 1 to 12
    const stM = stMDisplay - 1;
    const edM = edMDisplay - 1;

    if (!stY || !edY) {
      throw new Error('invalid-year');
    }
    if (
      !stMDisplay ||
      stM > 11 ||
      stM < 0 ||
      !edMDisplay ||
      edM > 11 ||
      edM < 0
    ) {
      throw new Error('invalid-month');
    }
    if (stY < 1970) {
      throw new Error('year-before-1970');
    }
    if (stY > edY) {
      throw new Error('start-year-is-later-than-end-year');
    }
    if (stY === edY && stM > edM) {
      throw new Error('start-month-is-later-than-end-month');
    }
    return Array(edY - stY + 1)
      .fill(0)
      .map((_, i) => i + stY)
      .reduce<[number, number][]>((acc, year, yi, arr) => {
        const isLastYear = arr.length - 1 === yi;
        const curStM = yi === 0 ? stM : 0;
        const curEdM = isLastYear ? edM : 11;
        Array(curEdM - curStM + 1)
          .fill(0)
          .map((_, i) => i + curStM)
          .forEach((month) => {
            acc.push([year, month]);
          });
        return acc;
      }, []);
  }, [endYearMonth, startYearMonth]);

  const [exportsByMonth, setExportsByMonth] = useState<(() => void)[][]>([]);

  const { calCanvasIds, calCanvases } = useMemo(() => {
    return yearMonths.reduce<{
      calCanvases: ReactNode[],
      calCanvasIds: string[],
    }>(
      (acc, yearMonth, i) => {
        const [year, m] = yearMonth;
        const folderName = `${year}-${dd(m + 1)}`;
        const folderSrc = `${baseFolder}/${folderName}`;
        const targetMonth = m;

        const exportUniqueId = `calendar-${year}-${dd(m + 1)}`;

        const canvasCalProps: CanvasCalProps = {
          ...canvasOptions,
          targetYear: year,
          targetMonth,
          firstColumn: firstDayOfWeek,
          specialDaysByYyyyMmDd: specialDays,
          folderSrc,
          ignoredExtensions,
          exportOptions,
          exportUniqueId,
          imageFileToDateInfo: imageFileToDateInfoForCal,
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
  }, [
    baseFolder,
    canvasOptions,
    exportOptions,
    firstDayOfWeek,
    ignoredExtensions,
    specialDays,
    yearMonths,
  ]);

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
