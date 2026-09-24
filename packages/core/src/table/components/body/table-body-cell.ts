import { Padding } from "../../../types/styles";
import { Dimensions } from "../../../utils/dimensions";
import { Painter } from "../../../utils/painter";
import { Point } from "../../../utils/point";
import { TableCell } from "../table-cell";

export class TableBodyCell extends TableCell {
  public drawClipped(
    painter: Painter,
    clippedDimensions: Dimensions,
    padding: Required<Padding>
  ): number {
    const { x, textAlign } = this.getAlignment(clippedDimensions.w);

    const y = this.point.y + padding.top + clippedDimensions.h / 2;

    if (this.data) {
      return painter.writeText(this.data, Point.at(x, y), {
        font: this.style?.text?.font,
        color: this.style?.text?.color,
        baseline: "middle",
        alignment: textAlign,
      });
    }

    return 0;
  }

  public drawGlobal(painter: Painter): number {
    if (this.style?.backgroundColor) {
      painter.drawRect(this.point, this.dimensions, this.style.backgroundColor);
    }

    if (this.isHovered && this.style?.hovered?.backgroundColor) {
      painter.drawRect(
        this.point,
        this.dimensions,
        this.style.hovered.backgroundColor
      );
    }

    return 0;
  }
}
