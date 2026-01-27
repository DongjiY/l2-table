import { TableCell } from "../table/components/table-cell";

export class CellPool {
  private cells: Array<TableCell> = [];
  private index: number = 0;

  public addCell(cell: TableCell): void {
    this.cells.push(cell);
  }

  public beginFrame(): void {
    this.index = 0;
  }

  public next(): TableCell {
    if (this.index >= this.cells.length) {
      throw new Error("CellPool exhausted — increase pool size");
    }
    return this.cells[this.index++];
  }

  public initFromCount({
    count,
    cellFactory,
  }: {
    count: number;
    cellFactory: () => TableCell;
  }): void {
    for (let i = 0; i < count; i++) {
      this.addCell(cellFactory());
    }
  }

  public initFromViewport({
    viewportWidth,
    viewportHeight,
    rowHeight,
    minColumnWidth,
    bufferX,
    bufferY,
    cellFactory,
  }: {
    viewportWidth: number;
    viewportHeight: number;
    bufferX: number;
    bufferY: number;
    rowHeight: number;
    minColumnWidth: number;
    cellFactory: () => TableCell;
  }): void {
    const maxVisibleRows = Math.ceil(viewportHeight / rowHeight) + bufferX;

    const maxVisibleCols = Math.ceil(viewportWidth / minColumnWidth) + bufferY;

    const poolSize = maxVisibleRows * maxVisibleCols;

    for (let i = 0; i < poolSize; i++) {
      this.addCell(cellFactory());
    }
  }
}
