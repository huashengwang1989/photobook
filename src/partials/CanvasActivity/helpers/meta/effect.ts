import { useCallback, useMemo } from 'react';
import { micromark } from 'micromark'; // Markdown
import { fromMarkdown } from 'mdast-util-from-markdown'; // Markdown AST

import { splitMdMetaContent } from './mdContentSplit';

import type { Root as MdAstRoot } from 'mdast'; // Markdown AST
import type { FileInfoWithMeta } from '../../types.file';
import type { MetaInfoTypeBase } from './types';

function useMetaFileContent<T extends MetaInfoTypeBase>(props: {
  metaInfoTypes: T[],
  metaFile: FileInfoWithMeta | null,
}) {
  const { metaFile, metaInfoTypes } = props;

  const getMetaFileContent = useCallback(async () => {
    if (!metaFile) {
      return null;
    }
    const res = await fetch(metaFile.assetUrl);
    const markdown = await res.text();
    if (!markdown) {
      return null;
    }
    const html = micromark(markdown);
    const astTree = fromMarkdown(markdown);
    return {
      markdown,
      html,
      astTree,
    };
  }, [metaFile]);

  const parseMetaFileContent = useCallback(
    (root: MdAstRoot) => {
      const { children } = root;
      const mdContentSplit = splitMdMetaContent<T>(children, {
        metaInfoTypes,
      });
      return mdContentSplit;
    },
    [metaInfoTypes],
  );

  const getAndParseMetaFileContent = useCallback(async () => {
    const f = await getMetaFileContent();
    if (!f || !f.astTree) {
      return null;
    }
    return parseMetaFileContent(f.astTree);
  }, [getMetaFileContent, parseMetaFileContent]);

  const output = useMemo(
    () => ({ getAndParseMetaFileContent }),
    [getAndParseMetaFileContent],
  );

  return output;
}

export { useMetaFileContent };
