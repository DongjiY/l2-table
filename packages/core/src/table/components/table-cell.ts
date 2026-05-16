import { Padding, TableCellStyles } from "../../types/styles";
import { Dimensions } from "../../utils/dimensions";
import { WorldObject } from "../../utils/world-object";
import { TableData } from "../../utils/table-data";
import { BoundingBox } from "../../utils/bounding-box";
import { DEFAULT_TEXT_ALIGN } from "../../utils/cell-style-defaults";
import { getPadding } from "../../utils/padding-utils";
import { Painter } from "../../utils/painter";
import { Component } from "../../utils/component";

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

  // public abstract drawClipped(
  //   painter: Painter,
  //   clippedDimensions: Dimensions,
  //   padding: Required<Padding>,
  // ): void;

  // public abstract drawGlobal(painter: Painter): void;

  public abstract build(): Component;

  public draw(painter: Painter): void {
    // this.drawGlobal(painter);
    // const padding = getPadding(this.style?.padding);
    // const restoreClip = painter.clipArea(this.point, this.dimensions, padding);
    // this.drawClipped(
    //   painter,
    //   new Dimensions(
    //     this.dimensions.w - padding.left - padding.right,
    //     this.dimensions.h - padding.top - padding.bottom
    //   ),
    //   padding
    // );
    // restoreClip();

    this.build().draw(painter);
  }

  protected getAlignment(innerWidth: number): {
    x: number;
    textAlign: CanvasTextAlign;
  } {
    const alignment = this.style?.text?.alignment ?? DEFAULT_TEXT_ALIGN;
    const { left: leftPadding, right: rightPadding } = getPadding(
      this.style?.padding
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
