import { Padding } from "../../../types/table-cell-types";
import { Dimensions } from "../../../utils/dimensions";
import { TableCell } from "../table-cell";

export class TableBodyCell extends TableCell {
  public drawClipped(
    ctx: CanvasRenderingContext2D,
    clippedDimensions: Dimensions,
    padding: Required<Padding>,
  ): void {
    const { x, textAlign } = this.getAlignment(clippedDimensions.w);

    ctx.textAlign = textAlign;

    const y = this.point.y + padding.top + clippedDimensions.h / 2;

    ctx.fillText(this.data?.getDisplayableContent() ?? "NA", x, y);
  }

  public drawGlobal(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    if (this.isHovered && this.style?.hovered?.backgroundColor) {
      ctx.fillStyle = this.style?.hovered?.backgroundColor;

      ctx.fillRect(
        this.point.x,
        this.point.y,
        this.dimensions.w + 1,
        this.dimensions.h,
      );
    }

    ctx.restore();
  }
}
