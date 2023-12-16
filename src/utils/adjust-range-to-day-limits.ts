import { addDays, startOfDay } from "date-fns";
import { AdjustedLowDate } from "../types/adjusted-low-date";
import { AdjustedHighDate } from "../types/adjusted-high-date";
import { AdjustedDateRange } from "../types/adjusted-date-range";

export function adjustRangeToDayLimits(range: {
  start: Date;
  end: Date;
}): AdjustedDateRange {
  const startDay: AdjustedLowDate = startOfDay(range.start) as any;
  const endDay: AdjustedHighDate = addDays(startOfDay(range.end), 1) as any;
  return {
    start: startDay,
    end: endDay,
  };
}
