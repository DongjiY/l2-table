import { Padding } from "../types/styles";
import { DEFAULT_FONT_STRING, DEFAULT_TEXT_COLOR } from "./cell-style-defaults";
import { Dimensions } from "./dimensions";
import { Point } from "./point";

type RestoreFunction = () => void;

export class Painter {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public dangerouslyGetRenderingContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  public translateFromViewport(x: number, y: number): void {
    this.ctx.translate(
      -Point.snapToDevicePixel(x),
      -Point.snapToDevicePixel(y)
    );
  }

  public drawRect(point: Point, dimensions: Dimensions, color: string): void {
    this.ctx.save();

    this.ctx.fillStyle = color;

    const x1 = Point.snapToDevicePixel(point.x);
    const x2 = Point.snapToDevicePixel(point.x + dimensions.w);
    const y1 = Point.snapToDevicePixel(point.y);
    const y2 = Point.snapToDevicePixel(point.y + dimensions.h);

    this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

    this.ctx.restore();
  }

  public writeText(
    text: string,
    point: Point,
    opts?: Partial<{
      font: string;
      color: string;
      baseline: CanvasTextBaseline;
      alignment: CanvasTextAlign;
    }>
  ): void {
    this.ctx.save();

    this.ctx.textAlign = opts?.alignment ?? "right";
    this.ctx.font = opts?.font ?? DEFAULT_FONT_STRING;
    this.ctx.fillStyle = opts?.color ?? DEFAULT_TEXT_COLOR;
    this.ctx.textBaseline = opts?.baseline ?? "middle";

    this.ctx.fillText(text, point.x, point.y);

    this.ctx.restore();
  }

  public clipArea(
    point: Point,
    dimensions: Dimensions,
    padding: Required<Padding>
  ): RestoreFunction {
    this.ctx.save();

    this.ctx.beginPath();
    const innerWidth = dimensions.w - padding.left - padding.right;
    const innerHeight = dimensions.h - padding.top - padding.bottom;
    this.ctx.rect(
      point.x + padding.left,
      point.y + padding.top,
      innerWidth,
      innerHeight
    );
    this.ctx.clip();

    return () => this.ctx.restore();
  }
}
