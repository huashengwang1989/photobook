import * as htmlToImage from 'html-to-image';

async function generateImageDataUrl(
  node: HTMLElement | null,
  options: {
    format: 'png' | 'jpg',
    dpi: number,
    /** 72. Even Retina screen need not change. */
    browserPpi?: number,
  },
) {
  const { format, dpi, browserPpi = 72 } = options;

  if (!node) {
    throw new Error('no-dom');
  }
  const pixelRatio = dpi / browserPpi;
  const gen = format === 'png' ? htmlToImage.toPng : htmlToImage.toJpeg;

  return await gen(node, {
    quality: 1,
    pixelRatio,
    cacheBust: true,
  });
}

export { generateImageDataUrl };
