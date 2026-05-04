import { Observable } from "rxjs";
import { TableData } from "../utils/table-data";
import { TableCellStyles } from "./table-cell-types";
import { TableCell } from "../table/components/table-cell";

export type TableOptions<TDataRow extends TableRow> = {
  config: TableConfig<TDataRow>;
  source: TableSourceObservable;
};

export type TableConfig<TDataRow extends TableRow> = {
  columns: Array<TableColumnDef<TDataRow>>;
  rows: Array<TDataRow>;
  style: TableStyles;
};

export type TableStyles = {
  body: {
    cell?: TableCellStyles;
    row: {
      height: number;
    };
  };
  header: {
    cell?: TableCellStyles;
    row: {
      height: number;
    };
  };
};

export type TableColumnDef<TDataRow extends TableRow, TValue = unknown> = {
  columnId: string;
  name: string;
  hidden: boolean;
  minWidth?: number;
  maxWidth?: number;
  autoResize: boolean;
  placeholderAccessorFn: (row: TDataRow) => TValue;
  cellData: () => TableData<TValue>;
  renderCell?: () => TableCell;
};

export type TableRow = {
  rowId: string;
  placeholders: Record<string, unknown>;
};

export type TableSourceObservable = Observable<TableSourceData>;

export type TableSourceData = {
  columnId: string;
  rowId: string;
  data: unknown;
};
