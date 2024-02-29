import { useMemo, type FC } from 'react';
import clsx from 'clsx';
import Image from '@/components/Image';

import type { DateCell, FileEntryWithMeta, CalendarMeta } from './types';

const MonthCalGridCellDate: FC<{ cell: DateCell }> = (props) => {
  const { cell } = props;
  const dateColorCls = useMemo(() => {
    if (
      cell.isHoliday ||
      ((cell.day === 0 || cell.day === 6) && !cell.isWeekendWork)
    ) {
      return clsx('text-lime-600');
    }
    return 'text-slate-800';
  }, [cell.day, cell.isHoliday, cell.isWeekendWork]);

  return (
    <div
      className={clsx(
        'mr-1 flex-grow-0 text-center font-sans text-base font-bold',
        dateColorCls,
      )}
    >
      {cell.date || ''}
    </div>
  );
};

const MonthCalGridCellLabels: FC<{ cell: DateCell }> = (props) => {
  const { cell } = props;
  const isSingleLabel = Boolean(cell.label) !== Boolean(cell.subLabel);
  const commonCls = clsx('text-left font-condensedSans font-semibold', {
    'text-lime-600': cell.isHoliday,
    'text-amber-600': cell.isTraditionalDay && !cell.isHoliday,
    'text-cyan-600':
      cell.isSchoolEvent && !cell.isHoliday && !cell.isTraditionalDay,
    'mt-1': isSingleLabel, // Minor adjust position for better visual
  });
  const MainLabel = useMemo(
    () => <div className={clsx(commonCls, 'text-xs')}>{cell.label}</div>,
    [cell.label, commonCls],
  );
  const SubLabel = useMemo(
    () => (
      <div className={clsx(commonCls, 'text-[0.5rem] leading-[0.75rem]')}>
        {cell.subLabel}
      </div>
    ),
    [cell.subLabel, commonCls],
  );
  return (
    <div
      className={clsx('flex-grow', {
        'self-baseline': isSingleLabel,
      })}
    >
      {Boolean(cell.label) && MainLabel}
      {Boolean(cell.subLabel) && SubLabel}
    </div>
  );
};

const InOutImage: React.FC<{ img: FileEntryWithMeta<CalendarMeta> }> = (
  props,
) => {
  const { img } = props;
  return (
    <div key={img.meta.type} className={'m-[1px] h-16 w-[48%] text-center'}>
      {Boolean(img.assetUrl) && (
        <Image src={img.assetUrl} alt={img.name} className={'max-h-[100%]'} />
      )}
    </div>
  );
};

export { MonthCalGridCellDate, MonthCalGridCellLabels, InOutImage };
