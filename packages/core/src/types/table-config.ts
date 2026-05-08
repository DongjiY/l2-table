import { Observable } from "rxjs";
import { TableData } from "../utils/table-data";
import { TableCellStyles, TableHeaderResizerStyles } from "./styles";
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
    resizer?: TableHeaderResizerStyles;
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
  renderCell?: RenderCellFactory;
};

export type RenderCellFactory = (
  ...args: ConstructorParameters<typeof TableCell>
) => TableCell;

export type TableRow<TPlaceholders extends Record<string, unknown> = {}> = {
  rowId: string;
  placeholders: TPlaceholders;
};

export type TableSourceObservable = Observable<TableSourceData>;

export type TableSourceData = {
  columnId: string;
  rowId: string;
  data: unknown;
};
