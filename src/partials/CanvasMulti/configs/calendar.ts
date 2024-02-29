import { dd } from '@/utils/num/dd';

import type { ImageFileToDateInfo } from '../../CanvasCalendar/types';

const imageFileToDateInfo: ImageFileToDateInfo = (file) => {
  const [, yyyy, mmRaw, ddRaw, inout] =
    file.name.match(
      /([0-9]{4})[_\-/]?([0-9]{1,2})[_\-/]?([0-9]{1,2})-(in|out)/,
    ) || [];

  if (
    !yyyy ||
    !mmRaw ||
    !ddRaw ||
    !inout ||
    (inout !== 'in' && inout !== 'out')
  ) {
    return undefined; // INVALID
  }

  return {
    yyyyMmDd: `${yyyy}${dd(mmRaw)}${dd(ddRaw)}`,
    type: inout as 'in' | 'out',
  };
};

export { imageFileToDateInfo };
