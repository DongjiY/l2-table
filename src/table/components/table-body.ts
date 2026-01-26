import {
  TableConfig,
  TableRow,
  TableSourceData,
} from "../../types/table-config";
import { Dimensions } from "../../utils/dimensions";
import { Camera } from "../../utils/camera";
import { DrawCanvas } from "../../utils/draw-canvas";
import { TableCell } from "./table-cell";
import { filter, map, Observable } from "rxjs";
import { ColumnSizeMap } from "../../utils/column-size-map";
import {
  boundaryBinarySearchLeftOrTop,
  boundaryBinarySearchRightOrBottom,
  calculateTopAndBottomRowBounds,
} from "../../utils/boundary-search";
import { Axis } from "../../utils/axis";
import { CellPool } from "../../utils/cell-pool";
import { StringTableData } from "../../utils/string-table-data";

export class TableBody<TDataRow extends TableRow> extends DrawCanvas {
  private cellPool: CellPool;

  constructor(
    private readonly camera: Camera,
    private readonly config: TableConfig<TDataRow>,
    private readonly source: Observable<TableSourceData>,
    private readonly columnSizes: ColumnSizeMap<TDataRow>,
    dimensions: Dimensions,
  ) {
    super(dimensions);

    // this.cells = new CellCollection();
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

  // private initCells(): void {
  //   const requestRedraw = this.requestRedraw.bind(this);
  //   const { leftColumnIndex, rightColumnIndex, topRowIndex, bottomRowIndex } =
  //     this.getVirtualBounds();
  //   for (let r = topRowIndex; r <= bottomRowIndex; r++) {
  //     const row = this.config.rows[r];
  //     const { rowId } = row;
  //     for (let c = leftColumnIndex; c <= rightColumnIndex; c++) {
  //       const column = this.config.columns[c];
  //       const { columnId } = column;
  //       const cell = new TableCell(
  //         rowId,
  //         columnId,
  //         requestRedraw,
  //         this.config.style.body.cell,
  //         column,
  //         this.source,
  //       );
  //       this.cellPool.addCell(cell);
  //     }
  //   }
  // }

  private getFilteredObservable(
    rowId: string,
    columnId: string,
  ): Observable<any> {
    return this.source.pipe(
      filter((v) => v.columnId === columnId && v.rowId === rowId),
      map((v) => v.data),
    );
  }

  /*
  TODO - Need to find another place to:
  1. set world dimensions
  2. draw cells
  3. update initial column size?
  */

  // private initCells(): void {
  //   const requestRedraw = this.requestRedraw.bind(this);
  //   let x = 0;
  //   let y = 0;
  //   for (const row of this.config.rows) {
  //     const rowId = row.rowId;
  //     x = 0;
  //     for (const column of this.config.columns) {
  //       const columnId = column.columnId;
  //       const cell = new TableCell(
  //         rowId,
  //         columnId,
  //         new Point(x, y),
  //         this.config.style.body.cell,
  //         column,
  //         () => {
  //           const cellData = column.cellData();
  //           const initialValue = column.placeholderAccessorFn(row);
  //           cellData.setValue(initialValue);
  //           return cellData;
  //         },
  //         this.config.style.body.row.height,
  //         this.getFilteredObservable(row.rowId, columnId),
  //         requestRedraw,
  //         this.columnSizes.getColumnWidthObservable(columnId),
  //       );
  //       this.cells.addCell(cell);
  //       this.columnSizes.updateColumnSize(columnId, cell.w);
  //       x += cell.w;
  //     }
  //     y += this.config.style.body.row.height;
  //   }
  //   this.camera.updateWorldDimensions({
  //     w: x + VERTICAL_SCROLLBAR_WIDTH,
  //     h: y + this.config.style.header.row.height + HORIZONTAL_SCROLLBAR_HEIGHT,
  //   });
  // }

  private drawCells(ctx: CanvasRenderingContext2D): void {
    this.cellPool.beginFrame();

    const { leftColumnIndex, rightColumnIndex, topRowIndex, bottomRowIndex } =
      this.getVirtualBounds();
    for (let r = topRowIndex; r <= bottomRowIndex; r++) {
      for (let c = leftColumnIndex; c <= rightColumnIndex; c++) {
        const cell = this.cellPool.next();
        const column = this.config.columns[c];
        cell.bind({
          x: this.columnSizes.getColumnXPos(column.columnId) ?? 0,
          y: r * this.config.style.body.row.height,
          width: this.columnSizes.getColumnWidth(column.columnId) ?? 0,
          height: this.config.style.body.row.height,
          data: new StringTableData("FUCK"),
        });
        cell.draw(ctx);
      }
    }
    // for (const cell of this.cells.visibleCells(this.getVirtualBounds())) {
    //   cell.draw(ctx);
    // }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.translate(-this.camera.x, -this.camera.y);

    this.drawCells(ctx);
  }
}
