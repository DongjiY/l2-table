import { EMPTY } from "rxjs";
import { TableColumns, TableConfig } from "../../types/table-config";
import { Camera } from "../../utils/camera";
import { CellCollection } from "../../utils/cell-collection";
import { Dimensions } from "../../utils/dimensions";
import { DrawCanvas } from "../../utils/draw-canvas";
import { Point } from "../../utils/point";
import { StringTableData } from "../../utils/string-table-data";
import { TableCell } from "./table-cell";

export class TableHeader<C extends TableColumns> extends DrawCanvas {
  private cells: CellCollection<C>;

  constructor(
    private readonly camera: Camera,
    dimensions: Dimensions,
    private readonly config: TableConfig<C>,
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
    for (const columnId of Object.keys(this.config.columns)) {
      const cell = new TableCell(
        "HEADER_ROW",
        columnId,
        new Point(x, y),
        () => new StringTableData(this.config.columns[columnId].name),
        this.config.style.header.cell.text,
        this.config.columns[columnId],
        this.config.style.header.row.height,
        EMPTY,
        requestRedraw,
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
