import { endOfMonth, startOfMonth } from "date-fns";

export function normalizeDateRange(
  start: string | null,
  end: string | null
): { start: Date; end: Date } {
  let startDate = start ? new Date(start) : startOfMonth(new Date());
  if (startDate.toString() === "Invalid Date") {
    startDate = startOfMonth(new Date());
  }
  let endDate = end ? new Date(end) : endOfMonth(new Date());
  if (endDate.toString() === "Invalid Date") {
    endDate = endOfMonth(new Date());
  }
  if (startDate > endDate) {
    const t = startDate;
    startDate = endDate;
    endDate = t;
  }
  return {
    start: startDate,
    end: endDate,
  };
}
