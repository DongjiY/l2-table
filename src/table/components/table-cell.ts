import { TableCellStyles } from "../../types/table-cell-types";
import { Dimensions } from "../../utils/dimensions";
import { WorldObject } from "../../utils/world-object";
import { TableData } from "../../utils/table-data";
import { BoundingBox } from "../../utils/bounding-box";

export class TableCell extends WorldObject {
  private data: TableData<unknown> | null = null;
  private dimensions: Dimensions = new Dimensions();

  constructor(private readonly style: TableCellStyles) {
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
    return new BoundingBox(this.point, this.dimensions);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.font = this.style.text.font;
    ctx.fillStyle = this.style.text.color;
    ctx.textBaseline = "middle";

    ctx.beginPath();
    const innerWidth =
      this.dimensions.w - this.style.padding.left - this.style.padding.right;
    const innerHeight =
      this.dimensions.h - this.style.padding.top - this.style.padding.bottom;
    ctx.rect(
      this.point.x + this.style.padding.left,
      this.point.y + this.style.padding.top,
      innerWidth,
      innerHeight,
    );
    ctx.clip();

    const { x, textAlign } = this.getAlignment(innerWidth);

    ctx.textAlign = textAlign;

    const y = this.point.y + this.style.padding.top + innerHeight / 2;

    ctx.fillText(this.data?.getDisplayableContent() ?? "NA", x, y);

    ctx.restore();
  }

  private getAlignment(innerWidth: number): {
    x: number;
    textAlign: CanvasTextAlign;
  } {
    switch (this.style.text.alignment) {
      case "middle":
        return {
          x: this.point.x + this.style.padding.left + innerWidth / 2,
          textAlign: "center",
        };
      case "right":
        return {
          x: this.point.x + this.dimensions.w - this.style.padding.right,
          textAlign: "right",
        };
      case "left":
      default:
        return {
          x: this.point.x + this.style.padding.left,
          textAlign: "left",
        };
    }
  }
}
