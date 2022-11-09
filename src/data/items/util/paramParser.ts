type ParamPattern<T> = [
  pattern: (param: string) => boolean,
  parser: (param: string) => T
];
type ParamPatternNames =
  "number" | "integer" | "zeroOne" | "string" | "boardPosition";
interface ParamPatternReturns {
  "number": number;
  "integer": number;
  "zeroOne": 0 | 1;
  "string": string;
  "boardPosition": [x: number, y: number];
}
export const paramPatterns: { [K in ParamPatternNames]: ParamPattern<ParamPatternReturns[K]> } = {
  "number": [
    (param) => !isNaN(Number(param)),
    (param) => Number(param)
  ],
  "integer": [
    (param) => Number.isInteger(Number(param)),
    (param) => Number(param)
  ],
  "zeroOne": [
    (param) => {
      const n = Number(param);
      if (n === 0 || n === 1) return true;
      return false;
    },
    (param) => Number(param) as 0 | 1
  ],
  "string": [
    (_param) => true,
    (param) => param
  ],
  "boardPosition": [
    (param) => /^\d+[a-z]+$/i.test(param),
    (param) => {
      for (let i = 0; i < param.length; i++) {
        if (parseInt(param[i], 36) >= 10) {
          let x = param.slice(0, i);
          let y = param.slice(i);
          return [Number(x) - 1, parseInt(y, 36) - 10];
        }
      }
      return [-1, -1];
    }
  ]
};

export function paramParser<A, B=undefined, C=undefined, D=undefined, E=undefined>(
  param: string[],
  patterns:
    [ParamPattern<A>, ParamPattern<B>, ParamPattern<C>, ParamPattern<D>, ParamPattern<E>] |
    [ParamPattern<A>, ParamPattern<B>, ParamPattern<C>, ParamPattern<D>] |
    [ParamPattern<A>, ParamPattern<B>, ParamPattern<C>] |
    [ParamPattern<A>, ParamPattern<B>] |
    [ParamPattern<A>]
) {
  type ParsedParam =
    E extends undefined ?
      (D extends undefined ?
        (C extends undefined ?
          (B extends undefined ?
          [A] :
          [A, B]) :
          [A, B, C]) :
        [A, B, C, D]) :
      [A, B, C, D, E];
  // @ts-ignore
  const parsedParam: ParsedParam = [];
  for (let i = 0; i < patterns.length; i++) {
    const paramToCheck = param[i];
    const paramPattern = patterns[i];
    if (!paramPattern) continue;
    const [pattern, parser] = paramPattern;
    if (!pattern(paramToCheck)) return false;
    parsedParam[i] = parser(paramToCheck);
  }
  return parsedParam;
}
