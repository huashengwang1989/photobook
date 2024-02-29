import type { FileEntryWithMeta, CalendarMeta } from './types';

const genImagesWithMissingInOutFilledIn = (
  images: FileEntryWithMeta<CalendarMeta>[],
): FileEntryWithMeta<CalendarMeta>[] => {
  if (images.length !== 1) {
    return images;
  }
  const curOneType = images[0].meta.type;
  const genToFillOne = (type: 'in' | 'out'): (typeof images)[0] => ({
    ...images[0],
    meta: {
      ...images[0].meta,
      type,
    },
    assetUrl: '',
    name: 'empty',
  });
  if (curOneType === 'in') {
    return [images[0], genToFillOne('out')];
  }
  if (curOneType === 'out') {
    return [genToFillOne('in'), images[0]];
  }
  return images;
};

export { genImagesWithMissingInOutFilledIn };
