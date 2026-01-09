export type TableConfig = {
  columns: Array<TableColumn>;
  rows: Array<TableRow>;
  headerHeight: number;
  rowHeight: number;
};

export type TableColumn = {
  id: string;
  header: string;
  minW: number;
  maxW: number;
};

export type TableRow = {
  id: string;
};

export type SourceData<TData> = {
  rowId: string;
  columnId: string;
  content: TData;
};
