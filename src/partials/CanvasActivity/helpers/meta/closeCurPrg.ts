import { micromark } from 'micromark'; // Markdown
import { toMarkdown } from 'mdast-util-to-markdown'; // Markdown AST

import { getMetaValue } from './mdValue';

import type { Root as MdAstRoot, RootContent as MdAstRootContent } from 'mdast'; // Markdown AST
import type { MetaCntWCurPgs, MetaInfoTypeBase as MInfoB } from './types';

/**
 * The content for one type is finished. Need close it and update the obj. Side
 * Effect: This will directly modify the input obj.
 */
const closeCurPrg = <T extends MInfoB>(
  obj: MetaCntWCurPgs<T>,
  options?: { not: T | '__meta__', doNotRemoveEmptyOrDashOnlyRows?: boolean },
) => {
  if (obj.__current_in_progress__) {
    const { type, children } = obj.__current_in_progress__;
    const isToClose = !options?.not || options.not !== type;
    if (isToClose) {
      if (type !== '__meta__') {
        const isApplicable = (ch: MdAstRootContent) => {
          if (ch.type !== 'paragraph' && ch.type !== 'text') {
            return true;
          }
          const v = getMetaValue(ch).trim();
          return v && v !== '-' && v.toLowerCase() !== 'n.a.';
        };
        const chApplicable = options?.doNotRemoveEmptyOrDashOnlyRows
          ? children
          : children.filter(isApplicable);
        const ast: MdAstRoot = { type: 'root', children: chApplicable };
        const md = toMarkdown(ast);
        const html = micromark(md).trim();
        Object.assign(obj, {
          [type]: { ast, md, html },
          __current_in_progress__: undefined,
        });
      } else {
        Object.assign(obj, {
          __current_in_progress__: undefined,
        });
      }
    }
  }
};

export { closeCurPrg };
