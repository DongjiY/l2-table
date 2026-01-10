import { Camera } from "../canvas/camera";
import { DrawCanvas, DrawCanvasDimensions } from "../canvas/draw-canvas";

export class HorizontalScrollbar extends DrawCanvas {
  private w: number;
  private h: number;

  constructor(
    dimensions: Pick<DrawCanvasDimensions, "w">,
    private readonly camera: Camera
  ) {
    super({
      w: dimensions.w,
      h: 6,
    });

    this.h = 6;
    this.w = dimensions.w;
  }

  protected drawImpl(): void {
    const { ViewportWidth, WorldWidth, X: camX } = this.camera;

    const ratio = ViewportWidth / WorldWidth;
    const scrollWidth = Math.max(this.w * ratio, 20);
    const scrollLeft =
      (camX / (WorldWidth - ViewportWidth)) * (this.w - scrollWidth);

    this.canvasCtx.fillStyle = "#ccc";
    this.canvasCtx.fillRect(0, 0, this.w, this.h);

    this.canvasCtx.fillStyle = "gray";
    this.canvasCtx.fillRect(scrollLeft, 0, scrollWidth, this.h);
  }
}
