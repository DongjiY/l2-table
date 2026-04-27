import {
  TableColumnDef,
  TableConfig,
  TableRow,
  TableSourceData,
} from "../../types/table-config";
import { Dimensions } from "../../utils/dimensions";
import { Camera } from "../../utils/camera";
import { DrawCanvas } from "../../utils/draw-canvas";
import { TableCell } from "./table-cell";
import { merge, Observable, Subscription } from "rxjs";
import { ColumnSizeMap } from "../../utils/column-size-map";
import {
  boundaryBinarySearchLeftOrTop,
  boundaryBinarySearchRightOrBottom,
  calculateTopAndBottomRowBounds,
} from "../../utils/boundary-search";
import { Axis } from "../../utils/axis";
import { CellPool } from "../../utils/cell-pool";
import { Closeable } from "../../utils/closeable";
import { CellDataStore } from "../../utils/cell-data-store";
import { TableData } from "../../utils/table-data";
import { TableWorker } from "../table-worker";
import { Point } from "../../utils/point";
import { Mouse } from "../../utils/mouse";
import { TableBodyOverlay } from "../table-body-overlay";
import { SortedRowModel } from "../../utils/sorted-row-model";
import { ColumnLookup } from "../../utils/column-lookup";

type VirtualBounds = {
  leftColumnIndex: number;
  rightColumnIndex: number;
  topRowIndex: number;
  bottomRowIndex: number;
};
export class TableBody<TDataRow extends TableRow>
  extends DrawCanvas
  implements Closeable
{
  private canvasWrapperDiv: HTMLDivElement;
  private cellPool: CellPool<TableCell>;
  private sourceSubscription: Subscription;
  private columnResizeSubscription: Subscription;
  private hoveredRowId: string | undefined;
  private _prevMousePoint: Point = new Point();
  private overlay: TableBodyOverlay;
  private _cachedVirtualBounds: VirtualBounds | undefined;

  constructor(
    private readonly camera: Camera,
    private readonly config: TableConfig<TDataRow>,
    private readonly source: Observable<TableSourceData>,
    private readonly columnSizes: ColumnSizeMap<TDataRow>,
    private readonly tableWorker: TableWorker,
    private readonly mouse: Mouse,
    private readonly sortedRowModel: SortedRowModel<TDataRow>,
    private readonly cellDataStore: CellDataStore<TDataRow>,
    private readonly columnLookup: ColumnLookup<TDataRow>,
    dimensions: Dimensions,
  ) {
    super(dimensions);

    this.canvasWrapperDiv = document.createElement("div");
    this.canvasWrapperDiv.appendChild(super.getElement());
    this.canvasWrapperDiv.style.overflow = "hidden";
    this.canvasWrapperDiv.style.position = "relative";
    this.overlay = new TableBodyOverlay(
      this.canvasWrapperDiv,
      this.config.style.body.row.height,
    );

    this.cellPool = new CellPool();
    this.cellPool.initFromViewport({
      viewportHeight: this.camera.viewportHeight,
      viewportWidth: this.camera.viewportWidth,
      bufferX: 4,
      bufferY: 4,
      rowHeight: this.config.style.body.row.height,
      minColumnWidth: this.columnSizes.getMinColumnWidth(),
      cellFactory: () => {
        return new TableCell(this.config.style.body.cell);
      },
    });

    this.sourceSubscription = this.source.subscribe(this.handleRecvSourceData);
    this.columnResizeSubscription = this.getColumnResizeObservables(
      this.config.columns,
    ).subscribe(() => {
      this.requestRedraw();
    });

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

    this.camera.onCameraFocusChange(() => {
      this.mouseMove(this._prevMousePoint);
      this.requestRedraw();
    });
    this.camera.onCameraResize(() => this.requestRedraw());

    this.mouse.onMouseMove(
      this.mouseMove,
      new Point(0, -1 * this.config.style.header.row.height),
    );
    this.mouse.onMouseLost(() => this.overlay.hide());

    this.requestRedraw();
  }

  public getElement(): HTMLElement {
    return this.canvasWrapperDiv;
  }

  handleRecvSourceData = (v: TableSourceData) => {
    const cellData = this.cellDataStore.getCellData(v.rowId, v.columnId);
    cellData.setValue(v.data);
    const { topRowIndex, bottomRowIndex } = this.getCachedVirtualBounds();
    const rowIndex = this.sortedRowModel.getIndex(v.rowId);
    const isVisibleRow =
      rowIndex !== undefined &&
      topRowIndex <= rowIndex &&
      rowIndex <= bottomRowIndex;
    if (isVisibleRow) {
      this.tableWorker.send({
        type: "CELL_SIZE",
        payload: {
          columnId: v.columnId,
          content: cellData.getDisplayableContent(),
        },
      });
    }
    this.sortedRowModel.resort({
      value: v.data,
      columnId: v.columnId,
      rowId: v.rowId,
      compare: cellData.compare,
    });
    this.requestRedraw();
  };

  mouseMove = (point: Point): void => {
    this._prevMousePoint.copy(point);
    if (point.y < 0) {
      this.overlay.hide();
      return;
    }
    const worldY = point.y + this.camera.y;
    const rowHeight = this.config.style.body.row.height;
    const rowIndex = Math.floor(worldY / rowHeight);
    let nextHoveredRowId: string | undefined;
    if (rowIndex >= 0 && rowIndex < this.sortedRowModel.length) {
      nextHoveredRowId = this.sortedRowModel.getRow(rowIndex).rowId;
      const rowTopY = rowIndex * rowHeight - this.camera.y;
      this.overlay.drawAtPoint(rowTopY);
    }
    if (nextHoveredRowId === this.hoveredRowId) return;
    this.hoveredRowId = nextHoveredRowId;
  };

  private getColumnResizeObservables(
    columns: Array<TableColumnDef<TDataRow>>,
  ): Observable<{ columnId: string; width: number }> {
    const obs = columns.map((col) =>
      this.columnSizes.getColumnWidthObservable(col.columnId),
    );
    return merge(...obs);
  }

  public close(): void {
    this.sourceSubscription.unsubscribe();
    this.columnResizeSubscription.unsubscribe();
  }

  private getCachedVirtualBounds(): VirtualBounds {
    if (!this._cachedVirtualBounds) {
      this._cachedVirtualBounds = this.getVirtualBounds();
    }
    return this._cachedVirtualBounds;
  }

  private getVirtualBounds(
    bufferX: number = 1,
    bufferY: number = 1,
  ): VirtualBounds {
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
        this.sortedRowModel.length,
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
      this.sortedRowModel.length - 1,
      bottomBound + bufferY,
    );

    return {
      leftColumnIndex,
      rightColumnIndex,
      topRowIndex,
      bottomRowIndex,
    };
  }

  private drawCells(ctx: CanvasRenderingContext2D): void {
    this.cellPool.beginFrame();

    this._cachedVirtualBounds = this.getVirtualBounds();
    const { leftColumnIndex, rightColumnIndex, topRowIndex, bottomRowIndex } =
      this._cachedVirtualBounds;
    for (let r = topRowIndex; r <= bottomRowIndex; r++) {
      const row = this.sortedRowModel.getRow(r);
      for (let c = leftColumnIndex; c <= rightColumnIndex; c++) {
        const cell = this.cellPool.next();
        const column = this.config.columns[c];
        cell.bind({
          x: this.columnSizes.getColumnXPos(column.columnId) ?? 0,
          y: r * this.config.style.body.row.height,
          width: this.columnSizes.getColumnWidth(column.columnId) ?? 0,
          height: this.config.style.body.row.height,
          data: this.cellDataStore.getCellData(
            row.rowId,
            column.columnId,
            tableDataFactoryWithPlaceholder(column, row),
          ),
        });
        cell.draw(ctx);
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.translate(-this.camera.x, -this.camera.y);

    this.drawCells(ctx);
  }
}

function tableDataFactoryWithPlaceholder<TDataRow extends TableRow>(
  column: TableColumnDef<TDataRow>,
  row: TDataRow,
): () => TableData<unknown> {
  return () => {
    const cellData = column.cellData();
    const initialValue = column.placeholderAccessorFn(row);
    cellData.setValue(initialValue);
    return cellData;
  };
}
