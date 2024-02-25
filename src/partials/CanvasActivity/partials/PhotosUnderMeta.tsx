import Image from '@/components/Image';

import type { FC } from 'react';
import type { FileInfoWithMeta } from '../types.file';

const GAP = 4;

const PhotosUnderMeta: FC<{
  files: FileInfoWithMeta[],
  metaPartHeight: number,
  canvasContentHeight: number,
  canvasContentWidth: number,
}> = (props) => {
  const { files, metaPartHeight, canvasContentHeight, canvasContentWidth } =
    props;

  const photoUnderMetaMaxHeight = canvasContentHeight - metaPartHeight;
  const flexBasis = files.length
    ? (canvasContentWidth + GAP * (files.length - 1)) / files.length - GAP
    : 0;

  const images = files.map((img) => {
    return (
      <div key={img.name} className="text-center" style={{ flexBasis }}>
        <Image className={'max-h-full'} src={img.assetUrl} alt={img.name} />
      </div>
    );
  });

  return (
    <div
      className={'flex justify-center gap-1'}
      style={{ maxHeight: photoUnderMetaMaxHeight }}
    >
      {images}
    </div>
  );
};

export default PhotosUnderMeta;
