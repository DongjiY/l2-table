import { Observable } from "rxjs";
import { TableData } from "../utils/table-data";
import { TableCellFontStyling } from "./table-cell-types";

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
    cell: {
      text: TableCellFontStyling;
    };
    row: {
      height: number;
    };
  };
  header: {
    cell: {
      text: TableCellFontStyling;
    };
    row: {
      height: number;
    };
  };
};

export type TableColumnDef<TDataRow extends TableRow, TValue = unknown> = {
  columnId: string;
  name: string;
  hidden: boolean;
  minWidth: number;
  maxWidth: number;
  autoResize: boolean;
  placeholderAccessorFn: (row: TDataRow) => TValue;
  cellData: () => TableData<TValue>;
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
