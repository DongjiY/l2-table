import { Drawable } from "../../../utils/drawable";
import { Painter } from "../../../utils/painter";

const HEADER_FILTER_WIDTH = 6;
const HEADER_FILTER_SPACING = 2;
export const HEADER_FILTER_BUFFER = HEADER_FILTER_WIDTH + 20;

export class HeaderFilter implements Drawable {
  private direction: "ASC" | "DESC" | undefined;

  constructor(direction?: "ASC" | "DESC") {
    this.direction = direction;
  }

  public draw(painter: Painter): number {
    const x = 0;
    const y = -HEADER_FILTER_WIDTH;

    painter.dangerouslyDrawWithCanvasCtx((ctx) => {
      ctx.save();

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - HEADER_FILTER_WIDTH, y + HEADER_FILTER_WIDTH);
      ctx.lineTo(x + HEADER_FILTER_WIDTH, y + HEADER_FILTER_WIDTH);
      ctx.closePath();
      ctx.fillStyle =
        this.direction === "ASC" ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.3)";
      ctx.fill();

      const downY = y + HEADER_FILTER_WIDTH + HEADER_FILTER_SPACING;

      ctx.beginPath();
      ctx.moveTo(x, downY + HEADER_FILTER_WIDTH);
      ctx.lineTo(x - HEADER_FILTER_WIDTH, downY);
      ctx.lineTo(x + HEADER_FILTER_WIDTH, downY);
      ctx.closePath();
      ctx.fillStyle =
        this.direction === "DESC" ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.3)";
      ctx.fill();

      ctx.restore();
    });

    return HEADER_FILTER_BUFFER;
  }

  public setDirection(direction: "ASC" | "DESC" | undefined) {
    this.direction = direction;
  }
}
