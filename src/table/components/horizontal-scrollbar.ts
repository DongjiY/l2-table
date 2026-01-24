import { Camera } from "../../utils/camera";
import { Dimensions } from "../../utils/dimensions";
import { DrawCanvas } from "../../utils/draw-canvas";

export const HORIZONTAL_SCROLLBAR_HEIGHT = 6;

export class HorizontalScrollbar extends DrawCanvas {
  constructor(
    private readonly camera: Camera,
    dimensions: Dimensions,
  ) {
    super(dimensions);

    this.camera.onCameraFocusChange(() => this.requestRedraw());
    this.camera.onCameraResize(() => this.requestRedraw());

    this.requestRedraw();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const { viewportWidth, worldWidth, x: camX } = this.camera;

    const ratio = viewportWidth / worldWidth;
    const scrollWidth = Math.max(this.w * ratio, 20);
    const scrollLeft =
      (camX / (worldWidth - viewportWidth)) * (this.w - scrollWidth);

    ctx.fillStyle = "#ccc";
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.fillStyle = "gray";
    ctx.fillRect(scrollLeft, 0, scrollWidth, this.h);
  }
}
