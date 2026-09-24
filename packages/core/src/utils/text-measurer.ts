export class TextMeasurer {
  private readonly ctx: CanvasRenderingContext2D;

  constructor(ctx?: CanvasRenderingContext2D) {
    if (ctx) {
      this.ctx = ctx;
      return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context)
      throw new Error("Unable to create a text measurement context");
    this.ctx = context;
  }

  public measure(content: string, font: string): number {
    this.ctx.font = font;
    return Math.ceil(this.ctx.measureText(content).width);
  }
}
