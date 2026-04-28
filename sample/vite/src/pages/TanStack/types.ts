export type ComparisonRow = {
  rowId: string;
  index: number;
  avg: number;
  med: number;
  min: number;
  max: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  p99: number;
  poop: number;
  "2": number;
  "1": number;
};

export type CellColumnId = Exclude<keyof ComparisonRow, "rowId">;
