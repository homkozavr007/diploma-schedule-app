import { format } from "date-fns";

export function dateToString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function dateRangeToString(start: Date, end?: Date): [string, string] {
  return [dateToString(start), dateToString(end ?? start)];
}
