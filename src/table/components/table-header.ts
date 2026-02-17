import { TableConfig, TableRow } from "../../types/table-config";
import { Camera } from "../../utils/camera";
import { Dimensions } from "../../utils/dimensions";
import { DrawCanvas } from "../../utils/draw-canvas";
import { TableCell } from "./table-cell";
import { StringTableData } from "../../utils/string-table-data";
import { ColumnSizeMap } from "../../utils/column-size-map";
import { CellPool } from "../../utils/cell-pool";
import { SortedRowModel } from "../../utils/sorted-row-model";
import { TableWorker } from "../table-worker";
import { Mouse } from "../../utils/mouse";
import { Point } from "../../utils/point";
import { CellIndex } from "../../utils/cell-index";

const HEADER_ROW_ID = "HEADER_ROW";

export class TableHeader<TDataRow extends TableRow> extends DrawCanvas {
  private cellPool: CellPool;
  private cellIndex: CellIndex;

  constructor(
    private readonly camera: Camera,
    private readonly columnSizes: ColumnSizeMap<TDataRow>,
    private readonly config: TableConfig<TDataRow>,
    private readonly tableWorker: TableWorker,
    private readonly mouse: Mouse,
    private readonly sortedRowModel: SortedRowModel<TDataRow>,
    dimensions: Dimensions,
  ) {
    super(dimensions);

    this.cellIndex = new CellIndex();
    this.cellPool = new CellPool();
    this.cellPool.initFromCount({
      count: this.config.columns.length,
      cellFactory: () => {
        return new TableCell(this.config.style.header.cell);
      },
    });

    this.config.columns.forEach(({ columnId, name }) => {
      this.tableWorker.send({
        type: "CELL_SIZE",
        payload: {
          columnId: columnId,
          content: name,
        },
      });
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

    this.mouse.onMouseDown(this.handleMouseDown);
    this.requestRedraw();
  }

  handleMouseDown = (p: Point) => {
    for (const { cell, columnId } of this.cellIndex.getCellsForRowById(
      HEADER_ROW_ID,
    )) {
      if (cell.getBoundingBox().intersects(p) && columnId) {
        this.sortedRowModel.toggleSort(columnId);
        break;
      }
    }
  };

  private drawCells(ctx: CanvasRenderingContext2D): void {
    this.cellPool.beginFrame();

    for (const column of this.config.columns) {
      const cell = this.cellPool.next();
      cell.bind({
        x: this.columnSizes.getColumnXPos(column.columnId) ?? 0,
        y: 0,
        data: new StringTableData(
          `${column.name}${this.getSortSymbol(column.columnId)}`,
        ),
        width: this.columnSizes.getColumnWidth(column.columnId) ?? 0,
        height: this.config.style.header.row.height,
      });
      cell.draw(ctx);
      this.cellIndex.register(column.columnId, HEADER_ROW_ID, cell);
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.translate(-this.camera.x, 0);

    this.drawCells(ctx);
  }

  private getSortSymbol(columnId: string): string {
    if (
      this.sortedRowModel.columnIdUnderSort === undefined ||
      this.sortedRowModel.columnIdUnderSort !== columnId
    )
      return "";
    if (this.sortedRowModel.sortDirection === "ASC") return " ↑";
    return " ↓";
  }
}
