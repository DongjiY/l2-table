import { Observable } from "rxjs";
import { TableData } from "../worker/table-components/table-data";

export type TableOptions<C extends TableColumns> = {
  config: TableConfig<C>;
  source: TableSourceObservable;
};

export type TableConfig<C extends TableColumns> = {
  columns: C;
  rows: Array<TableRow<C>>;
};

export type TableColumnData<T> = {
  name: string;
  hidden: boolean;
  minWidth: number;
  maxWidth: number;
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

export type TableSourceObservable = Observable<TableSourceData>;

export type TableSourceData = {
  columnId: string;
  rowId: string;
  data: unknown;
};
