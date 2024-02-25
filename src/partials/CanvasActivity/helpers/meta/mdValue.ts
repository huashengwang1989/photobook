import type { RootContent as MdAstRootContent } from 'mdast'; // Markdown AST

/** This is for the customised case here. It is not meant as a generic solution. */
const getMetaValue = (item: MdAstRootContent): string => {
  if (item.type === 'text') {
    return item.value;
  }
  if (
    item.type === 'paragraph' ||
    item.type === 'list' ||
    item.type === 'listItem'
  ) {
    const ch = item.children[0];
    return getMetaValue(ch);
  }
  return '';
};

export { getMetaValue };
