import { Dimensions, Painter, TableCell } from "../../../../../../dist";

export class P50RenderCell extends TableCell {
  drawClipped(
    painter: Painter,
    clippedDimensions: Dimensions,
    padding: Required<{
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    }>,
  ): void {
    void this.drawClipped;
  }

  drawGlobal(painter: Painter): void {
    painter.drawRect(this.point, this.dimensions, "purple");
  }
}
