import { Observable, ReplaySubject } from "rxjs";
import { Closeable } from "../utils/closeable";
import { Dimensions } from "../utils/dimensions";
import { Drawable } from "../utils/drawable";

export abstract class WorkerCanvas implements Closeable, Drawable {
  private canvas: OffscreenCanvas;
  private ctx: OffscreenCanvasRenderingContext2D;
  private drawQueue$: ReplaySubject<void>;

  constructor(offscreenCanvas: OffscreenCanvas) {
    this.canvas = offscreenCanvas;
    this.ctx = this.canvas.getContext("2d")!;
    this.drawQueue$ = new ReplaySubject(1);
  }

  protected resize(dimensions: Dimensions, dpr: number = 1): void {
    this.canvas.width = Math.round(dimensions.w * dpr);
    this.canvas.height = Math.round(dimensions.h * dpr);

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.requestRedraw();
  }

  public get drawQueue(): Observable<void> {
    return this.drawQueue$.asObservable();
  }

  public requestRedraw(): void {
    this.drawQueue$.next();
  }

  public abstract draw(ctx: OffscreenCanvasRenderingContext2D): void;

  public _drawImpl(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.draw(this.ctx);
    this.ctx.restore();
  }

  public close(): void {
    this.drawQueue$.complete();
  }
}
