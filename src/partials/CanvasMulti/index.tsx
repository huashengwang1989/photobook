import { useMemo, type ReactNode } from 'react';
import { dd } from '@/utils/num/dd';
import CanvasCal from '../CanvasCalendar';
import {
  year,
  monthsForPages,
  imageFileToDateInfo,
  specialDaysByYyyyMmDd,
} from './configs';
import type { CanvasCalProps, CanvasToImageExportOptions } from './types';

const folderBaseSrc =
  '/Users/huasheng/Pictures/Photos/2023 Chuling Check-in-out at PCF Sparkletots';

const commonCanvasCalProps: Omit<
  CanvasCalProps,
  // eslint-disable-next-line prettier/prettier
'folderSrc' | 'targetMonth' | 'exportUniqueId' | 'exportOptions'
> = {
  firstColumn: 'Sun',
  imageFileToDateInfo,
  targetYear: year,
  specialDaysByYyyyMmDd,
  // Canvas dimensions in centimeter
  canvasDimensionCm: [20, 20],
  bleedingCm: [0.5, 0.5, 0.5, 0.5],
  contentPaddingCm: 0.5,
};

function useCanvasMulti(props: { exportOptions: CanvasToImageExportOptions }) {
  const { exportOptions } = props;

  const { calCanvases, calCanvasIds } = useMemo(() => {
    return monthsForPages.reduce<{
      calCanvases: ReactNode[],
      calCanvasIds: string[],
    }>(
      (acc, m) => {
        const folderName = `${year}-${dd(m + 1)}`;
        const folderSrc = `${folderBaseSrc}/${folderName}`;
        const targetMonth = m;

        const exportUniqueId = `cal-${year}-${dd(m + 1)}`;

        const canvasCalProps: CanvasCalProps = {
          ...commonCanvasCalProps,
          folderSrc,
          targetMonth,
          exportOptions,
          exportUniqueId,
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

  const CanvasMultiRendered = useMemo(() => {
    return (
      <div className={'canvas-container flex flex-wrap justify-center'}>
        {calCanvases}
      </div>
    );
  }, [calCanvases]);

  const output = useMemo(
    () => ({
      CanvasMultiRendered,
      canvasIds: calCanvasIds,
    }),
    [CanvasMultiRendered, calCanvasIds],
  );

  return output;
}

export { useCanvasMulti };
