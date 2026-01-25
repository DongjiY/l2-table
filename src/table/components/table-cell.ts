import { filter, Observable, Subscription } from "rxjs";
import { TableCellStyles } from "../../types/table-cell-types";
import {
  TableColumnDef,
  TableRow,
  TableSourceData,
} from "../../types/table-config";
import { Dimensions } from "../../utils/dimensions";
import { Point } from "../../utils/point";
import { WorldObject } from "../../utils/world-object";
import { TableData } from "../../utils/table-data";
import { BoundingBox } from "../../utils/bounding-box";
import { Closeable } from "../../utils/closeable";

export class TableCell<TDataRow extends TableRow>
  extends WorldObject
  implements Closeable
{
  private data: TableData<unknown>;
  private dimensions: Dimensions;
  private sourceSubscription: Subscription;
  private columnWidthSubscription: Subscription;
  private isVisible: boolean = false;

  constructor(
    public readonly rowId: string,
    public readonly columnId: string,
    point: Point,
    private readonly style: TableCellStyles,
    private readonly columnConfig: Omit<
      TableColumnDef<TDataRow>,
      "cellData" | "placeholderAccessorFn"
    >,
    cellDataFactory: () => TableData<unknown>,
    height: number,
    private readonly dataSource$: Observable<TableSourceData>,
    requestRedraw: VoidFunction,
    columnWidth$: Observable<number | undefined>,
  ) {
    super(point);
    this.dimensions = new Dimensions(this.columnConfig.maxWidth, height); // TODO - maxW should change to be dynamically computed
    this.data = cellDataFactory();
    this.sourceSubscription = this.dataSource$.subscribe((v) => {
      this.data.setValue(v);
      if (this.isVisible) requestRedraw();
    });
    this.columnWidthSubscription = columnWidth$
      .pipe(filter((v) => v !== undefined))
      .subscribe((w) => (this.dimensions.w = w));
  }

  public setIsVisible(isVisible: boolean): void {
    this.isVisible = isVisible;
  }

  public close(): void {
    this.sourceSubscription.unsubscribe();
    this.columnWidthSubscription.unsubscribe();
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

    ctx.fillText(this.data.getDisplayableContent(), x, y);

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
