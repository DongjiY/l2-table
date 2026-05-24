import { Observable, ReplaySubject } from "rxjs";
import { Closeable } from "./closeable";
import { Drawable } from "./drawable";
import { Canvas } from "./canvas";
import { Dimensions } from "./dimensions";
import { Painter } from "./painter";
import { Layouter } from "./layouter";
import { ContentWidthCache } from "./content-width-cache";
import { TableWorker } from "../table/table-worker";

export abstract class DrawCanvas extends Canvas implements Closeable, Drawable {
  private readonly painter: Painter;
  private drawQueue$: ReplaySubject<void>;
  protected readonly layouter: Layouter;

  constructor(
    dimensions: Dimensions,
    private readonly contentCache: ContentWidthCache,
    protected readonly tableWorker: TableWorker
  ) {
    super(dimensions);

    this.layouter = new Layouter();
    this.painter = new Painter(
      this.canvas.getContext("2d")!,
      this.layouter,
      this.contentCache,
      this.tableWorker
    );
    this.drawQueue$ = new ReplaySubject(1);
  }

  public resize(w: number, h: number, dpr: number = 1): void {
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.resizeCanvas(w, h);

    this.painter.dangerouslyDrawWithCanvasCtx((ctx) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    this.requestRedraw();
  }

  public get drawQueue(): Observable<void> {
    return this.drawQueue$.asObservable();
  }

  public requestRedraw(): void {
    this.drawQueue$.next();
  }

  public abstract draw(painter: Painter): void;

  public _drawImpl(): void {
    this.painter.dangerouslyDrawWithCanvasCtx((ctx) => {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.save();
      this.draw(this.painter);
      ctx.restore();
    });
  }

  public close(): void {
    this.drawQueue$.complete();
  }
}
