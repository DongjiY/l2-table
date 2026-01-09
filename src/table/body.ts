import { Observable } from "../../node_modules/rxjs/dist/types/index";
import { Camera } from "../camera";
import { DrawCanvas, DrawCanvasDimensions } from "../draw-canvas";
import { SourceData, TableConfig } from "../table-config";
import { TableCell, TableCellConfig } from "./cell";

export class TableBody extends DrawCanvas {
  private readonly config: TableConfig;
  private cells: Map<string, Map<string, TableCell<string>>> = new Map();

  constructor(
    config: TableConfig,
    camera: Camera,
    dimensions: DrawCanvasDimensions,
    source: Observable<SourceData<string>>
  ) {
    super(camera, dimensions);

    this.config = config;
    this.initCells(source);

    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      this.camera.updateCamera({
        x: e.deltaX,
        y: e.deltaY,
      });
    });
    this.camera.onCameraChange(this.draw);

    this.draw();
  }

  private initCells(source: Observable<SourceData<string>>): void {
    const { rowHeight, columns } = this.config;

    let worldY = 0;

    for (const row of this.config.rows) {
      let worldX = 0;
      const rowMap = new Map<string, TableCell<string>>();

      for (const column of this.config.columns) {
        const cellConfig: TableCellConfig = {
          textAlignment: "left",
          minW: 80,
          maxW: 150,
          pX: 5,
          pY: 0,
          height: this.config.rowHeight,
        };

        // Pass world coordinates in constructor
        const cell = new TableCell<string>(
          row.id,
          column.id,
          this.canvasCtx,
          cellConfig,
          worldX,
          worldY,
          () => this.draw()
        );

        cell.listen(source);
        rowMap.set(column.id, cell);

        worldX += cellConfig.maxW; // Increment for next cell
      }

      this.cells.set(row.id, rowMap);
      worldY += rowHeight; // Increment for next row
    }
  }

  private drawRows(): void {
    // No need to calculate positions - cells already know their world coordinates
    // Just iterate and draw each cell
    for (const row of this.config.rows) {
      const rowMap = this.cells.get(row.id);
      if (!rowMap) continue;

      for (const column of this.config.columns) {
        const cell = rowMap.get(column.id);
        if (!cell) continue;

        // No translate needed - cell draws at its world coordinates
        cell.draw();
      }
    }
  }

  protected drawImpl(): void {
    this.canvasCtx.translate(-this.camera.X, -this.camera.Y);

    this.drawRows();
  }
}
