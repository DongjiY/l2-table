import { TableCellStyles } from "../../types/table-cell-types";
import {
  DEFAULT_FONT_STRING,
  DEFAULT_TEXT_COLOR,
} from "../../utils/cell-style-defaults";
import { getPadding } from "../../utils/padding-utils";
import { TableData } from "../../utils/table-data";
import { HeaderFilter } from "./header-filter";
import { TableCell } from "./table-cell";

export class TableHeaderCell extends TableCell {
  private headerFilter: HeaderFilter;

  constructor(style: TableCellStyles | undefined) {
    super(style);
    this.headerFilter = new HeaderFilter();
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
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.font = this.style?.text?.font ?? DEFAULT_FONT_STRING;
    ctx.fillStyle = this.style?.text?.color ?? DEFAULT_TEXT_COLOR;
    ctx.textBaseline = "middle";

    const {
      left: leftPadding,
      right: rightPadding,
      top: topPadding,
      bottom: bottomPadding,
    } = getPadding(this.style?.padding);

    ctx.beginPath();
    const innerWidth = this.dimensions.w - leftPadding - rightPadding;
    const innerHeight = this.dimensions.h - topPadding - bottomPadding;
    ctx.rect(
      this.point.x + leftPadding,
      this.point.y + topPadding,
      innerWidth,
      innerHeight,
    );
    ctx.clip();

    const { x, textAlign } = this.getAlignment(innerWidth);

    ctx.textAlign = textAlign;

    const y = this.point.y + topPadding + innerHeight / 2;

    ctx.fillText(this.data?.getDisplayableContent() ?? "NA", x, y);

    ctx.save();

    const filterX = this.point.x + this.dimensions.w - rightPadding - 6;

    const filterY =
      this.point.y +
      topPadding +
      (this.dimensions.h - topPadding - bottomPadding) / 2;

    ctx.translate(filterX, filterY);

    this.headerFilter.draw(ctx);

    ctx.restore();

    ctx.restore();
  }
}
