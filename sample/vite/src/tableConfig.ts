import {
  type TableColumns,
  type TableConfig,
  type TableRow,
} from "../../../dist";
import { NumberTableData } from "./numberTableData";

const cols = {
  avg: {
    autoResize: false,
    minWidth: 0,
    maxWidth: 140,
    name: "average",
    hidden: false,
  },
  med: {
    autoResize: false,
    minWidth: 0,
    maxWidth: 140,
    name: "median",
    hidden: false,
  },
  min: {
    autoResize: false,
    minWidth: 0,
    maxWidth: 140,
    name: "minimum",
    hidden: false,
  },
  max: {
    autoResize: false,
    minWidth: 0,
    maxWidth: 140,
    name: "maximum",
    hidden: false,
  },
  p50: {
    autoResize: false,
    minWidth: 0,
    maxWidth: 140,
    name: "p50",
    hidden: false,
  },
  p75: {
    autoResize: false,
    minWidth: 0,
    maxWidth: 140,
    name: "p75",
    hidden: false,
  },
  p90: {
    autoResize: false,
    minWidth: 0,
    maxWidth: 140,
    name: "p90",
    hidden: false,
  },
  p95: {
    autoResize: false,
    minWidth: 0,
    maxWidth: 140,
    name: "p95",
    hidden: false,
  },
  p99: {
    autoResize: false,
    minWidth: 0,
    maxWidth: 140,
    name: "p99",
    hidden: false,
  },
  poop: {
    autoResize: false,
    minWidth: 0,
    maxWidth: 140,
    name: "poop",
    hidden: false,
  },
};

export type ColsType = typeof cols;

const cells = {
  avg: {
    cellData: () => new NumberTableData(),
  },
  med: {
    cellData: () => new NumberTableData(),
  },
  min: {
    cellData: () => new NumberTableData(),
  },
  max: {
    cellData: () => new NumberTableData(),
  },
  p50: {
    cellData: () => new NumberTableData(),
  },
  p75: {
    cellData: () => new NumberTableData(),
  },
  p90: {
    cellData: () => new NumberTableData(),
  },
  p95: {
    cellData: () => new NumberTableData(),
  },
  p99: {
    cellData: () => new NumberTableData(),
  },
  poop: {
    cellData: () => new NumberTableData(),
  },
} satisfies TableRow<ColsType>["cells"];

function generateRows(rowCount: number = 1): Array<TableRow<ColsType>> {
  const res = [];
  for (let i = 0; i < rowCount; i++) {
    res.push({
      rowId: `${i}`,
      cells,
    });
  }
  return res;
}

export const config: TableConfig<ColsType> = {
  columns: cols,
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
