import { filter, Observable, Subscription } from "rxjs";
import { TableCellFontStyling } from "../../types/table-cell-types";
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
    private readonly textStyle: TableCellFontStyling,
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

    ctx.font = this.textStyle.font;
    ctx.fillStyle = this.textStyle.color;
    ctx.textBaseline = "middle";

    ctx.beginPath();
    ctx.rect(this.point.x, this.point.y, this.dimensions.w, this.dimensions.h);
    ctx.clip();

    let canvasAlign: CanvasTextAlign = "left";
    let x = this.point.x;

    switch (this.textStyle.alignment) {
      case "left":
        canvasAlign = "left";
        x = this.point.x;
        break;
      case "middle":
        canvasAlign = "center";
        x = this.point.x + this.dimensions.w / 2;
        break;
      case "right":
        canvasAlign = "right";
        x = this.point.x + this.dimensions.w;
        break;
    }

    ctx.textAlign = canvasAlign;

    const y = this.point.y + this.dimensions.h / 2;

    ctx.fillText(this.data.getDisplayableContent(), x, y);

    ctx.restore();
  }
}
