import { useCallback, useMemo, type FC } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from '@/components/Image';
import { useFetch } from '@/utils/hooks/useFetch';
import { dd } from '@/utils/num/dd';
import { weeksWithSunStart, weeksWithMonStart } from '@/utils/week/list';
import { getWeek, getWeekYear } from '@/utils/week/basic';
import { names as weekNames } from '@/utils/week/names';
import { names as monthNames } from '@/utils/month/names';

import { useCanvasBaseAndDim } from '../canvasBaseAndDim';
import { useImageFileSrcCommon } from '../canvasCommon';
import { noPhotoPlaceholders } from './constants';

import type { WeekDay, SpecialDayConfig, Props, DateCell } from './types';

import './styles.css';

const CalendarCanvas: FC<Props> = (props) => {
  const {
    folderSrc,
    firstColumn: weekStart,
    supportedExtensions,
    checkFileApplicability,
    imageFileToDateInfo,
    targetMonth: month,
    targetYear: year,
    specialDaysByYyyyMmDd,
    // Canvas
    canvasDimensionCm,
    bleedingCm,
    contentPaddingCm,
    // Export
    exportOptions,
    exportUniqueId,
  } = props;

  const { getAllApplicableFilesInFolder } = useImageFileSrcCommon({
    folderSrc,
    supportedExtensions,
    checkFileApplicability,
    customMetaGeneration: imageFileToDateInfo,
  });

  const { renderCanvas } = useCanvasBaseAndDim({
    canvasDimensionCm,
    bleedingCm,
    contentPaddingCm,
    exportOptions,
    exportUniqueId,
  });

  const { data: photoFileData } = useFetch({
    func: getAllApplicableFilesInFolder,
    defaultValue: [],
  });

  const photoFileDataByYyyyMmdd = useMemo(
    () =>
      photoFileData.reduce<Partial<Record<string, typeof photoFileData>>>(
        (acc, datum) => {
          const yyyyMmdd = datum.meta.yyyyMmDd;
          if (!acc[yyyyMmdd]) {
            acc[yyyyMmdd] = [];
          }
          acc[yyyyMmdd]?.push(datum);
          const one = acc[yyyyMmdd];
          // In this order: 'in', 'out'. Since we should only have two images per day.
          if (one && one.length > 1) {
            one.sort((a, b) => a.meta.type.localeCompare(b.meta.type));
          }
          return acc;
        },
        {},
      ),
    [photoFileData],
  );

  const weeks = weekStart === 'Mon' ? weeksWithMonStart : weeksWithSunStart;

  const monthCalendarGridData = useMemo(() => {
    if (!year || year < 1970) {
      throw new Error('year-before-1970');
    }
    if (Number.isNaN(month) || month < 0 || month > 11) {
      throw new Error('month-out-of-scope-0-to-11');
    }

    const firstD = new Date(year, month, 1);
    // Month + 1 can be 12.
    const lastD = new Date(year, month + 1, 0);
    const lastDate = lastD.getDate(); // Date

    const firstDay = firstD.getDay() as WeekDay; // Week
    const firstDayIndex = weeks.indexOf(firstDay);
    const firstDayWeekNo = getWeek(firstD);
    const firstDayWeekYear = getWeekYear(firstD);

    const preFirstDayEmptyCellCount = firstDayIndex < 0 ? 0 : firstDayIndex;

    const defaultSpecialDayConfig: SpecialDayConfig = {
      label: '',
      subLabel: '',
      isHoliday: false,
      isTraditionalDay: false,
      isSchoolEvent: false,
      isWeekendWork: false,
    };

    // Do the "pre" empty cells before Day 1 first.
    const cellsInGrid: DateCell[][] = [
      Array(preFirstDayEmptyCellCount)
        .fill(null)
        .map((_, i) => ({
          key: `pre-${firstDayIndex - i}`,
          yyyyMmDd: '', // INVALID
          date: 0, // INVALID
          weekNo: firstDayWeekNo,
          weekYear: firstDayWeekYear,
          day: weeks[i],
          columnIndex: i,
          rowIndex: 0,
          ...defaultSpecialDayConfig,
        })),
    ];

    let curDate = 1;
    let curColIdx = firstDayIndex;
    let curRowIdx = 0;
    let curWeekNo = firstDayWeekNo;
    let curWeekYear = firstDayWeekYear;

    // Generate the cells with dates
    // Transition to Georgian happened before 1970,
    // so we need not handle skipped dates. It is too edge-case.

    while (curDate <= lastDate) {
      const yyyyMmDd = `${year}${dd(month + 1)}${dd(curDate)}`;
      const cell: DateCell = {
        key: `d-${curDate}`,
        yyyyMmDd,
        date: curDate,
        weekNo: curWeekNo,
        weekYear: curWeekYear,
        day: weeks[curColIdx],
        columnIndex: curColIdx,
        rowIndex: curRowIdx,
        ...defaultSpecialDayConfig,
        ...specialDaysByYyyyMmDd?.[yyyyMmDd],
      };
      if (!cellsInGrid[curRowIdx]) {
        cellsInGrid[curRowIdx] = [];
      }
      cellsInGrid[curRowIdx].push(cell);
      curDate += 1;
      curColIdx += 1;
      if (curColIdx >= weeks.length) {
        curColIdx = curColIdx % weeks.length;
        curRowIdx += 1;
        if (curDate <= lastDate) {
          curWeekNo += 1;
          if (
            (month === 0 || month === 11) &&
            (curWeekNo === 1 || curWeekNo === 5)
          ) {
            curWeekYear = getWeekYear(new Date(year, month, curDate));
          }
        }
      }
    }

    // When curColIdx is 0, it means that it is reset to a new week.
    // Need not add an empty row of cells for the whole week.
    const endLastDayEmptyCellCount =
      curColIdx > 0 ? weeks.length - curColIdx : 0;
    if (endLastDayEmptyCellCount > 0) {
      const endEmptyCells: DateCell[] = Array(endLastDayEmptyCellCount)
        .fill(null)
        .map((_, i) => ({
          key: `end-${curColIdx + i + 1}`,
          yyyyMmDd: '',
          date: 0,
          weekNo: curWeekNo,
          weekYear: curWeekYear,
          day: weeks[i],
          columnIndex: i,
          rowIndex: curRowIdx,
          ...defaultSpecialDayConfig,
        }));
      if (endEmptyCells.length) {
        // Should need not optionals. Just as a safty-net.
        cellsInGrid[curRowIdx]?.push?.(...endEmptyCells);
      }
    }

    return cellsInGrid;
  }, [month, specialDaysByYyyyMmDd, weeks, year]);

  // ----- Renderings -----

  const renderMonthCalGridCellDate = useCallback((cell: DateCell) => {
    const dateColorCls = (() => {
      if (
        cell.isHoliday ||
        ((cell.day === 0 || cell.day === 6) && !cell.isWeekendWork)
      ) {
        return clsx('text-lime-600');
      }
      return 'text-slate-800';
    })();
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
  }, []);

  const renderMonthCalGridCellLabels = useCallback((cell: DateCell) => {
    const isSingleLabel = Boolean(cell.label) !== Boolean(cell.subLabel);
    const commonCls = clsx('font-condensedSans text-left font-semibold', {
      'text-lime-600': cell.isHoliday,
      'text-amber-600': cell.isTraditionalDay && !cell.isHoliday,
      'text-cyan-600':
        cell.isSchoolEvent && !cell.isHoliday && !cell.isTraditionalDay,
      'mt-1': isSingleLabel, // Minor adjust position for better visual
    });
    const MainLabel = (
      <div className={clsx(commonCls, 'text-xs')}>{cell.label}</div>
    );
    const SubLabel = (
      <div className={clsx(commonCls, 'text-[0.5rem] leading-[0.75rem]')}>
        {cell.subLabel}
      </div>
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
  }, []);

  const renderMonthCalGridCell = useCallback(
    (cell: DateCell, isNoPhotoRow: boolean) => {
      const images = photoFileDataByYyyyMmdd[cell.yyyyMmDd] || [];
      const plIcon = cell.noPhotoReason
        ? noPhotoPlaceholders[cell.noPhotoReason]
        : undefined;
      return (
        <td
          key={cell.key}
          className={clsx(
            'cal-cell border border-slate-100 p-1 align-top',
            isNoPhotoRow ? 'h-14' : 'h-28',
          )}
        >
          <div className="flex min-h-10">
            {renderMonthCalGridCellDate(cell)}
            {renderMonthCalGridCellLabels(cell)}
          </div>
          <div className={'flex justify-evenly'}>
            {images.map((img) => {
              return (
                <div key={img.meta.type} className={'m-[1px] h-auto w-[48%]'}>
                  <Image src={img.assetUrl} alt={img.name} />
                </div>
              );
            })}
            {!images.length && plIcon && (
              <FontAwesomeIcon
                className={'text-4xl text-slate-200'}
                icon={plIcon}
              />
            )}
          </div>
        </td>
      );
    },
    [
      photoFileDataByYyyyMmdd,
      renderMonthCalGridCellDate,
      renderMonthCalGridCellLabels,
    ],
  );

  const MonthCalcGridInner = useMemo(
    () =>
      monthCalendarGridData.map((row) => {
        const weekNo = row[0].weekNo;
        const isNoPhotoRow = !row.find((cell) => {
          const photos = photoFileDataByYyyyMmdd[cell.yyyyMmDd];
          return photos?.length || cell.noPhotoReason;
        });
        return (
          <tr key={weekNo}>
            <th
              className={
                'p-1 text-center align-middle font-sans text-lg text-slate-300'
              }
            >
              {weekNo}
            </th>
            {row.map((cell) => renderMonthCalGridCell(cell, isNoPhotoRow))}
          </tr>
        );
      }),
    [monthCalendarGridData, photoFileDataByYyyyMmdd, renderMonthCalGridCell],
  );

  const CalendarMonthHeader = useMemo(() => {
    return (
      <h3 className="calendar-header flex">
        <div className="font-serif text-6xl font-semibold text-lime-700">
          {monthNames.en.full[month]}
        </div>
        <div className="ml-4 font-serif text-2xl font-bold text-lime-600">
          {year}
        </div>
        <div className="w-1 flex-grow" aria-hidden />
        <div className="font-serif text-xl font-bold text-lime-600">
          {monthNames.cn.short[month]}
        </div>
      </h3>
    );
  }, [month, year]);

  // Canvas is done with absolute position at container side.
  // Tailwind CSS will be ineffective inside.

  // This controls table column widths
  const TableColGroup = useMemo(() => {
    const wkendColWPct = 12;
    const mainColWPct = (95 - wkendColWPct * 2) / 5;
    const mainColWStyle = { width: `${mainColWPct}%` };
    const wkendColWStyle = { width: `${wkendColWPct}%` };
    return (
      <colgroup>
        <col style={{ width: '5%' }} />
        <col style={weekStart === 'Mon' ? mainColWStyle : wkendColWStyle} />
        <col style={mainColWStyle} />
        <col style={mainColWStyle} />
        <col style={mainColWStyle} />
        <col style={mainColWStyle} />
        <col style={weekStart === 'Mon' ? wkendColWStyle : mainColWStyle} />
        <col style={wkendColWStyle} />
      </colgroup>
    );
  }, [weekStart]);

  const TableHeaderWeekNames = useMemo(() => {
    return (
      <tr>
        {<th key={'wkno'}></th>}
        {weeks.map((wk) => (
          <th
            key={wk}
            className={'text-center font-sans text-lg text-slate-500'}
          >
            {weekNames.en.concise[wk]}
          </th>
        ))}
      </tr>
    );
  }, [weeks]);

  const CanvasContent = useMemo(() => {
    return (
      <div>
        {/** Header */}
        {CalendarMonthHeader}
        {/** Table */}
        <table className={`w-full border-collapse`}>
          {TableColGroup}
          <thead>{TableHeaderWeekNames}</thead>
          <tbody>{MonthCalcGridInner}</tbody>
        </table>
      </div>
    );
  }, [
    CalendarMonthHeader,
    MonthCalcGridInner,
    TableColGroup,
    TableHeaderWeekNames,
  ]);

  return renderCanvas({ children: CanvasContent });
};

export default CalendarCanvas;
