import { filter, map, Observable, startWith, Subject } from "rxjs";
import { AnnotatedBoundingBox } from "./annotated-bounding-box";
import { Dimensions } from "./dimensions";
import { Point } from "./point";
import { TableColumnDef, TableRow } from "../types/table-config";

type BoundingBoxMetadata = { columnId: string; columnIndex: number };

export class ColumnSizeMap<TDataRow extends TableRow> {
  private columnSizeUpdates$: Subject<{ columnId: string; value: number }>;
  private columnSizes: Map<string, number>;
  private columnXPos: Map<string, number>;
  private minColumnSize: number = Infinity;
  private boundingBoxes: Array<AnnotatedBoundingBox<BoundingBoxMetadata>>;

  constructor(cols: Array<TableColumnDef<TDataRow, unknown>>) {
    this.columnSizeUpdates$ = new Subject();
    this.columnSizes = new Map();
    this.columnXPos = new Map();
    this.boundingBoxes = [];

    // seed the initial widths
    for (const col of cols) {
      this.updateColumnSize(col.columnId, col.maxWidth);
    }
  }

  /**
   * This MUST be called in the order that the columns are in
   * @param columnId
   * @param size
   */
  public updateColumnSize(columnId: string, size: number): void {
    this.columnSizes.set(columnId, size);
    this.minColumnSize = Math.min(size, this.minColumnSize);
    this.columnSizeUpdates$.next({ columnId, value: size });
    this.recomputeBoundingBoxesAndXPos();
  }

  public updateColumnXPos(columnId: string, xPos: number): void {
    this.columnXPos.set(columnId, xPos);
  }

  public getColumnWidthObservable(
    columnId: string,
  ): Observable<number | undefined> {
    return this.columnSizeUpdates$.pipe(
      filter((v) => v.columnId === columnId),
      map((v) => v.value),
      startWith(this.columnSizes.get(columnId)),
    );
  }

  public getMinColumnWidth(): number {
    return this.minColumnSize;
  }

  public getColumnWidth(columnId: string): number | undefined {
    return this.columnSizes.get(columnId);
  }

  public getColumnXPos(columnId: string): number | undefined {
    return this.columnXPos.get(columnId);
  }

  public getBoundingBoxes(): Array<AnnotatedBoundingBox<BoundingBoxMetadata>> {
    return this.boundingBoxes;
  }

  private recomputeBoundingBoxesAndXPos(): void {
    this.boundingBoxes = [];
    let x = 0;
    let i = 0;
    for (const [columnId, columnWidth] of this.columnSizes.entries()) {
      this.boundingBoxes.push(
        new AnnotatedBoundingBox(
          new Point(x, 0),
          new Dimensions(columnWidth, 1),
          {
            columnId,
            columnIndex: i,
          },
        ),
      );
      this.updateColumnXPos(columnId, x);
      i++;
      x += columnWidth;
    }
  }

  public print(): void {
    console.log(this.columnXPos, this.columnSizes);
  }
}
