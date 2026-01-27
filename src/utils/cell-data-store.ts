import { TableColumnDef, TableRow } from "../types/table-config";
import { TableData } from "./table-data";

export class CellDataStore<TDataRow extends TableRow> {
  private cellData: Map<string, TableData<unknown>> = new Map();
  private columnCellDataFactories: Map<string, () => TableData<unknown>> =
    new Map();

  constructor(columns: Array<TableColumnDef<TDataRow>>) {
    for (const column of columns) {
      this.columnCellDataFactories.set(column.columnId, column.cellData);
    }
  }

  private toKey(rowId: string, columnId: string): string {
    return `${rowId}#${columnId}`;
  }

  public getCellData(
    rowId: string,
    columnId: string,
    dataFactory?: () => TableData<unknown>,
  ): TableData<unknown> {
    let cellData = this.cellData.get(this.toKey(rowId, columnId));
    if (!cellData) {
      const columnFactory = this.columnCellDataFactories.get(columnId);
      if (dataFactory) {
        cellData = dataFactory();
      } else if (columnFactory) {
        cellData = columnFactory();
      } else {
        throw new Error(
          `No factory method found for ${columnId}. Is this columnId defined?`,
        );
      }
      this.cellData.set(this.toKey(rowId, columnId), cellData);
    }
    return cellData;
  }
}
