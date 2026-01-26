import { TableData } from "./table-data";

export class CellDataStore {
  private cellData: Map<string, TableData<unknown>> = new Map();

  private toKey(rowId: string, columnId: string): string {
    return `${rowId}#${columnId}`;
  }

  public getCellData(
    rowId: string,
    columnId: string,
    dataFactory: () => TableData<unknown>,
  ): TableData<unknown> {
    let cellData = this.cellData.get(this.toKey(rowId, columnId));
    if (!cellData) {
      cellData = dataFactory();
      this.cellData.set(this.toKey(rowId, columnId), cellData);
    }
    return cellData;
  }

  public tryGetCellData(
    rowId: string,
    columnId: string,
  ): TableData<unknown> | undefined {
    return this.cellData.get(this.toKey(rowId, columnId));
  }
}
