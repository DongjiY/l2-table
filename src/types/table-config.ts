import { Observable } from "rxjs";
import { TableData } from "../table/components/table-data";
import { TableCellFontStyling } from "./table-cell-types";

export type TableOptions<C extends TableColumns> = {
  config: TableConfig<C>;
  source: TableSourceObservable<C>;
};

export type TableConfig<C extends TableColumns> = {
  columns: C;
  rows: Array<TableRow<C>>;
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

export type TableColumnData<T> = {
  name: string;
  hidden: boolean;
  minWidth: number;
  maxWidth: number;
  autoResize: boolean;
};

export type TableColumns = {
  [columnId: string]: TableColumnData<any>;
};

export type TableRow<C extends TableColumns> = {
  rowId: string;
  cells: {
    [K in keyof C]: TableRowData<C, K>;
  };
};

export type TableRowData<C extends TableColumns, K extends keyof C> = {
  cellData: () => TableData<C[K] extends TableColumnData<infer T> ? T : never>;
};

export type TableSourceObservable<C extends TableColumns> = Observable<
  TableSourceData<C>
>;

export type TableSourceData<C extends TableColumns> = {
  columnId: keyof C;
  rowId: string;
  data: unknown;
};
