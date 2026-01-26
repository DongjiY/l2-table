import {
  TableConfig,
  TableRow,
  TableSourceData,
} from "../../types/table-config";
import { Dimensions } from "../../utils/dimensions";
import { Camera } from "../../utils/camera";
import { DrawCanvas } from "../../utils/draw-canvas";
import { TableCell } from "./table-cell";
import { Observable, Subscription } from "rxjs";
import { ColumnSizeMap } from "../../utils/column-size-map";
import {
  boundaryBinarySearchLeftOrTop,
  boundaryBinarySearchRightOrBottom,
  calculateTopAndBottomRowBounds,
} from "../../utils/boundary-search";
import { Axis } from "../../utils/axis";
import { CellPool } from "../../utils/cell-pool";
import { StringTableData } from "../../utils/string-table-data";
import { Closeable } from "../../utils/closeable";
import { CellDataStore } from "../../utils/cell-data-store";

export class TableBody<TDataRow extends TableRow>
  extends DrawCanvas
  implements Closeable
{
  private cellPool: CellPool;
  private cellDataStore: CellDataStore;
  private sourceSubscription: Subscription;

  constructor(
    private readonly camera: Camera,
    private readonly config: TableConfig<TDataRow>,
    private readonly source: Observable<TableSourceData>,
    private readonly columnSizes: ColumnSizeMap<TDataRow>,
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

    this.cellDataStore = new CellDataStore();
    this.sourceSubscription = this.source.subscribe((v) => {
      const cellData = this.cellDataStore.tryGetCellData(v.rowId, v.columnId);
      if (cellData !== undefined) {
        cellData.setValue(v.data);
        this.requestRedraw();
      }
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

    this.requestRedraw();
  }

  public close(): void {
    this.sourceSubscription.unsubscribe();
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
          data: this.cellDataStore.getCellData(
            row.rowId,
            column.columnId,
            () => {
              const cellData = column.cellData();
              const initialValue = column.placeholderAccessorFn(row);
              cellData.setValue(initialValue);
              return cellData;
            },
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
