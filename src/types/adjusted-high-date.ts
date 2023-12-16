export type AdjustedHighDate = Date & {
  readonly __adjustedLowDate: unique symbol;
};
