import type { WeekDay } from '@/utils/week/types';
import type {
  CommonPropsForImageFiles,
  CommonPropsForCanvasSize,
  CustomMetaGeneration,
  FileEntry,
  CanvasToImageExportOptions,
} from '../canvasCommon/types';

type NoPhotoReason =
  | 'doctor'
  | 'immunization'
  | 'sick'
  | 'holiday'
  | 'travel'
  | 'empty';

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

type ImageFileToDateInfo = CustomMetaGeneration<{
  yyyyMmDd: string,
  type: 'in' | 'out',
}>;

type Props = CommonPropsForImageFiles &
  CommonPropsForCanvasSize & {
    imageFileToDateInfo: ImageFileToDateInfo,
    targetYear: number,
    targetMonth: number,
    firstColumn: 'Sun' | 'Mon',
    specialDaysByYyyyMmDd?: Partial<Record<string, SpecialDayConfig>>,
    exportUniqueId: string,
    exportOptions: CanvasToImageExportOptions,
  };

export type {
  NoPhotoReason,
  WeekDay,
  FileEntry,
  Props,
  SpecialDayConfig,
  DateCell,
  ImageFileToDateInfo,
};
