/** Always to lower case */
const getExtensionFromSrc = (src: string) => {
  if (!src || !src.includes('.')) {
    return '';
  }
  const possibleExt = src.split('.').pop();
  return possibleExt?.toLocaleLowerCase() || '';
};

export { getExtensionFromSrc };
