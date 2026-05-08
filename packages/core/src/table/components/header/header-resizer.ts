import { TableHeaderResizerStyles } from "../../../types/styles";
import { BoundingBox } from "../../../utils/bounding-box";
import { Dimensions } from "../../../utils/dimensions";
import { Painter } from "../../../utils/painter";
import { Point } from "../../../utils/point";
import { WorldObject } from "../../../utils/world-object";

export const DEFAULT_RESIZER_WIDTH = 1;
export const RESIZER_HOVER_BUFFER_LEFT = 10;
export const RESIZER_HOVER_BUFFER_RIGHT = 2;
const RESIZER_DEFAULT_COLOR = "gray";

export class HeaderResizer extends WorldObject {
  private isShowResizer: boolean = false;
  private resizerHeight: number = 0;
  private resizerWidth: number;

  private resizerBoundingBoxDimensions;
  private resizerBoundingBoxWorldPoint: Point = new Point();
  private resizerBoundingBox: BoundingBox;

  constructor(private readonly styles: TableHeaderResizerStyles | undefined) {
    super();
    this.resizerWidth = styles?.width ?? DEFAULT_RESIZER_WIDTH;
    this.resizerBoundingBoxDimensions = new Dimensions(
      this.resizerWidth + RESIZER_HOVER_BUFFER_LEFT + RESIZER_HOVER_BUFFER_RIGHT
    );
    this.resizerBoundingBox = new BoundingBox(
      this.resizerBoundingBoxWorldPoint,
      this.resizerBoundingBoxDimensions
    );
  }

  public get w(): number {
    return this.resizerWidth;
  }

  public bindResizer(
    headerCellWorldPoint: Point,
    headerCellDimensions: Dimensions
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
      this.resizerBoundingBoxDimensions
    );
    return this.resizerBoundingBox;
  }

  public draw(painter: Painter): void {
    if (!this.isShowResizer) return;

    painter.drawRect(
      Point.at(0, 0),
      Dimensions.of(this.resizerWidth, this.resizerHeight),
      this.styles?.color ?? RESIZER_DEFAULT_COLOR
    );
  }
}
