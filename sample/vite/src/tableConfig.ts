import type { TableRow, TableColumnDef, TableConfig } from "../../../dist";
import { NumberTableData } from "./numberTableData";

export type StatsRow = TableRow & {
  placeholders: {
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
};

/**
 * Column definitions (ordered, explicit)
 */
const columns: Array<TableColumnDef<StatsRow, number>> = [
  {
    columnId: "avg",
    name: "average",
    hidden: false,
    minWidth: 0,
    maxWidth: 140,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.avg,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "med",
    name: "median",
    hidden: false,
    minWidth: 0,
    maxWidth: 140,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.med,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "min",
    name: "minimum",
    hidden: false,
    minWidth: 0,
    maxWidth: 140,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.min,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "max",
    name: "maximum",
    hidden: false,
    minWidth: 0,
    maxWidth: 140,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.max,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "p50",
    name: "p50",
    hidden: false,
    minWidth: 0,
    maxWidth: 140,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.p50,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "p75",
    name: "p75",
    hidden: false,
    minWidth: 0,
    maxWidth: 140,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.p75,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "p90",
    name: "p90",
    hidden: false,
    minWidth: 0,
    maxWidth: 140,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.p90,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "p95",
    name: "p95",
    hidden: false,
    minWidth: 0,
    maxWidth: 140,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.p95,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "p99",
    name: "p99",
    hidden: false,
    minWidth: 0,
    maxWidth: 140,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.p99,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "poop",
    name: "poop",
    hidden: false,
    minWidth: 0,
    maxWidth: 140,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.poop,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "2",
    name: "two",
    hidden: false,
    minWidth: 0,
    maxWidth: 140,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders["2"],
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "1",
    name: "one",
    hidden: false,
    minWidth: 0,
    maxWidth: 140,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders["1"],
    cellData: () => new NumberTableData(),
  },
];

/**
 * Row generator
 */
function generateRows(rowCount = 1): StatsRow[] {
  const res: StatsRow[] = [];

  for (let i = 0; i < rowCount; i++) {
    res.push({
      rowId: `${i}`,
      placeholders: {
        avg: 0,
        med: 0,
        min: 0,
        max: 0,
        p50: 0,
        p75: 0,
        p90: 0,
        p95: 0,
        p99: 0,
        poop: 0,
        "2": 0,
        "1": 0,
      },
    });
  }

  return res;
}

/**
 * Final table config
 */
export const config: TableConfig<StatsRow> = {
  columns,
  rows: generateRows(200),
  style: {
    body: {
      row: {
        height: 40,
      },
      cell: {
        text: {
          font: "24px monospace",
          alignment: "middle",
          color: "blue",
        },
      },
    },
    header: {
      row: {
        height: 60,
      },
      cell: {
        text: {
          font: "24px 'Playfair Display'",
          alignment: "middle",
          color: "red",
        },
      },
    },
  },
};
