import { Observable, ReplaySubject, Subject } from "rxjs";
import { Drawable } from "./drawable";

export type DrawCanvasDimensions = {
  w: number;
  h: number;
};

export abstract class DrawCanvas implements Drawable {
  protected canvas: HTMLCanvasElement;
  protected canvasCtx: CanvasRenderingContext2D;
  private readonly invalidate$: ReplaySubject<void>;

  constructor(dimensions: DrawCanvasDimensions) {
    this.canvas = document.createElement("canvas");
    this.canvasCtx = this.canvas.getContext("2d")!;
    this.setSize(dimensions.w, dimensions.h);

    this.invalidate$ = new ReplaySubject(1);

    this.draw = this.draw.bind(this);
    this.invalidate = this.invalidate.bind(this);
  }

  public get invalidateStream(): Observable<void> {
    return this.invalidate$.asObservable();
  }

  protected invalidate(): void {
    this.invalidate$.next();
  }

  private setSize(width: number, height: number): void {
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.canvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  public attach(parent: HTMLElement): void {
    parent.appendChild(this.canvas);
  }

  protected abstract drawImpl(): void;

  public draw(): void {
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasCtx.save();

    this.drawImpl();

    this.canvasCtx.restore();
  }
}
