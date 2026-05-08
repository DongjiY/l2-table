import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  ReplaySubject,
  startWith,
  Subject,
} from "rxjs";
import { AnnotatedBoundingBox } from "./annotated-bounding-box";
import { Dimensions } from "./dimensions";
import { Point } from "./point";
import { TableColumnDef, TableRow } from "../types/table-config";
import { ColumnConstraints } from "../types/column-constraints";
import { clamp } from "./clamp";
import { Closeable } from "./closeable";

type BoundingBoxMetadata = { columnId: string; columnIndex: number };

export class ColumnSizeMap<TDataRow extends TableRow> implements Closeable {
  private readonly columnConstraints: ColumnConstraints;

  private totalColumnSizeUpdates$: Subject<number>;
  private totalColumnSize: number = 0;

  private columnSizeUpdates$: Subject<{ columnId: string; value: number }>;
  private columnSizes: Map<string, number>;

  private columnXPos: Map<string, number>;
  private minColumnSize: number = Infinity;
  private boundingBoxes: Array<AnnotatedBoundingBox<BoundingBoxMetadata>>;

  private manualControlledColumnIds: Set<string>;

  constructor(
    cols: Array<TableColumnDef<TDataRow, unknown>>,
    columnConstraints: ColumnConstraints
  ) {
    this.totalColumnSizeUpdates$ = new ReplaySubject(1);
    this.columnSizeUpdates$ = new Subject();
    this.columnSizes = new Map();
    this.columnXPos = new Map();
    this.boundingBoxes = [];
    this.manualControlledColumnIds = new Set();

    this.columnConstraints = columnConstraints;

    // seed the initial widths
    for (const col of cols) {
      const maxWidth = col.maxWidth ?? 1;
      this.updateColumnSize(col.columnId, maxWidth);
    }
  }

  /**
   * This MUST be called in the order that the columns are in
   * @param columnId
   * @param size
   */
  public updateColumnSize(columnId: string, size: number): void {
    const clampedSize = clamp(
      size,
      this.columnConstraints[columnId].minWidth,
      this.columnConstraints[columnId].maxWidth
    );
    const currColumnSize = this.columnSizes.get(columnId) ?? 0;
    this.columnSizes.set(columnId, clampedSize);
    this.minColumnSize = Math.min(clampedSize, this.minColumnSize);
    this.updateTotalColumnSize(clampedSize - currColumnSize);
    this.columnSizeUpdates$.next({ columnId, value: clampedSize });
    this.recomputeBoundingBoxesAndXPos();
  }

  public updateTotalColumnSize(delta: number): void {
    this.totalColumnSize += delta;
    this.totalColumnSizeUpdates$.next(this.totalColumnSize);
  }

  public updateColumnXPos(columnId: string, xPos: number): void {
    this.columnXPos.set(columnId, xPos);
  }

  public getTotalColumnSizeObservable(): Observable<number> {
    return this.totalColumnSizeUpdates$.pipe(distinctUntilChanged());
  }

  public getColumnWidthObservable(
    columnId: string
  ): Observable<{ columnId: string; width: number }> {
    return this.columnSizeUpdates$.pipe(
      filter((v) => v.columnId === columnId),
      map((v) => v.value),
      startWith(this.columnSizes.get(columnId) ?? 0),
      distinctUntilChanged(),
      map((v) => ({ columnId, width: v }))
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

  public getTotalColumnWidth(): number {
    let sum = 0;
    for (const width of this.columnSizes.values()) {
      sum += width;
    }
    return sum;
  }

  public getBoundingBoxes(): Array<AnnotatedBoundingBox<BoundingBoxMetadata>> {
    return this.boundingBoxes;
  }

  public addColumnToManualControl(columnId: string): void {
    this.manualControlledColumnIds.add(columnId);
  }

  public removeColumnFromManualControl(columnId: string): void {
    this.manualControlledColumnIds.delete(columnId);
  }

  public getManualControlledColumns(): Set<string> {
    return this.manualControlledColumnIds;
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
          }
        )
      );
      this.updateColumnXPos(columnId, x);
      i++;
      x += columnWidth;
    }
  }

  public close(): void {
    this.columnSizeUpdates$.complete();
  }
}
