import type { FileInfoWithMeta } from '../../types.file';

/**
 * We hard-coded the following here:
 *
 * - Photos under meta: max 2;
 * - Photo-only pages: max 4;
 * - Optimised photo allocation based on above numbers.
 */
function allocPhotoFilesByPage(options: {
  files: FileInfoWithMeta[],
  log?: string,
  limitToTwoPerPage?: boolean,
  lastPageSplitToTwo?: boolean,
}) {
  const { files, log, limitToTwoPerPage, lastPageSplitToTwo } = options;

  const totalCnt = files.length;

  // Max 2 photos under meta; If only 2 or 3 photos, put one under meta, another one in next page.
  const cntUnderMeta =
    totalCnt === 2 || totalCnt === 3 ? 1 : Math.min(totalCnt, 2);
  const underMeta = new Array(cntUnderMeta).fill(null).map((_, i) => files[i]);

  // Max 4 per page; try to split a bit more evenly
  const restPhotosCnt = totalCnt - cntUnderMeta;

  let otherPagesPhotosCnt: number[];
  if (limitToTwoPerPage) {
    const nextPagesCnt = Math.ceil(restPhotosCnt / 2);
    const lastPagePhotosCnt = restPhotosCnt % 2 || 2;
    otherPagesPhotosCnt = Array(nextPagesCnt).fill(2);
    otherPagesPhotosCnt[nextPagesCnt - 1] = lastPagePhotosCnt;
  } else {
    const nextPagesCnt = Math.ceil(restPhotosCnt / 4);
    const lastPagePhotosCnt = restPhotosCnt % 4 || 4;
    otherPagesPhotosCnt = Array(nextPagesCnt).fill(4);
    otherPagesPhotosCnt[nextPagesCnt - 1] = lastPagePhotosCnt;
    if (lastPagePhotosCnt < 3 && nextPagesCnt > 1) {
      const len = nextPagesCnt;
      if (len === 2 || lastPagePhotosCnt === 2) {
        otherPagesPhotosCnt[len - 2] = 3;
        otherPagesPhotosCnt[len - 1] = lastPagePhotosCnt + 1;
      } else if (len > 2 && lastPagePhotosCnt === 1) {
        otherPagesPhotosCnt[len - 3] = 3;
        otherPagesPhotosCnt[len - 2] = 3;
        otherPagesPhotosCnt[len - 1] = 3;
      }
    }
  }

  if (lastPageSplitToTwo && otherPagesPhotosCnt.length) {
    const lastPagePhotoCnt =
      otherPagesPhotosCnt[otherPagesPhotosCnt.length - 1];
    if (lastPagePhotoCnt > 1) {
      if (lastPagePhotoCnt === 2) {
        otherPagesPhotosCnt[otherPagesPhotosCnt.length - 1] = 1;
        otherPagesPhotosCnt.push(1);
      }
      if (lastPagePhotoCnt === 3) {
        otherPagesPhotosCnt[otherPagesPhotosCnt.length - 1] = 2;
        otherPagesPhotosCnt.push(1);
      }
      if (lastPagePhotoCnt === 4) {
        otherPagesPhotosCnt[otherPagesPhotosCnt.length - 1] = 2;
        otherPagesPhotosCnt.push(2);
      }
    }
  }

  let curIdx = cntUnderMeta;
  const nextPages: FileInfoWithMeta[][] = [];
  while (curIdx < totalCnt) {
    const curPage = nextPages.length;
    const pagePhotoCnt = otherPagesPhotosCnt[curPage] || 1;
    const filesOfPage = new Array(pagePhotoCnt)
      .fill(null)
      .map((_, i) => files[i + curIdx]);
    nextPages.push(filesOfPage);
    curIdx += pagePhotoCnt;
  }
  if (log) {
    console.log(
      `allocPhotoFilesByPage - ${log}`,
      { underMeta, nextPages },
      `${cntUnderMeta} / ${otherPagesPhotosCnt.join(', ')}`,
    );
  }
  return { underMeta, nextPages };
}

export { allocPhotoFilesByPage };
