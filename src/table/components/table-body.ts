import {
  TableColumns,
  TableConfig,
  TableSourceData,
} from "../../types/table-config";
import { CellCollection } from "../../utils/cell-collection";
import { Dimensions } from "../../utils/dimensions";
import { Point } from "../../utils/point";
import { Camera } from "../../utils/camera";
import { DrawCanvas } from "../../utils/draw-canvas";
import { TableCell } from "./table-cell";
import { filter, map, Observable } from "rxjs";
import { HORIZONTAL_SCROLLBAR_HEIGHT } from "./horizontal-scrollbar";
import { VERTICAL_SCROLLBAR_WIDTH } from "./vertical-scrollbar";

export class TableBody<C extends TableColumns> extends DrawCanvas {
  private cells: CellCollection<C>;

  constructor(
    private readonly camera: Camera,
    private readonly config: TableConfig<C>,
    private readonly source: Observable<TableSourceData<C>>,
    dimensions: Dimensions,
  ) {
    super(dimensions);

    this.cells = new CellCollection();

    this.initCells();

    this.getElement().addEventListener(
      "wheel",
      (e: WheelEvent) => {
        e.preventDefault();
        this.camera.updateFocus({
          dx: e.deltaX,
          dy: e.deltaY,
        });
      },
      { passive: false },
    );

    this.camera.onCameraFocusChange(() => this.requestRedraw());
    this.camera.onCameraResize(() => this.requestRedraw());

    this.requestRedraw();
  }

  private getFilteredObservable(
    rowId: string,
    columnId: string,
  ): Observable<any> {
    return this.source.pipe(
      filter((v) => v.columnId === columnId && v.rowId === rowId),
      map((v) => v.data),
    );
  }

  private initCells(): void {
    const requestRedraw = this.requestRedraw.bind(this);
    let x = 0;
    let y = 0;
    for (const row of this.config.rows) {
      x = 0;
      for (const [columnId, cellData] of Object.entries(row.cells)) {
        const cell = new TableCell(
          row.rowId,
          columnId,
          new Point(x, y),
          cellData.cellData,
          this.config.style.body.cell.text,
          this.config.columns[columnId],
          this.config.style.body.row.height,
          this.getFilteredObservable(row.rowId, columnId),
          requestRedraw,
        );
        this.cells.addCell(cell);
        x += cell.w;
      }
      y += this.config.style.body.row.height;
    }
    this.camera.updateWorldDimensions({
      w: x + VERTICAL_SCROLLBAR_WIDTH,
      h: y + this.config.style.header.row.height + HORIZONTAL_SCROLLBAR_HEIGHT,
    });
  }

  private drawCells(ctx: CanvasRenderingContext2D): void {
    for (const cell of this.cells.allCells()) {
      // TODO - should only iterate over visible cells
      cell.draw(ctx);
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.translate(-this.camera.x, -this.camera.y);

    this.drawCells(ctx);
  }
}
