export const replacePatterns = [
    [/\$dmg/ig, "**DMG**"],
];
export const messages = {
    "attack": (from, to, dmg) => {
        return `**${from.displayName}** attacked **${to.displayName}** with **${dmg}** $DMG`;
    }
};
