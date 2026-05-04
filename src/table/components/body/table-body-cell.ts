import { Padding } from "../../../types/table-cell-types";
import { Dimensions } from "../../../utils/dimensions";
import { Painter } from "../../../utils/painter";
import { Point } from "../../../utils/point";
import { TableCell } from "../table-cell";

export class TableBodyCell extends TableCell {
  public drawClipped(
    painter: Painter,
    clippedDimensions: Dimensions,
    padding: Required<Padding>,
  ): void {
    const { x, textAlign } = this.getAlignment(clippedDimensions.w);

    const y = this.point.y + padding.top + clippedDimensions.h / 2;

    const textContent = this.data?.getDisplayableContent() ?? "NA";
    painter.writeText(textContent, Point.at(x, y), {
      font: this.style?.text?.font,
      color: this.style?.text?.color,
      baseline: "middle",
      alignment: textAlign,
    });
  }

  public drawGlobal(painter: Painter): void {
    if (this.isHovered && this.style?.hovered?.backgroundColor) {
      painter.drawRect(
        this.point,
        this.dimensions,
        this.style.hovered.backgroundColor,
      );
    }
  }
}
