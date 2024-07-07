export const flatArgs = function (args: string[]): string[] {
  return args
    .slice(2)
    .map((arg) => arg.split("="))
    .flat();
};
