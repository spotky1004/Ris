type ReplacePattern = [pattern: RegExp | string, replaceValue: string];
const replacePatterns: ReplacePattern[] = [
  [/\$dmg/ig, "**DMG**"],
];

export default replacePatterns;
