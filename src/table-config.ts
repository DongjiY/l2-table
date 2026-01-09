export type TableConfig = {
  columns: Array<TableColumn>;
  rows: Array<TableRow>;
  rowHeight: number;
};

export type TableColumn = {
  id: string;
  header: string;
};

export type TableRow = {
  id: string;
};

export type SourceData<TData> = {
  rowId: string;
  columnId: string;
  content: TData;
};
