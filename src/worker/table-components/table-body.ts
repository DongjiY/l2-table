import { TableConfig } from "../../types/table-config";
import { Dimensions } from "../../utils/dimensions";
import { Camera } from "../camera";
import { WorkerCanvas } from "../worker-canvas";
import { CellCollection } from "./utils/cell-collection";
import { TableCell } from "./table-cell";
import { Point } from "../../utils/point";

export class TableBody extends WorkerCanvas {
  private dimensions: Dimensions;
  private cells: CellCollection;

  constructor(
    private readonly camera: Camera,
    private readonly config: TableConfig<any>,
    offscreenCanvas: OffscreenCanvas,
  ) {
    super(offscreenCanvas);

    this.cells = new CellCollection();

    this.dimensions = new Dimensions(
      offscreenCanvas.width,
      offscreenCanvas.height,
    );

    this.initCells();

    this.resize(this.dimensions);
    this.requestRedraw();
  }

  private initCells(): void {
    let x = 0;
    let y = 0;
    for (const row of this.config.rows) {
      for (const [columnId, cellData] of Object.entries(row.cells)) {
        const cell = new TableCell(
          row.rowId,
          columnId,
          new Point(x, y),
          cellData.cellData,
        );
        this.cells.addCell(cell);
        x += 100;
      }
      y += 50;
    }
  }

  private drawCells(ctx: OffscreenCanvasRenderingContext2D): void {
    for (const cell of this.cells.allCells()) {
      cell.draw(ctx);
    }
  }

  public onResize(w: number, h: number, dpr: number): void {
    this.dimensions.w = w;
    this.dimensions.h = h;
    this.camera.updateViewportDimensions({
      w,
      h,
    });
    this.resize(this.dimensions, dpr);
  }

  public draw(ctx: OffscreenCanvasRenderingContext2D): void {
    ctx.translate(-this.camera.x, -this.camera.y);

    this.drawCells(ctx);
  }
}
