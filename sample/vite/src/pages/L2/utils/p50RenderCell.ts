import { Dimensions, Painter, Point, TableCell, type Padding } from "@dongjiy/l2-table";

export class P50RenderCell extends TableCell {
  drawClipped(
    painter: Painter,
    clippedDimensions: Dimensions,
    padding: Required<Padding>,
  ): void {
    painter.drawRect(
      Point.at(this.point.x + padding.left, this.point.y + padding.top),
      clippedDimensions,
      "pink",
    );
  }

  drawGlobal(painter: Painter): void {
    painter.drawRect(this.point, this.dimensions, "purple");
  }
}
