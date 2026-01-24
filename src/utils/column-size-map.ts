import { AnnotatedBoundingBox } from "./annotated-bounding-box";
import { Dimensions } from "./dimensions";
import { Point } from "./point";

type BoundingBoxMetadata = { columnId: string; columnIndex: number };
export class ColumnSizeMap {
  private columnSizes: Map<string, number> = new Map();
  private boundingBoxes: Array<AnnotatedBoundingBox<BoundingBoxMetadata>> = [];

  /**
   * This MUST be called in the order that the columns are in
   * @param columnId
   * @param size
   */
  public updateColumnSize(columnId: string, size: number): void {
    const currentColumnSize = this.columnSizes.get(columnId);
    this.columnSizes.set(columnId, Math.max(size, currentColumnSize ?? 0));
    this.recomputeBoundingBoxes();
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
