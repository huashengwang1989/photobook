
// eslint-disable-next-line prettier/prettier
type YearMonth = `${1|2}${number}${number}${number}-${number}${number}`;
type YyyyMmdd = `${1|2}${number}${number}${number}${0|1|2}${number}${0|1|2|3}${number}`;

export type { YearMonth, YyyyMmdd };
