import type {
  ImageFileToDateInfo,
  SpecialDayConfig,
} from '../CanvasCalendar/types';

const year = 2023;
/** Jun - Dec */
const monthsForPages: number[] = [5, 6, 7, 8, 9, 10, 11];

const imageFileToDateInfo: ImageFileToDateInfo = (file) => {
  const [yyyy, mm, dd, inout] = file.name.split('-');
  return {
    yyyyMmDd: `${yyyy}${mm}${dd}`,
    type: inout as 'in' | 'out',
  };
};

const specialDaysByYyyyMmDd: Partial<Record<string, SpecialDayConfig>> = {
  // 2023-06
  20230602: {
    label: 'Vesak Day',
    subLabel: '卫塞节',
    isHoliday: true,
    noPhotoReason: 'holiday',
  },
  20230612: {
    label: '🏥 Clinic',
    subLabel: 'Clementi PC',
  },
  20230621: {
    label: '夏至',
  },
  20230622: {
    label: '端午',
  },
  20230624: {
    label: '🎂 100 Days',
    subLabel: '百日',
  },
  20230629: {
    label: 'Hari Raya Haji',
    subLabel: '哈芝节',
    isHoliday: true,
    noPhotoReason: 'holiday',
  },
  // 2023-07
  20230712: {
    label: '🏥 Clinic',
    subLabel: 'NUH',
    noPhotoReason: 'doctor',
  },
  20230731: {
    label: 'Immunization',
    subLabel: '💉 Clementi PC',
    noPhotoReason: 'immunization',
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
  20230926: {
    noPhotoReason: 'sick',
  },
  20230929: {
    label: '中秋',
    isTraditionalDay: true,
  },
  // 2023-10
  20231005: {
    label: 'Immunization',
    subLabel: '💉 Clementi PC',
  },
  20231006: {
    label: "Childrens' Day",
    subLabel: '儿童节',
    isSchoolEvent: true,
  },
  20231023: {
    label: '重阳',
    isTraditionalDay: true,
  },
  20231030: {
    label: 'Centre Closure',
    subLabel: '中心关闭',
    isSchoolEvent: true,
    noPhotoReason: 'school-close',
  },
  // 2023-11
  20231106: {
    label: '🏥 A&E',
    subLabel: 'Clementi PC, NUH',
    noPhotoReason: 'sick',
  },
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
  20231121: {
    label: '🏥 A&E',
    subLabel: 'Clementi PC, NUH',
    noPhotoReason: 'sick',
  },
  20231122: {
    noPhotoReason: 'sick',
  },
  20231123: {
    noPhotoReason: 'sick',
  },
  20231124: {
    noPhotoReason: 'sick',
  },
  // 2023-12
  20231206: {
    label: 'Immunization',
    subLabel: '💉 Clementi PC',
  },
  20231215: {
    label: 'Centre Spring Cleaning',
    subLabel: '中心大扫除',
    isSchoolEvent: true,
    noPhotoReason: 'school-event',
  },
  20231219: {
    noPhotoReason: 'sick',
  },
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

export { year, monthsForPages, imageFileToDateInfo, specialDaysByYyyyMmDd };
