import { EMPTY, NEVER } from "rxjs";
import { TableConfig, TableRow } from "../../types/table-config";
import { Camera } from "../../utils/camera";
import { CellCollection } from "../../utils/cell-collection";
import { Dimensions } from "../../utils/dimensions";
import { DrawCanvas } from "../../utils/draw-canvas";
import { Point } from "../../utils/point";
import { TableCell } from "./table-cell";
import { StringTableData } from "../../utils/string-table-data";
import { ColumnSizeMap } from "../../utils/column-size-map";

export class TableHeader<TDataRow extends TableRow> extends DrawCanvas {
  private cells: CellCollection<TDataRow>;

  constructor(
    private readonly camera: Camera,
    private readonly columnSizes: ColumnSizeMap,
    dimensions: Dimensions,
    private readonly config: TableConfig<TDataRow>,
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

  private initCells(): void {
    const requestRedraw = this.requestRedraw.bind(this);
    let x = 0;
    const y = 0;
    for (const column of this.config.columns) {
      const cell = new TableCell(
        "HEADER_ROW",
        column.columnId,
        new Point(x, y),
        this.config.style.header.cell.text,
        column,
        () => new StringTableData(column.name),
        this.config.style.header.row.height,
        EMPTY,
        requestRedraw,
        this.columnSizes.getColumnWidthObservable(column.columnId),
      );
      this.cells.addCell(cell);
      x += cell.w;
    }
  }

  private drawCells(ctx: CanvasRenderingContext2D): void {
    for (const cell of this.cells.allCells()) {
      cell.draw(ctx);
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.translate(-this.camera.x, 0);

    this.drawCells(ctx);
  }
}
