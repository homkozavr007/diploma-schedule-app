import { AdjustedHighDate } from "./adjusted-high-date";
import { AdjustedLowDate } from "./adjusted-low-date";

export interface AdjustedDateRange {
  start: AdjustedLowDate;
  end: AdjustedHighDate;
}
