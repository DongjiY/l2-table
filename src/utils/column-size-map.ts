import { filter, map, Observable, startWith, Subject } from "rxjs";
import { AnnotatedBoundingBox } from "./annotated-bounding-box";
import { Dimensions } from "./dimensions";
import { Point } from "./point";

type BoundingBoxMetadata = { columnId: string; columnIndex: number };

export class ColumnSizeMap {
  private columnSizeUpdates$: Subject<{ columnId: string; value: number }>;
  private columnSizes: Map<string, number>;
  private boundingBoxes: Array<AnnotatedBoundingBox<BoundingBoxMetadata>>;

  constructor() {
    this.columnSizeUpdates$ = new Subject();
    this.columnSizes = new Map();
    this.boundingBoxes = [];
  }

  /**
   * This MUST be called in the order that the columns are in
   * @param columnId
   * @param size
   */
  public updateColumnSize(columnId: string, size: number): void {
    const currentColumnSize = this.columnSizes.get(columnId);
    const newSize = Math.max(size, currentColumnSize ?? 0);
    this.columnSizes.set(columnId, newSize);
    this.columnSizeUpdates$.next({ columnId, value: newSize });
    this.recomputeBoundingBoxes();
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

  public getBoundingBoxes(): Array<AnnotatedBoundingBox<BoundingBoxMetadata>> {
    return this.boundingBoxes;
  }

  private recomputeBoundingBoxes(): void {
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
      i++;
      x += columnWidth;
    }
  }
}
