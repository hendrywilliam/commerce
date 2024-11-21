"use server";

import { ParseArgsConfig } from "util";
import { parseArgs } from "node:util";

export const getProcArgv = function (options: ParseArgsConfig["options"]): {
  [longOption: string]: undefined | string | boolean | Array<string | boolean>;
} {
  const flatten = process.argv
    .slice(2)
    .map((arg) => arg.split("="))
    .flat();
  const { values } = parseArgs({ args: flatten, options });
  return values;
};
