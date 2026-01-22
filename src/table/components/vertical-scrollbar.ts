import { Camera } from "../../utils/camera";
import { Dimensions } from "../../utils/dimensions";
import { DrawCanvas } from "../../utils/draw-canvas";

export const VERTICAL_SCROLLBAR_WIDTH = 6;

export class VerticalScrollbar extends DrawCanvas {
  constructor(
    private readonly camera: Camera,
    dimensions: Dimensions,
  ) {
    super(dimensions);

    this.camera.onCameraChange(() => {
      this.requestRedraw();
    });

    this.requestRedraw();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const { y: camY, viewportHeight, worldHeight } = this.camera;

    const ratio = viewportHeight / worldHeight;
    const thumbHeight = Math.max(this.h * ratio, 20);

    const scrollableWorld = worldHeight - viewportHeight;
    const thumbTop =
      scrollableWorld > 0
        ? (camY / scrollableWorld) * (this.h - thumbHeight)
        : 0;

    ctx.fillStyle = "#ccc";
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.fillStyle = "gray";
    ctx.fillRect(0, thumbTop, this.w, thumbHeight);
  }
}
