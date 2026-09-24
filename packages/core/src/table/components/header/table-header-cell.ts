import {
  Padding,
  TableCellStyles,
  TableHeaderResizerStyles,
} from "../../../types/styles";
import { Point } from "../../../utils/point";
import { TableData } from "../../../utils/table-data";
import { HeaderFilter } from "./header-filter";
import { HeaderResizer } from "./header-resizer";
import { TableCell } from "../table-cell";
import { Dimensions } from "../../../utils/dimensions";
import { Painter } from "../../../utils/painter";

export class TableHeaderCell extends TableCell {
  private headerFilter: HeaderFilter;
  private headerResizer: HeaderResizer;

  constructor(
    cellStyle: TableCellStyles | undefined,
    resizerStyle: TableHeaderResizerStyles | undefined
  ) {
    super(cellStyle);
    this.headerFilter = new HeaderFilter();
    this.headerResizer = new HeaderResizer(resizerStyle);
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
    painter: Painter,
    clippedDimensions: Dimensions,
    padding: Required<Padding>
  ): number {
    const innerWidth = clippedDimensions.w;
    const innerHeight = clippedDimensions.h;

    const { x, textAlign } = this.getAlignment(innerWidth);

    const y = this.point.y + padding.top + innerHeight / 2;
    const textContent = this.data?.getDisplayableContent() ?? "NA";

    const textWidth = painter.writeText(textContent, Point.at(x, y), {
      font: this.style?.text?.font,
      color: this.style?.text?.color,
      baseline: "middle",
      alignment: textAlign,
    });

    let filterWidth = 0;
    painter.dangerouslyDrawWithCanvasCtx((ctx) => {
      const filterX = this.point.x + this.dimensions.w - padding.right - 6;
      const filterY = this.point.y + padding.top + innerHeight / 2;

      ctx.save();
      ctx.translate(filterX, filterY);
      filterWidth = this.headerFilter.draw(painter);
      ctx.restore();
    });

    return textWidth + filterWidth;
  }

  public drawGlobal(painter: Painter): number {
    if (this.style?.backgroundColor) {
      painter.drawRect(this.point, this.dimensions, this.style.backgroundColor);
    }

    let resizerWidth = 0;
    painter.dangerouslyDrawWithCanvasCtx((ctx) => {
      const resizerX = this.point.x + this.dimensions.w - this.headerResizer.w;

      ctx.save();
      ctx.translate(resizerX, this.point.y);
      resizerWidth = this.headerResizer.draw(painter);
      ctx.restore();
    });

    return resizerWidth;
  }
}
