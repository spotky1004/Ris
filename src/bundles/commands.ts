import path from "path";
import readModules from "../util/readModules.js";
import getPath from "../util/getPath.js";
import type { CommandData } from "../command/functions/createCommand.js";

const { __dirname } = getPath(import.meta.url);

const commands = new Map(Object.entries(await readModules({
  dirname: path.join(__dirname, "../command/data")
})).map(([key, command]) => [key, command.default])) as Map<string, CommandData>;

export default commands;
