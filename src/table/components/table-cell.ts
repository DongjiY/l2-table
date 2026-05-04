import { Padding, TableCellStyles } from "../../types/table-cell-types";
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

export abstract class TableCell extends WorldObject {
  protected data: TableData<unknown> | null = null;
  protected dimensions: Dimensions = new Dimensions();
  protected _tempBoundingBox: BoundingBox | undefined;

  protected isHovered: boolean = false;

  constructor(protected readonly style?: TableCellStyles) {
    super();
  }

  public bind({
    x,
    y,
    data,
    width,
    height,
    isHovered = false,
  }: {
    x: number;
    y: number;
    data: TableData<unknown>;
    width: number;
    height: number;
    isHovered?: boolean;
  }): void {
    this.point.x = x;
    this.point.y = y;
    this.dimensions.w = width;
    this.dimensions.h = height;
    this.data = data;
    this.isHovered = isHovered;
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

  public abstract drawClipped(
    ctx: CanvasRenderingContext2D,
    clippedDimensions: Dimensions,
    padding: Required<Padding>,
  ): void;

  public abstract drawGlobal(ctx: CanvasRenderingContext2D): void;

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.font = this.style?.text?.font ?? DEFAULT_FONT_STRING;
    ctx.fillStyle = this.style?.text?.color ?? DEFAULT_TEXT_COLOR;
    ctx.textBaseline = "middle";

    this.drawGlobal(ctx);

    const padding = getPadding(this.style?.padding);
    const {
      left: leftPadding,
      right: rightPadding,
      top: topPadding,
      bottom: bottomPadding,
    } = padding;

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

    this.drawClipped(ctx, new Dimensions(innerWidth, innerHeight), padding);

    ctx.restore();
  }

  protected getAlignment(innerWidth: number): {
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
