import { EMPTY, NEVER } from "rxjs";
import { TableConfig, TableRow } from "../../types/table-config";
import { Camera } from "../../utils/camera";
import { Dimensions } from "../../utils/dimensions";
import { DrawCanvas } from "../../utils/draw-canvas";
import { Point } from "../../utils/point";
import { TableCell } from "./table-cell";
import { StringTableData } from "../../utils/string-table-data";
import { ColumnSizeMap } from "../../utils/column-size-map";
import { CellPool } from "../../utils/cell-pool";

export class TableHeader<TDataRow extends TableRow> extends DrawCanvas {
  private cellPool: CellPool;

  constructor(
    private readonly camera: Camera,
    private readonly columnSizes: ColumnSizeMap<TDataRow>,
    dimensions: Dimensions,
    private readonly config: TableConfig<TDataRow>,
  ) {
    super(dimensions);

    this.cellPool = new CellPool();
    this.cellPool.initFromCount({
      count: this.config.columns.length,
      cellFactory: () => {
        return new TableCell(this.config.style.header.cell);
      },
    });

    this.getElement().addEventListener(
      "wheel",
      (e: WheelEvent) => {
        e.preventDefault();
        this.camera.updateFocus({
          dx: e.deltaX,
        });
      },
      {
        passive: false,
      },
    );
    this.camera.onCameraFocusChange(() => this.requestRedraw());
    this.camera.onCameraResize(() => this.requestRedraw());

    this.requestRedraw();
  }

  // private initCells(): void {
  //   const requestRedraw = this.requestRedraw.bind(this);
  //   let x = 0;
  //   const y = 0;
  //   for (const column of this.config.columns) {
  //     const cell = new TableCell(
  //       "HEADER_ROW",
  //       column.columnId,
  //       requestRedraw,
  //       this.config.style.header.cell,
  //       column,
  //       EMPTY,
  //     );
  //     cell.bind({
  //       rowId: "HEADER_ROW",
  //       columnId: column.columnId,
  //       cellDataFactory: () => new StringTableData(column.name),
  //       x,
  //       y,
  //       height: this.config.style.header.row.height,
  //     });
  //     this.cells.addCell(cell);
  //     x += cell.w;
  //   }
  // }

  private drawCells(ctx: CanvasRenderingContext2D): void {
    this.cellPool.beginFrame();

    for (const column of this.config.columns) {
      const cell = this.cellPool.next();
      cell.bind({
        x: this.columnSizes.getColumnXPos(column.columnId) ?? 0,
        y: 0,
        data: new StringTableData(column.name),
        width: this.columnSizes.getColumnWidth(column.columnId) ?? 0,
        height: this.config.style.header.row.height,
      });
      cell.draw(ctx);
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.translate(-this.camera.x, 0);

    this.drawCells(ctx);
  }
}
