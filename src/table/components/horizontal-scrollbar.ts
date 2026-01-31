import { BoundingBox } from "../../utils/bounding-box";
import { Camera } from "../../utils/camera";
import { Dimensions } from "../../utils/dimensions";
import { DrawCanvas } from "../../utils/draw-canvas";
import { WorldObject } from "../../utils/world-object";

export const HORIZONTAL_SCROLLBAR_HEIGHT = 6;

export class HorizontalScrollbar extends DrawCanvas {
  private thumb: HorizontalThumb;

  constructor(
    private readonly camera: Camera,
    dimensions: Dimensions,
  ) {
    super(dimensions);

    this.thumb = new HorizontalThumb(this.camera, dimensions);

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

class HorizontalThumb extends WorldObject {
  private dimensions: Dimensions;

  constructor(
    private readonly camera: Camera,
    private readonly parentDimensions: Dimensions,
  ) {
    super();
    const { viewportWidth, worldWidth } = this.camera;
    const ratio = viewportWidth / worldWidth;
    this.dimensions = new Dimensions(
      Math.max(this.parentDimensions.w * ratio, 20),
      parentDimensions.h,
    );
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const { viewportWidth, worldWidth, x: camX } = this.camera;

    const scrollLeft =
      (camX / (worldWidth - viewportWidth)) *
      (this.parentDimensions.w - this.dimensions.w);

    ctx.fillStyle = "gray";
    ctx.fillRect(scrollLeft, 0, this.dimensions.w, this.dimensions.h);
  }

  public getBoundingBox(): BoundingBox {
    throw new Error("Method not implemented.");
  }
}
