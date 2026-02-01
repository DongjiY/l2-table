import { TableCell } from "../table/components/table-cell";

export class CellIndex {
  private rowCollection: Map<string, Set<TableCell>> = new Map();
  private columnCollection: Map<string, Set<TableCell>> = new Map();
  private cellMap: Map<TableCell, { rowId: string; columnId: string }> =
    new Map();

  public register(columnId: string, rowId: string, cell: TableCell): void {
    const existingCellDetails = this.cellMap.get(cell);

    if (
      existingCellDetails &&
      existingCellDetails.columnId === columnId &&
      existingCellDetails.rowId === rowId
    )
      return; // if there is no change then return

    if (existingCellDetails) {
      this.rowCollection.get(existingCellDetails.rowId)?.delete(cell);
      this.columnCollection.get(existingCellDetails.columnId)?.delete(cell);
    }

    this.addRowItemOrCreate(rowId, cell);
    this.addColumnItemOrCreate(columnId, cell);

    this.cellMap.set(cell, { columnId, rowId });
  }

  private addRowItemOrCreate(rowId: string, cell: TableCell): void {
    if (this.rowCollection.get(rowId) === undefined) {
      this.rowCollection.set(rowId, new Set());
    }
    this.rowCollection.get(rowId)?.add(cell);
  }

  private addColumnItemOrCreate(columnId: string, cell: TableCell): void {
    if (this.columnCollection.get(columnId) === undefined) {
      this.columnCollection.set(columnId, new Set());
    }
    this.columnCollection.get(columnId)?.add(cell);
  }

  public getCellsForColumn(cell: TableCell): Array<TableCell> {
    const cellData = this.cellMap.get(cell);
    if (!cellData) return [];
    return this.getCellsForColumnById(cellData.columnId);
  }

  public getCellsForColumnById(columnId: string): Array<TableCell> {
    return Array.from(this.columnCollection.get(columnId) ?? []);
  }

  public getCellsForRow(cell: TableCell): Array<TableCell> {
    const cellData = this.cellMap.get(cell);
    if (!cellData) return [];
    return this.getCellsForRowById(cellData.rowId);
  }

  public getCellsForRowById(rowId: string): Array<TableCell> {
    return Array.from(this.rowCollection.get(rowId) ?? []);
  }
}
