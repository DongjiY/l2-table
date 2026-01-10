import { TableCell } from "./cell";
import { RowData } from "./table-config";

export class BufferedCellCollection<TRow extends RowData> {
  private cells: Set<TableCell<TRow, unknown>>;

  constructor() {
    this.cells = new Set();
  }

  public add(cell: TableCell<TRow, unknown>): void {
    cell.setIsBuffered(true);
    this.cells.add(cell);
  }

  public remove(cell: TableCell<TRow, unknown>): void {
    cell.setIsBuffered(false);
    this.cells.delete(cell);
  }

  public forEach(callbackFn: (cell: TableCell<TRow, unknown>) => void): void {
    for (const cell of this.cells) {
      callbackFn(cell);
    }
  }
}
