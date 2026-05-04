import { Observable, ReplaySubject } from "rxjs";
import { Closeable } from "./closeable";
import { Drawable } from "./drawable";
import { Canvas } from "./canvas";
import { Dimensions } from "./dimensions";
import { Painter } from "./painter";

export abstract class DrawCanvas extends Canvas implements Closeable, Drawable {
  private readonly painter: Painter;
  private drawQueue$: ReplaySubject<void>;

  constructor(dimensions: Dimensions) {
    super(dimensions);

    this.painter = new Painter(this.canvas.getContext("2d")!);
    this.drawQueue$ = new ReplaySubject(1);
  }

  public resize(w: number, h: number, dpr: number = 1): void {
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.resizeCanvas(w, h);

    this.painter
      .dangerouslyGetRenderingContext()
      .setTransform(dpr, 0, 0, dpr, 0, 0);
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
    this.painter
      .dangerouslyGetRenderingContext()
      .clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.painter.dangerouslyGetRenderingContext().save();
    this.draw(this.painter);
    this.painter.dangerouslyGetRenderingContext().restore();
  }

  public close(): void {
    this.drawQueue$.complete();
  }
}
