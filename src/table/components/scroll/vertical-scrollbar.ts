import { BoundingBox } from "../../../utils/bounding-box";
import { Camera } from "../../../utils/camera";
import { Dimensions } from "../../../utils/dimensions";
import { DrawCanvas } from "../../../utils/draw-canvas";
import { WorldObject } from "../../../utils/world-object";

export const VERTICAL_SCROLLBAR_WIDTH = 6;

export class VerticalScrollbar extends DrawCanvas {
  private thumb: VerticalThumb;

  constructor(
    private readonly camera: Camera,
    dimensions: Dimensions,
  ) {
    super(dimensions);

    this.thumb = new VerticalThumb(this.camera, dimensions);

    this.camera.onCameraFocusChange(() => this.requestRedraw());
    this.camera.onCameraResize(() => this.requestRedraw());

    this.requestRedraw();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#ccc";
    ctx.fillRect(0, 0, this.w, this.h);
    this.thumb.draw(ctx);
  }
}

class VerticalThumb extends WorldObject {
  private dimensions: Dimensions;

  constructor(
    private readonly camera: Camera,
    private readonly parentDimensions: Dimensions,
  ) {
    super();
    const { viewportHeight, worldHeight } = this.camera;
    const ratio = viewportHeight / worldHeight;
    this.dimensions = new Dimensions(
      parentDimensions.w,
      Math.max(parentDimensions.h * ratio, 20),
    );
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const { y: camY, viewportHeight, worldHeight } = this.camera;

    const scrollableWorld = worldHeight - viewportHeight;
    const thumbTop =
      scrollableWorld > 0
        ? (camY / scrollableWorld) *
          (this.parentDimensions.h - this.dimensions.h)
        : 0;

    ctx.fillStyle = "gray";
    ctx.fillRect(0, thumbTop, this.dimensions.w, this.dimensions.h);
  }

  public getBoundingBox(): BoundingBox {
    throw new Error("Method not implemented.");
  }
}
