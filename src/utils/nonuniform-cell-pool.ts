import { TableCell } from "../table/components/table-cell";
import { CellPool } from "./cell-pool";

export class NonUniformCellPool {
  private cellPools: Map<string, CellPool<TableCell>> = new Map();

  public beginFrame(): void {
    this.cellPools.forEach((cellPool) => cellPool.beginFrame());
  }

  public next(columnId: string): TableCell {
    const cellPool = this.cellPools.get(columnId);
    if (!cellPool) {
      throw new Error(`Cell pool for column ${columnId} not initialized`);
    }
    return cellPool.next();
  }

  public addColumnCells(
    columnId: string,
    cellCount: number,
    cellFactory: () => TableCell,
  ): void {
    let cellPool = this.cellPools.get(columnId);
    if (!cellPool) {
      cellPool = new CellPool();
      this.cellPools.set(columnId, cellPool);
    }

    for (let i = 0; i < cellCount; i++) {
      cellPool.addCell(cellFactory());
    }
  }

  public static fromViewport({
    viewportHeight,
    rowHeight,
    bufferY,
    cellFactories,
  }: {
    viewportHeight: number;
    bufferY: number;
    rowHeight: number;
    minColumnWidth: number;
    cellFactories: Record<string, () => TableCell>;
  }): NonUniformCellPool {
    const nonuniformCellPool = new NonUniformCellPool();

    const maxVisibleRows = Math.ceil(viewportHeight / rowHeight) + bufferY;

    for (const [columnId, cellFactory] of Object.entries(cellFactories)) {
      nonuniformCellPool.addColumnCells(columnId, maxVisibleRows, cellFactory);
    }

    return nonuniformCellPool;
  }
}
