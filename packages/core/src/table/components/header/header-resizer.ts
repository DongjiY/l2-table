import { BoundingBox } from "../../../utils/bounding-box";
import { Dimensions } from "../../../utils/dimensions";
import { Painter } from "../../../utils/painter";
import { Point } from "../../../utils/point";
import { WorldObject } from "../../../utils/world-object";

export const RESIZER_WIDTH = 1;
export const RESIZER_HOVER_BUFFER_LEFT = 10;
export const RESIZER_HOVER_BUFFER_RIGHT = 2;
export const RESIZER_EFFECTIVE_WIDTH =
  RESIZER_WIDTH + RESIZER_HOVER_BUFFER_LEFT + RESIZER_HOVER_BUFFER_RIGHT;

export class HeaderResizer extends WorldObject {
  private isShowResizer: boolean = false;
  private resizerHeight: number = 0;
  private resizerBoundingBoxDimensions = new Dimensions(
    RESIZER_WIDTH + RESIZER_HOVER_BUFFER_LEFT + RESIZER_HOVER_BUFFER_RIGHT,
  );
  private resizerBoundingBoxWorldPoint: Point = new Point();
  private resizerBoundingBox: BoundingBox = new BoundingBox(
    this.resizerBoundingBoxWorldPoint,
    this.resizerBoundingBoxDimensions,
  );

  public bindResizer(
    headerCellWorldPoint: Point,
    headerCellDimensions: Dimensions,
  ): void {
    this.resizerHeight = headerCellDimensions.h;
    this.resizerBoundingBoxDimensions.h = this.resizerHeight;
    this.resizerBoundingBoxWorldPoint.copy(headerCellWorldPoint);
    this.resizerBoundingBoxWorldPoint.x =
      headerCellWorldPoint.x +
      headerCellDimensions.w -
      RESIZER_HOVER_BUFFER_LEFT;
  }

  public setShowResizer(showResizer: boolean): void {
    this.isShowResizer = showResizer;
  }

  public getBoundingBox(): BoundingBox {
    this.resizerBoundingBox.update(
      this.resizerBoundingBoxWorldPoint,
      this.resizerBoundingBoxDimensions,
    );
    return this.resizerBoundingBox;
  }

  public draw(painter: Painter): void {
    if (!this.isShowResizer) return;

    painter.drawRect(
      Point.at(0, 0),
      Dimensions.of(RESIZER_WIDTH, this.resizerHeight),
      "red",
    );
  }
}
