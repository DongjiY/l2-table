import type {
  TableRow,
  TableColumnDef,
  TableConfig,
} from "../../../../../../dist";
import { NumberTableData } from "./numberTableData";
import { P50RenderCell } from "./p50RenderCell";

export type StatsRow = TableRow & {
  placeholders: {
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
};

const columns: Array<TableColumnDef<StatsRow, number>> = [
  {
    columnId: "index",
    name: "index",
    hidden: false,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.index,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "avg",
    name: "average",
    hidden: false,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.avg,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "med",
    name: "median",
    hidden: false,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.med,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "min",
    name: "minimum",
    hidden: false,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.min,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "max",
    name: "maximum",
    hidden: false,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.max,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "p50",
    name: "p50",
    hidden: false,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.p50,
    cellData: () => new NumberTableData(),
    renderCell: (style) => new P50RenderCell(style),
  },
  {
    columnId: "p75",
    name: "p75",
    hidden: false,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.p75,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "p90",
    name: "p90",
    hidden: false,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.p90,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "p95",
    name: "p95",
    hidden: false,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.p95,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "p99",
    name: "p99",
    hidden: false,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.p99,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "poop",
    name: "poop",
    hidden: false,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders.poop,
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "2",
    name: "two",
    hidden: false,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders["2"],
    cellData: () => new NumberTableData(),
  },
  {
    columnId: "1",
    name: "one",
    hidden: false,
    autoResize: false,
    placeholderAccessorFn: (row) => row.placeholders["1"],
    cellData: () => new NumberTableData(),
  },
];

function generateRows(rowCount = 1): StatsRow[] {
  const res: StatsRow[] = [];
  for (let i = 0; i < rowCount; i++) {
    res.push({
      rowId: `${i}`,
      placeholders: {
        index: i,
        avg: 0,
        med: 1,
        min: 2,
        max: 3,
        p50: 4,
        p75: 5,
        p90: 6,
        p95: 7,
        p99: 8,
        poop: 9,
        "2": 10,
        "1": 11,
      },
    });
  }
  return res;
}

export const config: TableConfig<StatsRow> = {
  columns,
  rows: generateRows(1000),
  style: {
    body: {
      row: {
        height: 40,
      },
      cell: {
        text: {
          font: "24px monospace",
          alignment: "right",
          color: "blue",
        },
        padding: {
          left: 6,
          right: 6,
        },
        hovered: {
          backgroundColor: "#fcba03",
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
        padding: {
          left: 6,
          right: 6,
        },
      },
    },
  },
};
