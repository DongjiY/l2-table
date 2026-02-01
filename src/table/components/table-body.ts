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
import { CellIndex } from "../../utils/cell-index";
import { Point } from "../../utils/point";
import { Mouse } from "../../utils/mouse";

export class TableBody<TDataRow extends TableRow>
  extends DrawCanvas
  implements Closeable
{
  private cellPool: CellPool;
  private cellDataStore: CellDataStore<TDataRow>;
  private cellIndex: CellIndex;
  private sourceSubscription: Subscription;
  private columnResizeSubscription: Subscription;
  private _tempPoint = new Point();
  private hoveredRowId: string | undefined;

  constructor(
    private readonly camera: Camera,
    private readonly config: TableConfig<TDataRow>,
    private readonly source: Observable<TableSourceData>,
    private readonly columnSizes: ColumnSizeMap<TDataRow>,
    private readonly tableWorker: TableWorker,
    private readonly mouse: Mouse,
    dimensions: Dimensions,
  ) {
    super(dimensions);

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

    this.cellIndex = new CellIndex();

    this.cellDataStore = new CellDataStore(this.config.columns);
    this.sourceSubscription = this.source.subscribe((v) => {
      const cellData = this.cellDataStore.getCellData(v.rowId, v.columnId);
      cellData.setValue(v.data);
      this.tableWorker.send({
        type: "CELL_SIZE",
        payload: {
          columnId: v.columnId,
          content: cellData.getDisplayableContent(),
        },
      });
      this.requestRedraw();
    });
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

    this.camera.onCameraFocusChange(() => this.requestRedraw());
    this.camera.onCameraResize(() => this.requestRedraw());

    this.mouse.onMouseMove(
      this.mouseMove,
      new Point(0, -1 * this.config.style.header.row.height), // TODO - need to handle when a resize occurs
    );

    this.requestRedraw();
  }

  mouseMove = (point: Point): void => {
    const worldY = point.y + this.camera.y;
    const rowHeight = this.config.style.body.row.height;
    const rowIndex = Math.floor(worldY / rowHeight);
    let nextHoveredRowId: string | undefined;
    if (rowIndex >= 0 && rowIndex < this.config.rows.length) {
      nextHoveredRowId = this.config.rows[rowIndex].rowId;
    }
    if (nextHoveredRowId === this.hoveredRowId) {
      return;
    }
    this.hoveredRowId = nextHoveredRowId;
    this.requestRedraw();
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

  private drawCells(ctx: CanvasRenderingContext2D): void {
    this.cellPool.beginFrame();

    const { leftColumnIndex, rightColumnIndex, topRowIndex, bottomRowIndex } =
      this.getVirtualBounds();
    for (let r = topRowIndex; r <= bottomRowIndex; r++) {
      const row = this.config.rows[r];
      for (let c = leftColumnIndex; c <= rightColumnIndex; c++) {
        const cell = this.cellPool.next();
        const column = this.config.columns[c];
        cell.bind({
          x: this.columnSizes.getColumnXPos(column.columnId) ?? 0,
          y: r * this.config.style.body.row.height,
          width: this.columnSizes.getColumnWidth(column.columnId) ?? 0,
          height: this.config.style.body.row.height,
          isHovered: row.rowId === this.hoveredRowId,
          data: this.cellDataStore.getCellData(
            row.rowId,
            column.columnId,
            tableDataFactoryWithPlaceholder(column, row),
          ),
        });
        cell.draw(ctx);
        this.cellIndex.register(column.columnId, row.rowId, cell);
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
