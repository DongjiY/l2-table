import { Padding, TableCellStyles } from "../../../types/table-cell-types";
import {
  DEFAULT_FONT_STRING,
  DEFAULT_TEXT_COLOR,
} from "../../../utils/cell-style-defaults";
import { Point } from "../../../utils/point";
import { TableData } from "../../../utils/table-data";
import { HeaderFilter } from "./header-filter";
import { HeaderResizer, RESIZER_WIDTH } from "./header-resizer";
import { TableCell } from "../table-cell";
import { Dimensions } from "../../../utils/dimensions";

export class TableHeaderCell extends TableCell {
  private headerFilter: HeaderFilter;
  private headerResizer: HeaderResizer;

  constructor(style: TableCellStyles | undefined) {
    super(style);
    this.headerFilter = new HeaderFilter();
    this.headerResizer = new HeaderResizer();
  }

  public bind({
    x,
    y,
    data,
    width,
    height,
    sortDirection,
  }: {
    x: number;
    y: number;
    data: TableData<unknown>;
    width: number;
    height: number;
    sortDirection: "ASC" | "DESC" | undefined;
  }): void {
    super.bind({ x, y, data, width, height });
    this.headerFilter.setDirection(sortDirection);
    this.headerResizer.bindResizer(this.point, this.dimensions);
  }

  public checkAndSetResizerHovered(viewportPoint: Point | undefined): boolean {
    if (viewportPoint === undefined) {
      this.headerResizer.setShowResizer(false);
      return false;
    }

    const isResizerHovered = this.headerResizer
      .getBoundingBox()
      .intersects(viewportPoint);
    this.headerResizer.setShowResizer(isResizerHovered);
    return isResizerHovered;
  }

  public drawClipped(
    ctx: CanvasRenderingContext2D,
    clippedDimensions: Dimensions,
    padding: Required<Padding>,
  ): void {
    const innerWidth = clippedDimensions.w;
    const innerHeight = clippedDimensions.h;

    ctx.save();

    ctx.font = this.style?.text?.font ?? DEFAULT_FONT_STRING;
    ctx.fillStyle = this.style?.text?.color ?? DEFAULT_TEXT_COLOR;
    ctx.textBaseline = "middle";

    ctx.beginPath();
    ctx.rect(
      this.point.x + padding.left,
      this.point.y + padding.top,
      innerWidth,
      innerHeight,
    );
    ctx.clip();

    const { x, textAlign } = this.getAlignment(innerWidth);
    ctx.textAlign = textAlign;

    const y = this.point.y + padding.top + innerHeight / 2;

    ctx.fillText(this.data?.getDisplayableContent() ?? "NA", x, y);

    const filterX = this.point.x + this.dimensions.w - padding.right - 6;
    const filterY = this.point.y + padding.top + innerHeight / 2;

    ctx.save();
    ctx.translate(filterX, filterY);
    this.headerFilter.draw(ctx);
    ctx.restore();

    ctx.restore();
  }

  public drawGlobal(ctx: CanvasRenderingContext2D): void {
    const resizerX = this.point.x + this.dimensions.w - RESIZER_WIDTH;

    ctx.save();
    ctx.translate(resizerX, this.point.y);
    this.headerResizer.draw(ctx);
    ctx.restore();
  }
}
