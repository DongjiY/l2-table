import { Camera } from "../canvas/camera";
import { DrawCanvas, DrawCanvasDimensions } from "../canvas/draw-canvas";
import { TableConfig } from "./table-config";
import { TableCell, TableCellConfig } from "./cell";

export class TableHeader extends DrawCanvas {
  private readonly camera: Camera;
  private readonly config: TableConfig;
  private headerCells: Set<TableCell<string>> = new Set();

  constructor(config: TableConfig, dimensions: DrawCanvasDimensions) {
    super(dimensions);

    this.config = config;

    this.camera = new Camera({
      viewportWidth: dimensions.w,
      viewportHeight: dimensions.h,
    });

    this.camera.onCameraChange(this.draw);

    this.initHeaderCells();

    this.draw();
  }

  private initHeaderCells(): void {
    const { headerHeight } = this.config;
    let worldX = 0;
    let index = 0;
    for (const column of this.config.columns) {
      const tableCellConfig: TableCellConfig = {
        textAlignment: "left",
        minW: column.minW,
        maxW: column.maxW,
        pX: 5,
        pY: 0,
        height: headerHeight,
        placeholder: column.header,
      };
      const header = new TableCell<string>(
        `header-${index}`,
        `header-${column.id}`,
        this.canvasCtx,
        tableCellConfig,
        worldX,
        0,
        () => this.draw()
      );
      worldX += tableCellConfig.maxW;
      this.headerCells.add(header);
    }
  }

  public getCamera(): Camera {
    return this.camera;
  }

  private drawHeaders(): void {
    for (const header of this.headerCells) {
      header.draw();
    }
  }

  protected drawImpl(): void {
    this.canvasCtx.translate(-this.camera.X, 0);

    this.drawHeaders();
  }
}
