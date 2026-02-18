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
    console.log(rowId, columnId);
    let cellData = this.cellData.get(this.toKey(rowId, columnId));
    if (!cellData) {
      const columnFactory = this.columnCellDataFactories.get(columnId);
      if (dataFactory) {
        console.log("invoking data factory");
        cellData = dataFactory();
      } else if (columnFactory) {
        console.log("invoking column factory");
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
