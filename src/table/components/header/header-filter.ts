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

  public draw(painter: Painter): void {
    const x = 0;
    const y = -HEADER_FILTER_WIDTH;

    painter.dangerouslyGetRenderingContext().save();

    painter.dangerouslyGetRenderingContext().beginPath();
    painter.dangerouslyGetRenderingContext().moveTo(x, y);
    painter
      .dangerouslyGetRenderingContext()
      .lineTo(x - HEADER_FILTER_WIDTH, y + HEADER_FILTER_WIDTH);
    painter
      .dangerouslyGetRenderingContext()
      .lineTo(x + HEADER_FILTER_WIDTH, y + HEADER_FILTER_WIDTH);
    painter.dangerouslyGetRenderingContext().closePath();
    painter.dangerouslyGetRenderingContext().fillStyle =
      this.direction === "ASC" ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.3)";
    painter.dangerouslyGetRenderingContext().fill();

    const downY = y + HEADER_FILTER_WIDTH + HEADER_FILTER_SPACING;

    painter.dangerouslyGetRenderingContext().beginPath();
    painter
      .dangerouslyGetRenderingContext()
      .moveTo(x, downY + HEADER_FILTER_WIDTH);
    painter
      .dangerouslyGetRenderingContext()
      .lineTo(x - HEADER_FILTER_WIDTH, downY);
    painter
      .dangerouslyGetRenderingContext()
      .lineTo(x + HEADER_FILTER_WIDTH, downY);
    painter.dangerouslyGetRenderingContext().closePath();
    painter.dangerouslyGetRenderingContext().fillStyle =
      this.direction === "DESC" ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.3)";
    painter.dangerouslyGetRenderingContext().fill();

    painter.dangerouslyGetRenderingContext().restore();
  }

  public setDirection(direction: "ASC" | "DESC" | undefined) {
    this.direction = direction;
  }
}
