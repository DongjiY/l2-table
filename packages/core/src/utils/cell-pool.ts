import { TableCell } from "../table/components/table-cell";

export class CellPool<TCell extends TableCell> {
  private cells: Array<TCell> = [];
  private index: number = 0;

  public addCell(cell: TCell): void {
    this.cells.push(cell);
  }

  public beginFrame(): void {
    this.index = 0;
  }

  public next(): TCell {
    if (this.index >= this.cells.length) {
      throw new Error("CellPool exhausted — increase pool size");
    }
    return this.cells[this.index++];
  }

  public static fromCount<TCell extends TableCell>({
    count,
    cellFactory,
  }: {
    count: number;
    cellFactory: () => TCell;
  }): CellPool<TCell> {
    const cellPool = new CellPool<TCell>();
    for (let i = 0; i < count; i++) {
      cellPool.addCell(cellFactory());
    }
    return cellPool;
  }

  public static getOptimalPoolSize({
    viewportWidth,
    viewportHeight,
    rowHeight,
    minColumnWidth,
    bufferX,
    bufferY,
  }: {
    viewportWidth: number;
    viewportHeight: number;
    bufferX: number;
    bufferY: number;
    rowHeight: number;
    minColumnWidth: number;
  }): number {
    const maxVisibleRows = Math.ceil(viewportHeight / rowHeight) + bufferY;
    const maxVisibleCols = Math.ceil(viewportWidth / minColumnWidth) + bufferX;
    const poolSize = maxVisibleRows * maxVisibleCols;
    return poolSize;
  }

  public *allCells(): IterableIterator<TableCell> {
    for (const cell of this.cells) {
      yield cell;
    }
  }
}
