import type { WeekDay } from '@/utils/week/types';
import type {
  CommonPropsForImageFiles,
  CommonPropsForCanvasSize,
  CustomMetaGeneration,
  FileEntry,
  FileEntryWithMeta,
  CanvasToImageExportOptions,
} from '../canvasCommon/types';

import type { YyyyMmdd } from '@/types/ts';

type NoPhotoReason =
  | 'doctor'
  | 'immunization'
  | 'sick'
  | 'holiday'
  | 'travel'
  | 'school'
  | 'school-event'
  | 'school-close'
  | 'empty'
  | 'christmas'
  | 'birthday'
  | 'graduation'
  | 'celebrate'
  | 'poll';

type SpecialDayConfig = {
  label?: string,
  subLabel?: string,
  /** Color highlight only */
  isHoliday?: boolean,
  isTraditionalDay?: boolean,
  isSchoolEvent?: boolean,
  isWeekendWork?: boolean,
  noPhotoReason?: NoPhotoReason,
};

type DateCell = SpecialDayConfig & {
  key: string,
  yyyyMmDd: string,
  date: number,
  weekNo: number,
  weekYear: number,
  day: number,
  columnIndex: number,
  rowIndex: number,
};

type CalendarMeta = {
  yyyyMmDd: string,
  type: 'in' | 'out',
};

type ImageFileToDateInfo = CustomMetaGeneration<CalendarMeta>;

type Props = CommonPropsForImageFiles &
  CommonPropsForCanvasSize & {
    imageFileToDateInfo: ImageFileToDateInfo,
    targetYear: number,
    targetMonth: number,
    firstColumn: 'Sun' | 'Mon',
    specialDaysByYyyyMmDd?: Partial<Record<YyyyMmdd, SpecialDayConfig>>,
    exportUniqueId: string,
    exportOptions: CanvasToImageExportOptions,
    onCanvasIdsUpdate?: (ids: string[]) => void,
    onCanvasExportHandlersUpdate?: (exports: (() => void)[]) => void,
  };

export type {
  YyyyMmdd,
  NoPhotoReason,
  WeekDay,
  FileEntry,
  FileEntryWithMeta,
  CalendarMeta,
  Props,
  SpecialDayConfig,
  DateCell,
  ImageFileToDateInfo,
};
