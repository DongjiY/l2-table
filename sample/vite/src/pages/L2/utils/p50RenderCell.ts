import { Dimensions, TableCell } from "../../../../../../dist";

export class P50RenderCell extends TableCell {
  drawClipped(
    ctx: CanvasRenderingContext2D,
    clippedDimensions: Dimensions,
    padding: Required<{
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    }>,
  ): void {
    // ctx.fillStyle = "green";
    // ctx.fillRect(
    //   this.point.x + padding.left,
    //   this.point.y - padding.top,
    //   clippedDimensions.w,
    //   clippedDimensions.h,
    // );
  }
  drawGlobal(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "purple";
    ctx.fillRect(this.point.x, this.point.y, this.w, this.h);
  }
}
