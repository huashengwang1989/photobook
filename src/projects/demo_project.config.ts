import type {
  ExportOptions,
  CanvasOptions,
  CalendarPageConfig,
  SpecialDayConfig,
  ActivityPageAdjust,
  MergedConfigs,
} from './types';

const exportOptions: ExportOptions = {
  inclBleedingArea: true,
  inclBleedingMarks: false,
  targetDpi: 300,
  exportFormat: 'jpg',
};

const canvasOptions: CanvasOptions = {
  canvasDimensionCm: [20, 20], // 20cm is around 8-inch
  bleedingCm: [0.5, 0.5, 0.5, 0.5],
  contentPaddingCm: 0.5,
};

const specialDaysByYyyyMmDd: Partial<Record<string, SpecialDayConfig>> = {
  // 2023-06
  20230602: {
    label: 'Vesak Day',
    subLabel: '卫塞节',
    isHoliday: true,
    noPhotoReason: 'holiday',
  },
  20230621: {
    label: '夏至',
  },
  20230622: {
    label: '端午',
  },
  20230629: {
    label: 'Hari Raya Haji',
    subLabel: '哈芝节',
    isHoliday: true,
    noPhotoReason: 'holiday',
  },
  // 2023-07
  20230701: {
    // Example of being absent (no photos) for clinic visit
    label: '🏥 Clinic',
    subLabel: 'NUH',
    noPhotoReason: 'doctor',
  },
  20230702: {
    // Example of being absent (no photos) for getting vaccination
    label: 'Immunization',
    subLabel: '💉 Clementi PC',
    noPhotoReason: 'immunization',
  },
  20230703: {
    // Example of being absent by just marking it as "sick"
    noPhotoReason: 'sick',
  },
  20230704: {
    // Example of being absent due to school close
    label: 'School Closure',
    subLabel: '中心关闭',
    isSchoolEvent: true,
    noPhotoReason: 'school-close',
  },
  20230705: {
    // Example of being absent due to school close for deep cleaning
    label: 'School Cleaning',
    subLabel: '大扫除',
    isSchoolEvent: true,
    noPhotoReason: 'school-event',
  },
  // 2023-08
  20230808: {
    label: '立秋',
    isTraditionalDay: true,
  },
  20230809: {
    label: '🇸🇬 National Day',
    subLabel: '国庆',
    isHoliday: true,
    noPhotoReason: 'celebrate',
  },
  20230822: {
    label: '七夕',
    isTraditionalDay: true,
  },
  20230830: {
    label: '中元',
    isTraditionalDay: true,
  },
  // 2023-09
  20230901: {
    label: 'Election Day',
    subLabel: '选举日',
    isHoliday: true,
    noPhotoReason: 'poll',
  },
  20230904: {
    label: "Teachers' Day In-lieu",
    subLabel: '教师节学校补假',
    isSchoolEvent: true,
    noPhotoReason: 'school',
  },
  20230911: {
    label: "Teachers' Day",
    subLabel: '教师节',
    isSchoolEvent: true,
    noPhotoReason: 'school',
  },
  20230923: {
    label: '秋分',
    isTraditionalDay: true,
  },
  20230929: {
    label: '中秋',
    isTraditionalDay: true,
  },
  // 2023-10
  20231006: {
    label: "Childrens' Day",
    subLabel: '儿童节',
    isSchoolEvent: true,
  },
  20231023: {
    label: '重阳',
    isTraditionalDay: true,
  },
  // 2023-11
  20231108: {
    label: '立冬',
    isTraditionalDay: true,
  },
  20231112: {
    label: 'Deepavali',
    subLabel: '屠妖节',
    isHoliday: true,
  },
  20231113: {
    label: 'Deepavali In-lieu',
    subLabel: '屠妖节补假',
    isHoliday: true,
    noPhotoReason: 'holiday',
  },
  // 2023-12
  20231222: {
    label: '冬至',
    isTraditionalDay: true,
  },
  20231225: {
    label: 'Christmas',
    subLabel: '圣诞节',
    isHoliday: true,
    noPhotoReason: 'christmas',
  },
};

const calendarPageConfig: CalendarPageConfig = {
  startYearMonth: '2023-01',
  endYearMonth: '2023-12',
  firstDayOfWeek: 'Sun',
  specialDays: specialDaysByYyyyMmDd,
};

const activityPageAdjust: ActivityPageAdjust = {
  foldersLimitToTwoPhotosPerPage: ['2023_08_01 My Activity'],
  foldersWithLastPageToSplitToTwo: ['2023_08_02 My Another Activity'],
};

// This is based on Mac folder structure. Windows is NOT tested.
const baseFolders = {
  calendar: '/Users/my-user-name/Pictures/2023 My Kid Check-in-out Photos',
  activity: '/Users/my-user-name/Pictures/Photos/2023 My Kid Activity Photos',
};

const configs: MergedConfigs = {
  baseFolders,
  exportOptions,
  canvasOptions,
  // Even you don't have them here, 'DS_Store', 'ini' will always be ignored
  ignoreFileExtensions: ['DS_Store', 'ini'],
  pageConfig: {
    calendar: calendarPageConfig,
  },
  pageAdjust: {
    activity: activityPageAdjust,
  },
};

export { configs };
