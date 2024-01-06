const DEFAULT_REDUCER_STRING =
  'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';

function reduceNumberBy(acc: string, num: number, str: string) {
  if (!str.length || !num) {
    return acc;
  }
  const val = Math.abs(num);
  if (val < str.length) {
    return `${acc}str[val]`;
  }
  const next = Math.floor(val / str.length);
  const r = val % str.length;
  return reduceNumberBy(`${acc}${r}`, next, str);
}

function genUid() {
  const curTime = new Date().getTime();
  const randomSuffix = Math.floor(Math.random() * 10000);
  const numForReducer = curTime * 10000 + randomSuffix;
  return reduceNumberBy('', numForReducer, DEFAULT_REDUCER_STRING);
}

export { genUid };
