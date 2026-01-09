import { filter, Observable, take, tap } from "rxjs";
import { Drawable } from "../drawable";
import { SourceData } from "../table-config";

export type TableCellConfig = {
  textAlignment: "middle" | "left" | "right";
  minW: number;
  maxW: number;
  pX: number;
  pY: number;
  height: number;
};

export class TableCell<TCellData> implements Drawable {
  private content: TCellData | undefined;
  private rowId: string;
  private columnId: string;
  private canvasCtx: CanvasRenderingContext2D;
  public readonly config: TableCellConfig;
  private worldX: number;
  private worldY: number;
  private redraw: () => void;

  constructor(
    rowId: string,
    columnId: string,
    canvasCtx: CanvasRenderingContext2D,
    config: TableCellConfig,
    x: number,
    y: number,
    redraw: () => void
  ) {
    this.rowId = rowId;
    this.columnId = columnId;
    this.canvasCtx = canvasCtx;
    this.config = config;
    this.worldX = x;
    this.worldY = y;
    this.redraw = redraw;
  }

  public listen(source: Observable<SourceData<TCellData>>): void {
    const sub = source
      .pipe(
        filter((e) => e.columnId === this.columnId && e.rowId === this.rowId)
      )
      .subscribe((e) => {
        this.content = e.content;
        this.redraw();
      });
  }

  public draw(): void {
    if (!this.canvasCtx) return;

    const ctx = this.canvasCtx;
    const cellWidth = this.config.maxW;
    const cellHeight = this.config.height;

    if (!this.content) return;

    ctx.clearRect(this.worldX, this.worldY, cellWidth, cellHeight);

    ctx.fillStyle = "black";
    ctx.textBaseline = "middle";

    let x: number;
    switch (this.config.textAlignment) {
      case "left":
        ctx.textAlign = "left";
        x = this.worldX + this.config.pX;
        break;
      case "right":
        ctx.textAlign = "right";
        x = this.worldX + cellWidth - this.config.pX;
        break;
      case "middle":
      default:
        ctx.textAlign = "center";
        x = this.worldX + cellWidth / 2;
        break;
    }

    const y = this.worldY + this.config.pY + cellHeight / 2;

    ctx.fillText(this.content.toString(), x, y);
  }
}
