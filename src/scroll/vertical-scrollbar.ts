import { Camera } from "../canvas/camera";
import { DrawCanvas, DrawCanvasDimensions } from "../canvas/draw-canvas";

export class VerticalScrollbar extends DrawCanvas {
  private w: number;
  private h: number;

  constructor(
    dimensions: Pick<DrawCanvasDimensions, "h">,
    private readonly camera: Camera
  ) {
    super({
      w: 6,
      h: dimensions.h,
    });

    this.w = 6;
    this.h = dimensions.h;
  }

  protected drawImpl(): void {
    const { Y: camY, ViewportHeight, WorldHeight } = this.camera;

    const ratio = ViewportHeight / WorldHeight;
    const thumbHeight = Math.max(this.h * ratio, 20);

    const scrollableWorld = WorldHeight - ViewportHeight;
    const thumbTop =
      scrollableWorld > 0
        ? (camY / scrollableWorld) * (this.h - thumbHeight)
        : 0;

    this.canvasCtx.fillStyle = "#ccc";
    this.canvasCtx.fillRect(0, 0, this.w, this.h);

    this.canvasCtx.fillStyle = "gray";
    this.canvasCtx.fillRect(0, thumbTop, this.w, thumbHeight);
  }
}
