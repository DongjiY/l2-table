import { Dimensions } from "./dimensions";

export class Canvas {
  protected canvas: HTMLCanvasElement;

  constructor(private dimensions: Dimensions) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = dimensions.w;
    this.canvas.height = dimensions.h;
    this.applyCanvasSize();
  }

  public get w(): number {
    return this.dimensions.w;
  }

  public get h(): number {
    return this.dimensions.h;
  }

  protected resizeCanvas(w: number, h: number): void {
    this.dimensions.w = w;
    this.dimensions.h = h;
    this.applyCanvasSize();
  }

  private applyCanvasSize(): void {
    this.canvas.style.width = `${this.dimensions.w}px`;
    this.canvas.style.height = `${this.dimensions.h}px`;
  }

  public getElement(): HTMLElement {
    return this.canvas;
  }
}
