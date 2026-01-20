import {
  StringTableData,
  type TableColumns,
  type TableConfig,
  type TableRow,
} from "../../../dist";

const cols: TableColumns = {
  avg: {
    minWidth: 0,
    maxWidth: 140,
    name: "average",
    hidden: false,
  },
  med: {
    minWidth: 0,
    maxWidth: 140,
    name: "median",
    hidden: false,
  },
  min: {
    minWidth: 0,
    maxWidth: 140,
    name: "minimum",
    hidden: false,
  },
  max: {
    minWidth: 0,
    maxWidth: 140,
    name: "maximum",
    hidden: false,
  },
  p75: {
    minWidth: 0,
    maxWidth: 140,
    name: "p75",
    hidden: false,
  },
  p90: {
    minWidth: 0,
    maxWidth: 140,
    name: "p90",
    hidden: false,
  },
};
export type ColsType = typeof cols;

const rows: TableRow<ColsType>[] = [
  {
    rowId: "0",
    cells: {
      avg: {
        cellData: () => new StringTableData(),
      },
      med: {
        cellData: () => new StringTableData(),
      },
      min: {
        cellData: () => new StringTableData(),
      },
      max: {
        cellData: () => new StringTableData(),
      },
      p75: {
        cellData: () => new StringTableData(),
      },
      p90: {
        cellData: () => new StringTableData(),
      },
    },
  },
];

export const config: TableConfig<ColsType> = {
  columns: cols,
  rows,
};
