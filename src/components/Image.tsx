import { useCallback, useMemo, type FC } from 'react';
import { arrayBufferToBase64 } from '@/utils/buffer/arrayBufferToBase64';
import { useFetch } from '@/utils/hooks/useFetch';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  useBase64?: boolean,
};
const Image: FC<Props> = (props) => {
  const { src, useBase64 } = props;

  const getBase64UrlOrSrc = useCallback(async () => {
    if (!useBase64) {
      return src;
    }
    if (!src) {
      return undefined;
    }
    const buffer = await fetch(src).then((r) => r.arrayBuffer());
    const base64 = arrayBufferToBase64(buffer);
    if (!base64) {
      return undefined;
    }
    return `data:image/jpeg;base64,${base64}`;
  }, [useBase64, src]);

  const { data: srcRaw } = useFetch({
    func: getBase64UrlOrSrc,
    defaultValue: '',
  });

  const srcUsed = useMemo(() => {
    if (!srcRaw) {
      return undefined;
    }
    if (useBase64) {
      return srcRaw;
    }
    const appTs = `ts=${new Date().getTime()}`;
    return srcRaw.includes('?') ? `${srcRaw}&${appTs}` : `${srcRaw}?${appTs}`;
  }, [useBase64, srcRaw]);

  return srcUsed ? (
    <img {...props} src={srcUsed} crossOrigin="anonymous" />
  ) : null;
};

export default Image;
