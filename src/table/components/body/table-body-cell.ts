import { Padding } from "../../../types/table-cell-types";
import { Dimensions } from "../../../utils/dimensions";
import { TableData } from "../../../utils/table-data";
import { TableCell } from "../table-cell";

export class TableBodyCell extends TableCell {
  private isHovered: boolean = false;

  public bind({
    x,
    y,
    data,
    width,
    height,
    isHovered,
  }: {
    x: number;
    y: number;
    data: TableData<unknown>;
    width: number;
    height: number;
    isHovered: boolean;
  }): void {
    super.bind({
      x,
      y,
      data,
      width,
      height,
    });
    this.isHovered = isHovered;
  }

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

    if (this.isHovered) {
      ctx.fillStyle = "red";

      ctx.fillRect(
        this.point.x,
        this.point.y,
        this.dimensions.w,
        this.dimensions.h,
      );
    }

    ctx.restore();
  }
}
