import { TableData } from "./table-data";

export type RowData = Record<string, any>;

export type StringKeyOf<T> = Extract<keyof T, string>;

export type TableConfig<TRow extends RowData> = {
  columns: Array<TableColumn<TRow>>;
  rows: Array<TableRow>;
  headerHeight: number;
  rowHeight: number;
};

export type TableColumn<
  TRow extends RowData,
  K extends StringKeyOf<TRow> = StringKeyOf<TRow>
> = {
  id: K;
  header: string;
  minW: number;
  maxW: number;
  cellDataFactory: () => TableData<TRow[K]>;
};

export type TableRow = {
  id: string;
};

export type SourceData<TRow extends RowData> = {
  rowId: string;
  columnId: keyof TRow;
  content: TRow[keyof TRow];
};
