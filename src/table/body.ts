import { Observable } from "../../node_modules/rxjs/dist/types/index";
import { Camera } from "../canvas/camera";
import { DrawCanvas, DrawCanvasDimensions } from "../canvas/draw-canvas";
import { RowData, SourceData, TableConfig } from "./table-config";
import { TableCell, TableCellConfig } from "./cell";
import { TableCellCollection } from "./cell-collection";
import { BufferedCellCollection } from "./buffered-cell-collection";

const DEFAULT_CELL_BUFFER = 4;

export class TableBody<TRow extends RowData> extends DrawCanvas {
  private readonly camera: Camera;
  private readonly config: TableConfig<TRow>;
  private cells: TableCellCollection<TRow>;
  private bufferedCells: BufferedCellCollection<TRow>;
  private columnOffsets: number[] = [];
  private totalTableWidth = 0;

  constructor(
    config: TableConfig<TRow>,
    dimensions: DrawCanvasDimensions,
    source: Observable<SourceData<TRow>>,
    camera: Camera
  ) {
    super(dimensions);

    this.cells = new TableCellCollection();
    this.bufferedCells = new BufferedCellCollection();

    this.camera = camera;
    this.config = config;
    this.buildColumnOffsets();
    this.initCells(source);

    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      this.camera.updateCamera({
        dx: e.deltaX,
        dy: e.deltaY,
      });
    });
    this.camera.onCameraChange(this.invalidate);

    this.invalidate();
  }

  private findIndexAtOrBefore(offsets: number[], value: number): number {
    let lo = 0;
    let hi = offsets.length - 1;

    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (offsets[mid] <= value) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    return Math.max(0, hi);
  }

  private buildColumnOffsets(): void {
    this.columnOffsets.length = 0;

    let x = 0;
    for (const col of this.config.columns) {
      this.columnOffsets.push(x);
      x += col.maxW;
    }

    this.totalTableWidth = x;
  }

  public getCamera(): Camera {
    return this.camera;
  }

  private getVisibleRange(bufferCells: number = DEFAULT_CELL_BUFFER) {
    const { rows, rowHeight } = this.config;
    const camera = this.camera;

    const viewportHeight = camera.getViewportHeight();
    const viewportWidth = camera.getViewportWidth();

    /* ---------- ROWS (O(1)) ---------- */

    const rawStartRow = Math.floor(camera.Y / rowHeight);
    const rawEndRow = Math.ceil((camera.Y + viewportHeight) / rowHeight);

    const startRow = Math.max(0, rawStartRow - bufferCells);
    const endRow = Math.min(rows.length - 1, rawEndRow + bufferCells);

    /* ---------- COLUMNS (O(log N)) ---------- */

    const rawStartCol = this.findIndexAtOrBefore(this.columnOffsets, camera.X);

    const rawEndCol = this.findIndexAtOrBefore(
      this.columnOffsets,
      camera.X + viewportWidth
    );

    const startCol = Math.max(0, rawStartCol - bufferCells);
    const endCol = Math.min(
      this.config.columns.length - 1,
      rawEndCol + bufferCells
    );

    return { startRow, endRow, startCol, endCol };
  }

  private initCells(source: Observable<SourceData<TRow>>): void {
    const { columns, rows, rowHeight } = this.config;
    let worldY = 0;

    for (const row of rows) {
      let worldX = 0;

      for (const column of columns) {
        const cellConfig: TableCellConfig = {
          textAlignment: "left",
          minW: column.minW,
          maxW: column.maxW,
          pX: 5,
          pY: 0,
          height: rowHeight,
        };

        const invalidateCallback = () => this.invalidate();
        const cell = new TableCell<TRow, TRow[typeof column.id]>(
          row.id,
          column.id,
          this.canvasCtx,
          cellConfig,
          worldX,
          worldY,
          invalidateCallback,
          column.cellDataFactory,
          source,
          this.camera
        );

        this.cells.addCell(cell);

        worldX += cellConfig.maxW;
      }

      worldY += rowHeight;
    }
  }

  private drawRows(): void {
    const { startRow, endRow, startCol, endCol } = this.getVisibleRange();

    const visibleCells = new Set<TableCell<TRow, any>>();

    for (let r = startRow; r <= endRow; r++) {
      const row = this.config.rows[r];
      const rowMap = this.cells.getRow(row.id);
      if (!rowMap) continue;

      for (let c = startCol; c <= endCol; c++) {
        const column = this.config.columns[c];
        const cell = rowMap.get(column.id);
        if (!cell) continue;

        cell.draw();
        visibleCells.add(cell);
      }
    }

    this.bufferedCells.forEach((cell) => {
      if (!visibleCells.has(cell)) {
        this.bufferedCells.remove(cell);
      }
    });

    visibleCells.forEach((cell) => this.bufferedCells.add(cell));
  }

  protected drawImpl(): void {
    this.canvasCtx.translate(-this.camera.X, -this.camera.Y);

    this.drawRows();
  }
}
