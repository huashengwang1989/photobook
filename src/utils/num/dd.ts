const dd = (number: number | string | undefined | null) => {
  if (typeof number !== 'number' && (typeof number !== 'string' || !number)) {
    return '';
  }
  const num = Number(number);
  if (Number.isNaN(num)) {
    return '';
  }
  const n = Math.round(num);
  const signAppend = n < 0 ? '-' : '';
  const nPositive = Math.abs(n);
  if (nPositive < 10) {
    return `${signAppend}0${nPositive}`;
  }
  return `${signAppend}${nPositive}`;
};

export { dd };
