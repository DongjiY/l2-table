import { TableCell } from "../table/components/table-cell";

export class CellCollection {
  private rowCollection: Map<string, Set<TableCell>>;
  private columnCollection: Map<string, Set<TableCell>>;

  constructor() {
    this.columnCollection = new Map();
    this.rowCollection = new Map();
  }

  public addCell(cell: TableCell): void {
    if (!this.rowCollection.has(cell.rowId))
      this.rowCollection.set(cell.rowId, new Set());
    this.rowCollection.get(cell.rowId)?.add(cell);

    if (!this.columnCollection.has(cell.columnId))
      this.columnCollection.set(cell.columnId, new Set());
    this.columnCollection.get(cell.columnId)?.add(cell);
  }

  public removeCell(cell: TableCell): void {
    this.rowCollection.get(cell.rowId)?.delete(cell);
    if (this.rowCollection.get(cell.rowId)?.size === 0)
      this.rowCollection.delete(cell.rowId);

    this.columnCollection.get(cell.columnId)?.delete(cell);
    if (this.columnCollection.get(cell.columnId)?.size === 0)
      this.columnCollection.delete(cell.columnId);
  }

  public *allCells(): IterableIterator<TableCell> {
    for (const cells of this.rowCollection.values()) {
      for (const cell of cells) {
        yield cell;
      }
    }
  }

  public getAllCellsInRow(rowId: string): Array<TableCell> {
    return Array.from(this.rowCollection.get(rowId) ?? []);
  }

  public getAllCellsInColumn(columnId: string): Array<TableCell> {
    return Array.from(this.columnCollection.get(columnId) ?? []);
  }
}
