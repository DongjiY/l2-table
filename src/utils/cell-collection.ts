import { TableCell } from "../table/components/table-cell";
import { TableColumns } from "../types/table-config";

export class CellCollection<C extends TableColumns> {
  private rowCollection: Map<string, Set<TableCell<C>>>;
  private columnCollection: Map<string, Set<TableCell<C>>>;

  constructor() {
    this.columnCollection = new Map();
    this.rowCollection = new Map();
  }

  public addCell(cell: TableCell<C>): void {
    if (!this.rowCollection.has(cell.rowId))
      this.rowCollection.set(cell.rowId, new Set());
    this.rowCollection.get(cell.rowId)?.add(cell);

    if (!this.columnCollection.has(cell.columnId))
      this.columnCollection.set(cell.columnId, new Set());
    this.columnCollection.get(cell.columnId)?.add(cell);
  }

  public removeCell(cell: TableCell<C>): void {
    this.rowCollection.get(cell.rowId)?.delete(cell);
    if (this.rowCollection.get(cell.rowId)?.size === 0)
      this.rowCollection.delete(cell.rowId);

    this.columnCollection.get(cell.columnId)?.delete(cell);
    if (this.columnCollection.get(cell.columnId)?.size === 0)
      this.columnCollection.delete(cell.columnId);
  }

  public *allCells(): IterableIterator<TableCell<C>> {
    for (const cells of this.rowCollection.values()) {
      for (const cell of cells) {
        yield cell;
      }
    }
  }

  public getAllCellsInRow(rowId: string): Array<TableCell<C>> {
    return Array.from(this.rowCollection.get(rowId) ?? []);
  }

  public getAllCellsInColumn(columnId: string): Array<TableCell<C>> {
    return Array.from(this.columnCollection.get(columnId) ?? []);
  }
}
