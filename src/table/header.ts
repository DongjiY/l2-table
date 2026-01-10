import { Camera } from "../canvas/camera";
import { DrawCanvas, DrawCanvasDimensions } from "../canvas/draw-canvas";
import { RowData, TableConfig } from "./table-config";
import { TableCell, TableCellConfig } from "./cell";
import { StringTableData } from "./table-data";
import { EMPTY } from "rxjs";

export class TableHeader<TRow extends RowData> extends DrawCanvas {
  private readonly camera: Camera;
  private readonly config: TableConfig<TRow>;
  private headerCells: Set<TableCell<TRow, any>> = new Set();

  constructor(config: TableConfig<TRow>, dimensions: DrawCanvasDimensions) {
    super(dimensions);

    this.config = config;

    this.camera = new Camera({
      viewportWidth: dimensions.w,
      viewportHeight: dimensions.h,
    });

    this.camera.onCameraChange(this.invalidate);

    this.initHeaderCells();

    this.invalidate();
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
      const header = new TableCell<TRow, string>(
        `header-${index}`,
        column.id,
        this.canvasCtx,
        tableCellConfig,
        worldX,
        0,
        () => this.invalidate(),
        () => new StringTableData(column.header),
        EMPTY,
        this.camera
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
