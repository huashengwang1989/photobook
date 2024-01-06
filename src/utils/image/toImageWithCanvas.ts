import html2canvas from 'html2canvas';

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

  const canvas = await html2canvas(node, {
    logging: false,
    allowTaint: true,
    scale: pixelRatio,
    imageTimeout: 15000, // Default value
    foreignObjectRendering: false,
    useCORS: true,
  });

  const dataUrl = canvas.toDataURL(`image/${format}`, 1);
  return dataUrl;
}

export { generateImageDataUrl };
