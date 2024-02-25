import type { Root as MdAstRoot, RootContent as MdAstRootContent } from 'mdast'; // Markdown AST
import type { MetaInfoTypeBase } from '../../types.config';

type MetaContentForType = {
  md: string,
  html: string,
  innerHtmlForHeading?: string,
  list?: string[], // For Developments, Infant Teachers
  ast?: MdAstRoot,
};
type MetaContent<T extends MetaInfoTypeBase> = Record<T, MetaContentForType>;

type CurrentProgress<MInfoType extends MetaInfoTypeBase> = {
  __current_in_progress__?: {
    type: MInfoType | '__meta__',
    children: MdAstRootContent[],
  },
};

type MetaCntWCurPgs<MInfoType extends MetaInfoTypeBase> =
  MetaContent<MInfoType> & CurrentProgress<MInfoType>;

export type {
  MetaInfoTypeBase,
  MetaContentForType,
  MetaContent,
  CurrentProgress,
  MetaCntWCurPgs,
};
