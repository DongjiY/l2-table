import {
  TableConfig,
  TableRow,
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
import { ColumnSizeMap } from "../../utils/column-size-map";
import {
  boundaryBinarySearchLeftOrTop,
  boundaryBinarySearchRightOrBottom,
  calculateTopAndBottomRowBounds,
} from "../../utils/boundary-search";
import { Axis } from "../../utils/axis";
import { TableWorker } from "../table-worker";

export class TableBody<TDataRow extends TableRow> extends DrawCanvas {
  private cells: CellCollection<TDataRow>;
  private previousVisibleCells: Set<TableCell<TDataRow>> = new Set();
  private columnSizeManager: TableWorker;

  constructor(
    private readonly camera: Camera,
    private readonly config: TableConfig<TDataRow>,
    private readonly source: Observable<TableSourceData>,
    private readonly columnSizes: ColumnSizeMap,
    dimensions: Dimensions,
  ) {
    super(dimensions);

    this.columnSizeManager = new TableWorker();
    this.cells = new CellCollection();
    this.columnSizes = new ColumnSizeMap();

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

  private getVirtualBounds(
    bufferX: number = 1,
    bufferY: number = 1,
  ): {
    leftColumnIndex: number;
    rightColumnIndex: number;
    topRowIndex: number;
    bottomRowIndex: number;
  } {
    const columnBoundingBoxes = this.columnSizes.getBoundingBoxes();
    const viewportBoundingBox = this.camera.boundingBox;

    const leftBound = boundaryBinarySearchLeftOrTop(
      columnBoundingBoxes,
      viewportBoundingBox,
      Axis.X,
    );

    const rightBound = boundaryBinarySearchRightOrBottom(
      columnBoundingBoxes,
      viewportBoundingBox,
      Axis.X,
    );

    const { topIndex: topBound, bottomIndex: bottomBound } =
      calculateTopAndBottomRowBounds(
        this.config.style.body.row.height,
        this.config.rows.length,
        this.camera.y,
        this.camera.viewportHeight,
      );

    const leftColumnIndex = Math.max(
      0,
      (leftBound?.meta.columnIndex ?? 0) - bufferX,
    );

    const rightColumnIndex = Math.min(
      columnBoundingBoxes.length - 1,
      (rightBound?.meta.columnIndex ?? 0) + bufferX,
    );

    const topRowIndex = Math.max(0, topBound - bufferY);

    const bottomRowIndex = Math.min(
      this.config.rows.length - 1,
      bottomBound + bufferY,
    );

    return {
      leftColumnIndex,
      rightColumnIndex,
      topRowIndex,
      bottomRowIndex,
    };
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
      const rowId = row.rowId;
      x = 0;
      for (const column of this.config.columns) {
        const columnId = column.columnId;
        const cell = new TableCell(
          rowId,
          columnId,
          new Point(x, y),
          this.config.style.body.cell.text,
          column,
          () => {
            const cellData = column.cellData();
            const initialValue = column.placeholderAccessorFn(row);
            cellData.setValue(initialValue);
            return cellData;
          },
          this.config.style.body.row.height,
          this.getFilteredObservable(row.rowId, columnId),
          requestRedraw,
          this.columnSizes.getColumnWidthObservable(columnId),
        );
        this.cells.addCell(cell);
        this.columnSizes.updateColumnSize(columnId, cell.w);
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
    const currentVisibleCells: Set<TableCell<TDataRow>> = new Set();
    for (const cell of this.cells.visibleCells(this.getVirtualBounds())) {
      currentVisibleCells.add(cell);
      this.previousVisibleCells.delete(cell);
      cell.setIsVisible(true);
      cell.draw(ctx);
    }
    for (const cell of this.previousVisibleCells) {
      cell.setIsVisible(false);
    }
    this.previousVisibleCells = currentVisibleCells;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.translate(-this.camera.x, -this.camera.y);

    this.drawCells(ctx);
  }
}
