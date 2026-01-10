import { filter, Observable, Subscription, takeWhile } from "rxjs";
import { RowData, SourceData } from "./table-config";
import { WorldObject } from "../canvas/world-object";
import { Camera } from "../canvas/camera";
import { TableData } from "./table-data";

export type TableCellConfig = {
  textAlignment: "middle" | "left" | "right";
  minW: number;
  maxW: number;
  pX: number;
  pY: number;
  height: number;
  placeholder?: string;
};

export class TableCell<TRow extends RowData, TCellData> extends WorldObject {
  private content: TableData<TCellData>;
  public readonly rowId: string;
  public readonly columnId: keyof TRow;
  private readonly canvasCtx: CanvasRenderingContext2D;
  public readonly config: TableCellConfig;
  private readonly invalidate: () => void;
  private isBuffered: boolean = false;
  private source: Observable<SourceData<TRow>>;
  private camera: Camera;

  private subscription: Subscription | undefined;

  constructor(
    rowId: string,
    columnId: string,
    canvasCtx: CanvasRenderingContext2D,
    config: TableCellConfig,
    x: number,
    y: number,
    invalidate: () => void,
    tableDataFactory: () => TableData<TCellData>,
    source: Observable<SourceData<TRow>>,
    camera: Camera
  ) {
    super(x, y);
    this.rowId = rowId;
    this.columnId = columnId;
    this.canvasCtx = canvasCtx;
    this.config = config;
    this.invalidate = invalidate;
    this.content = tableDataFactory();
    this.source = source;
    this.camera = camera;
  }

  public destroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  public setIsBuffered(isBuffered: boolean): void {
    this.isBuffered = isBuffered;
    this.updateSubscription();
  }

  private updateSubscription(): void {
    if (this.isBuffered && !this.subscription) {
      this.subscription = this.source
        .pipe(
          filter((e) => e.columnId === this.columnId && e.rowId === this.rowId),
          takeWhile(() => this.isBuffered)
        )
        .subscribe((e) => {
          this.content.setValue(e.content);
          if (this.camera.isVisible(this)) this.invalidate();
        });
    } else if (!this.isBuffered && this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  public getBoundingBox(): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    return {
      x: this.X,
      y: this.Y,
      width: this.config.maxW,
      height: this.config.height,
    };
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

    ctx.fillText(this.content.getDisplayableContent(), x, y);
  }
}
