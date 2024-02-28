import type { ImageFileToDateInfo } from '../../CanvasCalendar/types';

const imageFileToDateInfo: ImageFileToDateInfo = (file) => {
  const [yyyy, mm, dd, inout] = file.name.split('-');
  return {
    yyyyMmDd: `${yyyy}${mm}${dd}`,
    type: inout as 'in' | 'out',
  };
};

export { imageFileToDateInfo };
