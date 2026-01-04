export class Table {
  private canvas: HTMLCanvasElement;
  private canvasCtx: CanvasRenderingContext2D;
  private dpr = window.devicePixelRatio || 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasCtx = canvas.getContext("2d")!;

    const resizeObserver = new ResizeObserver(() => this.resize());
    resizeObserver.observe(this.canvas);

    this.resize();
  }

  private resize(): void {
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;

    this.canvasCtx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.draw();
  }

  private draw() {
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
