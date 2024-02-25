import { micromark } from 'micromark'; // Markdown
import { toMarkdown } from 'mdast-util-to-markdown'; // Markdown AST
import { closeCurPrg } from './closeCurPrg';
import { getMetaValue } from './mdValue';

import type { Root as MdAstRoot, RootContent as MdAstRootContent } from 'mdast'; // Markdown AST
import type {
  MetaContent,
  CurrentProgress,
  MetaCntWCurPgs,
  MetaContentForType,
  MetaInfoTypeBase as MInfoB,
} from './types';

const splitMdMetaContent = <T extends MInfoB>(
  children: MdAstRootContent[],
  options: {
    metaInfoTypes: T[],
  },
): MetaContent<T> => {
  const allTypes = options.metaInfoTypes;
  const inited: MetaCntWCurPgs<T> = allTypes.reduce<MetaContent<T>>(
    (acc, type) => {
      Object.assign(acc, { [type]: { md: '', html: '' } });
      return acc;
    },
    {} as MetaContent<T>,
  );

  const output = children.reduce<MetaCntWCurPgs<T>>((acc, chItem, i, arr) => {
    // Title (h2 Heading. Pick first one only, ignore rest)
    if (
      chItem.type === 'heading' &&
      chItem.depth === 2 &&
      !acc['title' as T].html
    ) {
      const ast: MdAstRoot = { type: 'root', children: [chItem] };
      const md = toMarkdown(ast);
      const html = micromark(md).trim();
      const innerHtmlForHeading = html
        .replace(/^<h2>/, '')
        .replace(/<\/h2>$/, '');
      Object.assign(acc, {
        title: { ast, md, html, innerHtmlForHeading },
      });
    }

    const initCurPrg = (options: { is: MInfoB | T | '__meta__' }) => {
      const type = options.is as T | '__meta__';
      closeCurPrg(acc, { not: type });
      const curPrg: CurrentProgress<T> = {
        __current_in_progress__: {
          type,
          children: [],
        },
      };
      Object.assign(acc, curPrg);
    };

    // -- Check H3 for CurrentProgress kick start (except "Meta" h3) --
    if (chItem.type === 'heading' && chItem.depth === 3) {
      const firstCh = chItem.children[0];
      if (!firstCh || firstCh.type !== 'text') {
        closeCurPrg(acc);
        return acc;
      }
      const h3Content = firstCh.value.toLowerCase();
      if (h3Content === 'objectives') {
        initCurPrg({ is: 'objective' });
      }
      if (h3Content === 'description') {
        initCurPrg({ is: 'description' });
      }
      if (h3Content === 'developments') {
        initCurPrg({ is: 'developments' });
      }
      if (h3Content === 'meta') {
        initCurPrg({ is: '__meta__' });
      }
    }
    if (
      (chItem.type !== 'heading' || chItem.depth > 3) &&
      acc.__current_in_progress__
    ) {
      // -- Meta Case --
      if (acc.__current_in_progress__.type === '__meta__') {
        const value = getMetaValue(chItem);
        // - Teacher -
        if (/teacher:/gi.test(value)) {
          const typeB: MInfoB = 'teachers';
          const type = typeB as T;
          if (!acc[type].list) {
            Object.assign(acc[type], { list: [] });
          }
          (value.split(':')[1] || '').split(/[,\n]/).forEach((s) => {
            const tname = s.trim().replace(/^-/, '').trim();
            if (tname && !acc[type].list?.includes?.(tname)) {
              acc[type].list?.push(tname);
              acc[type].md = acc[type].md + `- ${tname}\n`;
              acc[type].html = acc[type].html + `<li>${tname}</li>`;
            }
          });
        } else if (/timestamp:/gi.test(value)) {
          // - Timestamps -
          const rows = value.split(/\n/);
          rows.forEach((row) => {
            if (row && /activity\stimestamp:/gi.test(row)) {
              const ts = row.split(/timestamp:/i)[1]?.trim() || '';
              const typeM: MInfoB = 'activity_ts';
              const v: MetaContentForType = {
                md: ts,
                html: ts,
              };
              Object.assign(acc, {
                [typeM]: v,
              });
            }
            if (row && /publish\stimestamp:/gi.test(row)) {
              const ts = row.split(/timestamp:/i)[1]?.trim() || '';
              const typeM: MInfoB = 'publish_ts';
              const v: MetaContentForType = {
                md: ts,
                html: ts,
              };
              Object.assign(acc, {
                [typeM]: v,
              });
            }
          });
        }
      } else {
        // -- Other Content Case --
        acc.__current_in_progress__.children.push(chItem);
      }
    }

    if (i === arr.length - 1) {
      closeCurPrg(acc);
    }
    return acc;
  }, inited);

  return output;
};

export { splitMdMetaContent };
