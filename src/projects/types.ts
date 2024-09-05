import type {
  CanvasToImageExportOptions,
  CommonPropsForCanvasSize as CanvasOptions,
} from '@/partials/canvasCommon/types';

import type { SpecialDayConfig } from '@/partials/CanvasCalendar/types';

import type { YearMonth, YyyyMmdd } from '@/types/ts';

type ExportOptions = Omit<CanvasToImageExportOptions, 'exportingCanvasIds'>;

type ActivityPageAdjust = {
  foldersLimitToTwoPhotosPerPage: string[], // folder names only
  foldersWithLastPageToSplitToTwo: string[], // folder names only
};

type CalendarPageConfig = {
  startYearMonth: YearMonth,
  endYearMonth: YearMonth,
  firstDayOfWeek: 'Sun' | 'Mon',
  specialDays: Partial<Record<YyyyMmdd, SpecialDayConfig>>,
};

type BaseFolderList = Record<'calendar' | 'activity', string>;

type MergedConfigs = {
  themeColor?: string,
  themeColorMinor?: string,
  exportOptions: ExportOptions,
  baseFolders: BaseFolderList,
  canvasOptions: CanvasOptions,
  // DO NOT include dot. 'DS_Store', 'ini' will always be ignored
  ignoreFileExtensions?: string[],
  pageConfig: {
    calendar: CalendarPageConfig,
  },
  pageAdjust: {
    activity: ActivityPageAdjust,
  },
};

export type {
  ExportOptions,
  CanvasOptions,
  BaseFolderList,
  CalendarPageConfig,
  SpecialDayConfig,
  ActivityPageAdjust,
  // Final
  MergedConfigs,
};
