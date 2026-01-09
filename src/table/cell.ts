import { filter, Observable, Subscription, takeWhile } from "rxjs";
import { SourceData } from "./table-config";
import { WorldObject } from "../canvas/world-object";
import { Camera } from "../canvas/camera";

export type TableCellConfig = {
  textAlignment: "middle" | "left" | "right";
  minW: number;
  maxW: number;
  pX: number;
  pY: number;
  height: number;
  placeholder?: string;
};

const FALLBACK = "--";

export class TableCell<TCellData> extends WorldObject {
  private content: string | undefined;
  public readonly rowId: string;
  public readonly columnId: string;
  private readonly canvasCtx: CanvasRenderingContext2D;
  public readonly config: TableCellConfig;
  private readonly redraw: () => void;

  private subscription: Subscription | undefined;

  constructor(
    rowId: string,
    columnId: string,
    canvasCtx: CanvasRenderingContext2D,
    config: TableCellConfig,
    x: number,
    y: number,
    redraw: () => void
  ) {
    super(x, y);
    this.rowId = rowId;
    this.columnId = columnId;
    this.canvasCtx = canvasCtx;
    this.config = config;
    this.redraw = redraw;
    this.content = config.placeholder ?? FALLBACK;
  }

  public destroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  public listen(
    source: Observable<SourceData<TCellData>>,
    camera: Camera
  ): void {
    camera.onCameraChange(() => {
      this.updateSubscription(source, camera);
    });

    this.updateSubscription(source, camera);
  }

  private updateSubscription(
    source: Observable<SourceData<TCellData>>,
    camera: Camera
  ): void {
    const isVisible = camera.isVisible(this);

    if (isVisible && !this.subscription) {
      this.subscription = source
        .pipe(
          filter((e) => e.columnId === this.columnId && e.rowId === this.rowId),
          takeWhile(() => camera.isVisible(this) ?? false)
        )
        .subscribe((e) => {
          this.content = e.content as string; // TODO -- need to update when e.content can be a different type
          this.redraw();
        });
    } else if (!isVisible && this.subscription) {
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

    ctx.fillText(this.content, x, y);
  }
}
