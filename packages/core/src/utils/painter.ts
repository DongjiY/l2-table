import { TableWorker } from "../table/table-worker";
import { Padding } from "../types/styles";
import { DEFAULT_FONT_STRING, DEFAULT_TEXT_COLOR } from "./cell-style-defaults";
import { ContentWidthCache } from "./content-width-cache";
import { Dimensions } from "./dimensions";
import { Layouter } from "./layouter";
import { Point } from "./point";
import { TableData } from "./table-data";

export class Painter {
  private ctx: CanvasRenderingContext2D;

  constructor(
    ctx: CanvasRenderingContext2D,
    private readonly layouter: Layouter,
    private readonly contentCache: ContentWidthCache,
    private readonly tableWorker: TableWorker
  ) {
    this.ctx = ctx;
  }

  public layout(w: number): void {
    this.layouter.layout(w);
  }

  public dangerouslyDrawWithCanvasCtx(
    cb: (ctx: CanvasRenderingContext2D) => void
  ): Layouter {
    cb(this.ctx);
    return this.layouter;
  }

  public translateFromViewport(x: number, y: number): void {
    this.ctx.translate(
      -Point.snapToDevicePixel(x),
      -Point.snapToDevicePixel(y)
    );
  }

  public drawRect(
    point: Point,
    dimensions: Dimensions,
    color: string
  ): Layouter {
    this.ctx.save();

    this.ctx.fillStyle = color;

    const x1 = Point.snapToDevicePixel(point.x);
    const x2 = Point.snapToDevicePixel(point.x + dimensions.w);
    const y1 = Point.snapToDevicePixel(point.y);
    const y2 = Point.snapToDevicePixel(point.y + dimensions.h);

    this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

    this.ctx.restore();

    return this.layouter;
  }

  public writeText(
    content: string | TableData<unknown>,
    point: Point,
    opts?: Partial<{
      font: string;
      color: string;
      baseline: CanvasTextBaseline;
      alignment: CanvasTextAlign;
    }>
  ): number {
    const isDynamic = content instanceof TableData;

    this.ctx.save();

    this.ctx.textAlign = opts?.alignment ?? "right";
    const font = opts?.font ?? DEFAULT_FONT_STRING;
    this.ctx.font = font;
    this.ctx.fillStyle = opts?.color ?? DEFAULT_TEXT_COLOR;
    this.ctx.textBaseline = opts?.baseline ?? "middle";

    const text = isDynamic ? content.getDisplayableContent() : content;
    const contentKey = ContentWidthCache.generateKey(text, font);

    if (
      isDynamic ||
      this.contentCache.getStaticContentWidth(contentKey) === undefined
    ) {
      this.tableWorker.send({
        type: "MEASURE_CONTENT",
        payload: {
          content: text,
          font: font,
          type: isDynamic ? "dynamic" : "static",
        },
      });
    }

    this.ctx.fillText(text, point.x, point.y);

    this.ctx.restore();

    const contentWidth = isDynamic
      ? this.contentCache.getDynamicContentWidth(contentKey)
      : this.contentCache.getStaticContentWidth(contentKey);
    return contentWidth ?? 0; // todo - should this cancel this draw?
  }

  public clipArea(
    point: Point,
    dimensions: Dimensions,
    padding: Required<Padding>,
    clippedContent: () => void
  ): Layouter {
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

    clippedContent();

    this.ctx.restore();

    return this.layouter;
  }
}
