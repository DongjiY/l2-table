import { Observable } from "rxjs";
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

export class TableCell<TDataRow extends TableRow> extends WorldObject {
  private data: TableData<unknown>;
  private dimensions: Dimensions;

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
  ) {
    super(point);
    this.dimensions = new Dimensions(this.columnConfig.maxWidth, height); // TODO - maxW should change to be dynamically computed
    this.data = cellDataFactory();
    this.dataSource$.subscribe((v) => {
      this.data.setValue(v);
      requestRedraw();
    });
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
