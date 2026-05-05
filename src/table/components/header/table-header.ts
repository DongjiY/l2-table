import { TableConfig, TableRow } from "../../../types/table-config";
import { Camera } from "../../../utils/camera";
import { Dimensions } from "../../../utils/dimensions";
import { DrawCanvas } from "../../../utils/draw-canvas";
import { StringTableData } from "../../../utils/string-table-data";
import { ColumnSizeMap } from "../../../utils/column-size-map";
import { CellPool } from "../../../utils/cell-pool";
import { SortedRowModel } from "../../../utils/sorted-row-model";
import { TableWorker } from "../../table-worker";
import { Mouse } from "../../../utils/mouse";
import { Point } from "../../../utils/point";
import { TableHeaderCell } from "./table-header-cell";
import { BufferedStream } from "../../../utils/buffered-stream";

export class TableHeader<TDataRow extends TableRow> extends DrawCanvas {
  private cellPool: CellPool<TableHeaderCell>;
  private headerNameMap: Map<string, string>;
  private clickStartPosition: Point = new Point();
  private hoveredViewportPosition: Point | undefined = new Point();

  private resizingColumnId: string | undefined;
  private hoveredResizerColumnId: string | undefined;
  private headerResizeStartWidth: number | undefined;
  private headerResizeStartWorldPoint: Point = new Point();

  constructor(
    private readonly camera: Camera,
    private readonly columnSizes: ColumnSizeMap<TDataRow>,
    private readonly config: TableConfig<TDataRow>,
    private readonly tableWorker: TableWorker,
    private readonly mouse: Mouse,
    private readonly sortedRowModel: SortedRowModel<TDataRow>,
    private readonly autoSizedBufferedStream: BufferedStream<{
      columnId: string;
      size: number;
    }>,
    dimensions: Dimensions,
  ) {
    super(dimensions);

    this.headerNameMap = new Map(
      this.config.columns.map(({ columnId, name }) => {
        return [columnId, name];
      }),
    );

    this.cellPool = CellPool.fromCount({
      count: this.config.columns.length,
      cellFactory: () => {
        return new TableHeaderCell(this.config.style.header.cell);
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

    this.mouse.onMouseClick(this.handleMouseClick);
    this.mouse.onMouseDown(this.handleMouseDown);
    this.mouse.onMouseMove(this.handleMouseMove);
    this.mouse.onMouseUp(this.handleMouseUp);
    this.requestRedraw();
  }

  handleMouseMove = (p: Point) => {
    this.trackResizedColumnDistance(p);
    this.updateHoveredWorldXPosition(p);
    this.requestRedraw();
  };

  handleMouseUp = () => {
    this.manualResizeEnd();
    this.requestRedraw();
  };

  handleMouseDown = (p: Point) => {
    this.manualResizeStart(p);
    this.clickStartPosition.copy(p);
    this.requestRedraw();
  };

  handleMouseClick = (p: Point) => {
    if (!this.clickStartPosition.equals(p)) return;

    const worldX = p.x + this.camera.x;
    const worldY = p.y;

    const headerHeight = this.config.style.header.row.height;

    if (worldY < 0 || worldY > headerHeight) return;

    const columnId = this.getColumnIdAtX(worldX);
    if (!columnId) return;

    this.sortedRowModel.toggleSort(columnId);

    this.tableWorker.send({
      type: "CELL_SIZE",
      payload: {
        columnId,
        content: `${this.headerNameMap.get(columnId)}`,
      },
    });

    this.requestRedraw();
  };

  private manualResizeEnd(): void {
    this.resizingColumnId = undefined;
    this.autoSizedBufferedStream.resume();
  }

  private manualResizeStart(p: Point): void {
    if (!this.hoveredResizerColumnId) return;
    this.autoSizedBufferedStream.pause();
    const worldPoint = this.camera.toWorldPoint(p);
    this.resizingColumnId = this.hoveredResizerColumnId;
    this.headerResizeStartWorldPoint = worldPoint;
    this.headerResizeStartWidth = this.columnSizes.getColumnWidth(
      this.resizingColumnId,
    );
    this.columnSizes.addColumnToManualControl(this.resizingColumnId);
  }

  private trackResizedColumnDistance(p: Point): void {
    if (!this.resizingColumnId || !this.headerResizeStartWidth) return;
    const newWidth =
      this.headerResizeStartWidth +
      (this.camera.toWorldPoint(p).x - this.headerResizeStartWorldPoint.x);

    this.columnSizes.updateColumnSize(this.resizingColumnId, newWidth);
  }

  private updateHoveredWorldXPosition(p: Point): void {
    if (p.y > this.h) {
      this.hoveredViewportPosition = undefined;
      return;
    }
    const worldPoint = this.camera.toWorldPoint(p);
    worldPoint.y = p.y;
    this.hoveredViewportPosition = worldPoint;
  }

  private getColumnIdAtX(worldX: number): string | undefined {
    for (const column of this.config.columns) {
      const x = this.columnSizes.getColumnXPos(column.columnId) ?? 0;
      const width = this.columnSizes.getColumnWidth(column.columnId) ?? 0;

      if (worldX >= x && worldX <= x + width) {
        return column.columnId;
      }
    }

    return undefined;
  }

  private drawCells(ctx: CanvasRenderingContext2D): void {
    this.cellPool.beginFrame();

    let isMouseHoveringAnyResizer = false;
    for (const column of this.config.columns) {
      const cell = this.cellPool.next();

      cell.bind({
        x: this.columnSizes.getColumnXPos(column.columnId) ?? 0,
        y: 0,
        data: new StringTableData(`${column.name}`),
        width: this.columnSizes.getColumnWidth(column.columnId) ?? 0,
        height: this.config.style.header.row.height,
        sortDirection: this.getSortDirection(column.columnId),
      });

      const isMouseHoveringThisResizer = cell.checkAndSetResizerHovered(
        this.hoveredViewportPosition,
      );

      isMouseHoveringAnyResizer =
        isMouseHoveringAnyResizer || isMouseHoveringThisResizer;

      if (isMouseHoveringThisResizer) {
        this.hoveredResizerColumnId = column.columnId;
      }

      cell.draw(ctx);
    }

    if (isMouseHoveringAnyResizer) {
      document.body.style.cursor = "col-resize";
    } else {
      document.body.style.cursor = "default";
      this.hoveredResizerColumnId = undefined;
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.translate(-this.snapToDevicePixel(this.camera.x), 0);

    this.drawCells(ctx);
  }

  private getSortDirection(columnId: string): "ASC" | "DESC" | undefined {
    if (
      this.sortedRowModel.columnIdUnderSort === undefined ||
      this.sortedRowModel.columnIdUnderSort !== columnId
    )
      return undefined;
    return this.sortedRowModel.sortDirection;
  }
}
