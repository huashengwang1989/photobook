import type { Lang, DisplayType } from './types';

type WeekArray = [string, string, string, string, string, string, string];
const names: Record<Lang, Record<DisplayType, WeekArray>> = {
  en: {
    full: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    short: ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'],
    concise: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    single: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  },
  cn: {
    full: [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ],
    short: [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ],
    concise: ['日', '一', '二', '三', '四', '五', '六'],
    single: ['日', '一', '二', '三', '四', '五', '六'],
  },
  jp: {
    full: [
      '日曜日',
      '月曜日',
      '火曜日',
      '水曜日',
      '木曜日',
      '金曜日',
      '土曜日',
    ],
    short: [
      '日曜日',
      '月曜日',
      '火曜日',
      '水曜日',
      '木曜日',
      '金曜日',
      '土曜日',
    ],
    concise: ['日', '月', '火', '水', '木', '金', '土'],
    single: ['日', '月', '火', '水', '木', '金', '土'],
  },
};

export { names };
