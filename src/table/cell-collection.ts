import { TableCell } from "./cell";
import { RowData } from "./table-config";

export class TableCellCollection<TRow extends RowData> {
  private cellsByRow: Map<string, Map<keyof TRow, TableCell<TRow, unknown>>> =
    new Map();
  private cellsByCol: Map<keyof TRow, Map<string, TableCell<TRow, unknown>>> =
    new Map();

  public addCell<TCellData>(cell: TableCell<TRow, TCellData>): void {
    let rowMap = this.cellsByRow.get(cell.rowId);
    if (!rowMap) {
      rowMap = new Map();
      this.cellsByRow.set(cell.rowId, rowMap);
    }
    rowMap.set(cell.columnId, cell);

    let colMap = this.cellsByCol.get(cell.columnId);
    if (!colMap) {
      colMap = new Map();
      this.cellsByCol.set(cell.columnId, colMap);
    }
    colMap.set(cell.rowId, cell);
  }

  public getRow(
    rowId: string
  ): Map<keyof TRow, TableCell<TRow, unknown>> | undefined {
    return this.cellsByRow.get(rowId);
  }

  public getCol(
    colId: keyof TRow
  ): Map<string, TableCell<TRow, unknown>> | undefined {
    return this.cellsByCol.get(colId);
  }

  public getCell(
    rowId: string,
    colId: keyof TRow
  ): TableCell<TRow, unknown> | undefined {
    return this.cellsByRow.get(rowId)?.get(colId);
  }

  public removeCell(rowId: string, colId: keyof TRow): void {
    this.cellsByRow.get(rowId)?.delete(colId);
    this.cellsByCol.get(colId)?.delete(rowId);
  }

  public *allCells(): Iterable<TableCell<TRow, unknown>> {
    for (const rowMap of this.cellsByRow.values()) {
      for (const cell of rowMap.values()) {
        yield cell;
      }
    }
  }
}
