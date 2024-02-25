import clsx from 'clsx';
import Image from '@/components/Image';

import type { FC, ReactNode } from 'react';
import type { FileInfoWithMeta } from '../types.file';

const GAP = 4;

const NextPageOfActivity: FC<{
  files: FileInfoWithMeta[],
  canvasContentHeight: number,
  canvasContentWidth: number,
}> = (props) => {
  const { files, canvasContentHeight, canvasContentWidth } = props;

  const photosRowsForPage = files.reduce(
    (acc, img, i) => {
      const ImgRendered = (
        <div key={img.name} className="text-center">
          <Image className="max-h-full" src={img.assetUrl} alt={img.name} />
        </div>
      );
      const pi = Math.floor(i / 2);
      if (i % 2 === 0) {
        acc.push([]);
      }
      acc[pi].push(ImgRendered);
      return acc;
    },
    [] as ReactNode[][],
  );

  const rowsCnt = photosRowsForPage.length;

  return (
    <div className={'flex-col gap-1'}>
      {photosRowsForPage.map((files, i, arr) => {
        const isLastRow = arr.length - 1 === i;
        const key = `row-${i}`;
        const maxH =
          Math.floor(canvasContentHeight / rowsCnt) - (isLastRow ? 0 : 4);
        const flexBasis = files.length
          ? (canvasContentWidth + GAP * (files.length - 1)) / files.length - GAP
          : 0;
        return (
          <div
            key={key}
            className={clsx('flex justify-center gap-1', {
              'max-h-full': rowsCnt === 1,
              'mb-1': !isLastRow,
            })}
            style={{ maxHeight: maxH, flexBasis }}
          >
            {files}
          </div>
        );
      })}
    </div>
  );
};

export default NextPageOfActivity;
