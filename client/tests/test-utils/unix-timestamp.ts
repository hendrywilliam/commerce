export function dateToUnixTimestamp(date: Date) {
  return Math.floor(Date.parse(date.toString()) / 1000);
}
