import type PlaceableBase from "../game/core/PlaceableBase.js";

type ReplacePattern = [pattern: RegExp | string, replaceValue: string];
export const replacePatterns: ReplacePattern[] = [
  [/\$dmg/ig, "**DMG**"],
];

export const messages = {
  "attack": (from: PlaceableBase, to: PlaceableBase, dmg: number) => {
    return `**${from.displayName}** attacked **${to.displayName}** with **${dmg}** $DMG`;
  }
};
