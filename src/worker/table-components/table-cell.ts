import { Point } from "../../utils/point";
import { WorldObject } from "../../utils/world-object";
import { TableData } from "./table-data";

export class TableCell extends WorldObject {
  private data: TableData<unknown>;

  constructor(
    public readonly rowId: string,
    public readonly columnId: string,
    point: Point,
    dataFactory: () => TableData<unknown>,
  ) {
    super(point);
    this.data = dataFactory();
    console.log("dongji", this.data.getValue());
  }

  public draw(ctx: OffscreenCanvasRenderingContext2D): void {
    ctx.fillStyle = "red";
    ctx.fillRect(this.point.x, this.point.y, 100, 50);
  }
}
