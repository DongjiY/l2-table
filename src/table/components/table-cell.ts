import { TableCellStyles } from "../../types/table-cell-types";
import { Dimensions } from "../../utils/dimensions";
import { WorldObject } from "../../utils/world-object";
import { TableData } from "../../utils/table-data";
import { BoundingBox } from "../../utils/bounding-box";
import {
  DEFAULT_FONT_STRING,
  DEFAULT_TEXT_COLOR,
  DEFAULT_TEXT_ALIGN,
} from "../../utils/cell-style-defaults";
import { getPadding } from "../../utils/padding-utils";

export class TableCell extends WorldObject {
  private data: TableData<unknown> | null = null;
  private dimensions: Dimensions = new Dimensions();
  private _tempBoundingBox: BoundingBox | undefined;

  constructor(private readonly style: TableCellStyles | undefined) {
    super();
  }

  public bind({
    x,
    y,
    data,
    width,
    height,
  }: {
    x: number;
    y: number;
    data: TableData<unknown>;
    width: number;
    height: number;
  }): void {
    this.point.x = x;
    this.point.y = y;
    this.dimensions.w = width;
    this.dimensions.h = height;
    this.data = data;
  }

  public get w(): number {
    return this.dimensions.w;
  }

  public get h(): number {
    return this.dimensions.h;
  }

  public getBoundingBox(): BoundingBox {
    if (!this._tempBoundingBox) {
      this._tempBoundingBox = new BoundingBox(this.point, this.dimensions);
    }
    this._tempBoundingBox.update(this.point, this.dimensions);
    return this._tempBoundingBox;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    if (this.state.isHovered) {
      ctx.fillStyle = "red";
      ctx.fillRect(
        this.point.x,
        this.point.y,
        this.dimensions.w,
        this.dimensions.h,
      );
    }

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

    ctx.restore();
  }

  private getAlignment(innerWidth: number): {
    x: number;
    textAlign: CanvasTextAlign;
  } {
    const alignment = this.style?.text?.alignment ?? DEFAULT_TEXT_ALIGN;
    const { left: leftPadding, right: rightPadding } = getPadding(
      this.style?.padding,
    );
    switch (alignment) {
      case "middle":
        return {
          x: this.point.x + leftPadding + innerWidth / 2,
          textAlign: "center",
        };
      case "right":
        return {
          x: this.point.x + this.dimensions.w - rightPadding,
          textAlign: "right",
        };
      case "left":
      default:
        return {
          x: this.point.x + leftPadding,
          textAlign: "left",
        };
    }
  }
}
