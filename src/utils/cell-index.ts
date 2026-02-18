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

  public getCellsForColumn(
    cell: TableCell,
  ): Array<{ cell: TableCell; rowId?: string; columnId?: string }> {
    const cellData = this.cellMap.get(cell);
    if (!cellData) return [];
    return this.getCellsForColumnById(cellData.columnId);
  }

  public getCellsForColumnById(
    columnId: string,
  ): Array<{ cell: TableCell; rowId?: string; columnId?: string }> {
    return Array.from(this.columnCollection.get(columnId) ?? []).map(
      (cell) => ({
        cell,
        rowId: this.cellMap.get(cell)?.rowId,
        columnId,
      }),
    );
  }

  public getCellsForRow(
    cell: TableCell,
  ): Array<{ cell: TableCell; rowId?: string; columnId?: string }> {
    const cellData = this.cellMap.get(cell);
    if (!cellData) return [];
    return this.getCellsForRowById(cellData.rowId);
  }

  public getCellsForRowById(
    rowId: string,
  ): Array<{ cell: TableCell; rowId?: string; columnId?: string }> {
    return Array.from(this.rowCollection.get(rowId) ?? []).map((cell) => ({
      cell,
      rowId,
      columnId: this.cellMap.get(cell)?.columnId,
    }));
  }

  public clear(): void {
    this.rowCollection.clear();
    this.columnCollection.clear();
    this.cellMap.clear();
  }
}
