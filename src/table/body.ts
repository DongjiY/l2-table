import { Observable } from "../../node_modules/rxjs/dist/types/index";
import { Camera } from "../canvas/camera";
import { DrawCanvas, DrawCanvasDimensions } from "../canvas/draw-canvas";
import { RowData, SourceData, TableConfig } from "./table-config";
import { TableCell, TableCellConfig } from "./cell";
import { TableCellCollection } from "./cell-collection";

export class TableBody<TRow extends RowData> extends DrawCanvas {
  private readonly camera: Camera;
  private readonly config: TableConfig<TRow>;
  private cells: TableCellCollection<TRow>;

  constructor(
    config: TableConfig<TRow>,
    dimensions: DrawCanvasDimensions,
    source: Observable<SourceData<TRow>>
  ) {
    super(dimensions);

    this.cells = new TableCellCollection();

    this.camera = new Camera({
      viewportWidth: dimensions.w,
      viewportHeight: dimensions.h,
    });

    this.config = config;
    this.initCells(source);

    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      this.camera.updateCamera({
        dx: e.deltaX,
        dy: e.deltaY,
      });
    });
    this.camera.onCameraChange(this.draw);

    this.draw();
  }

  public getCamera(): Camera {
    return this.camera;
  }

  private getVisibleRange() {
    const { rows, columns, rowHeight } = this.config;
    const { X, Y } = this.camera;
    const viewportHeight = this.camera.getViewportHeight();
    const viewportWidth = this.camera.getViewportWidth();

    let startRow = 0;
    let endRow = rows.length - 1;

    let y = 0;
    for (let i = 0; i < rows.length; i++) {
      if (y + rowHeight >= Y) {
        startRow = i;
        break;
      }
      y += rowHeight;
    }

    y = 0;
    for (let i = 0; i < rows.length; i++) {
      if (y > Y + viewportHeight) {
        endRow = i;
        break;
      }
      y += rowHeight;
    }

    let startCol = 0;
    let endCol = columns.length - 1;

    let x = 0;
    for (let i = 0; i < columns.length; i++) {
      const w = columns[i].maxW;
      if (x + w >= X) {
        startCol = i;
        break;
      }
      x += w;
    }

    x = 0;
    for (let i = 0; i < columns.length; i++) {
      const w = columns[i].maxW;
      if (x > X + viewportWidth) {
        endCol = i;
        break;
      }
      x += w;
    }

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

        const cell = new TableCell<TRow, TRow[typeof column.id]>(
          row.id,
          column.id,
          this.canvasCtx,
          cellConfig,
          worldX,
          worldY,
          () => this.draw(),
          column.cellDataFactory
        );

        cell.listen(source, this.camera);

        this.cells.addCell(cell);

        worldX += cellConfig.maxW;
      }

      worldY += rowHeight;
    }
  }

  private drawRows(): void {
    const { startRow, endRow, startCol, endCol } = this.getVisibleRange();

    for (let r = startRow; r <= endRow; r++) {
      const row = this.config.rows[r];
      const rowMap = this.cells.getRow(row.id);
      if (!rowMap) continue;

      for (let c = startCol; c <= endCol; c++) {
        const column = this.config.columns[c];
        const cell = rowMap.get(column.id);
        if (!cell) continue;

        cell.draw();
      }
    }
  }

  protected drawImpl(): void {
    this.canvasCtx.translate(-this.camera.X, -this.camera.Y);

    this.drawRows();
  }
}
