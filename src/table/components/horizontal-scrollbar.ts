import { BoundingBox } from "../../utils/bounding-box";
import { Camera } from "../../utils/camera";
import { Dimensions } from "../../utils/dimensions";
import { DrawCanvas } from "../../utils/draw-canvas";
import { Mouse } from "../../utils/mouse";
import { Point } from "../../utils/point";
import { WorldObject } from "../../utils/world-object";

export const HORIZONTAL_SCROLLBAR_HEIGHT = 6;

export class HorizontalScrollbar extends DrawCanvas {
  private thumb: HorizontalThumb;

  constructor(
    private readonly camera: Camera,
    private readonly mouse: Mouse,
    private readonly rootDimensions: Dimensions,
    dimensions: Dimensions,
  ) {
    super(dimensions);

    this.thumb = new HorizontalThumb(
      this.camera.viewportWidth,
      this.camera.worldWidth,
      this.w,
      this.h,
    );

    this.camera.onCameraFocusChange(({ viewportWidth, worldWidth, x }) => {
      this.thumb.updateX(viewportWidth, worldWidth, x, this.w);
      this.requestRedraw();
    });
    this.camera.onCameraResize(({ viewportWidth, worldWidth, x }) => {
      this.thumb.updateW(viewportWidth, worldWidth, this.w);
      this.thumb.updateX(viewportWidth, worldWidth, x, this.w);
      this.requestRedraw();
    });

    this.mouse.onMouseMove(
      this.mouseMove,
      new Point(0, -1 * (this.rootDimensions.h - HORIZONTAL_SCROLLBAR_HEIGHT)),
    );

    this.requestRedraw();
  }

  mouseMove = (point: Point) => {
    if (
      this.thumb.setIsHovered(this.thumb.getBoundingBox().intersects(point))
    ) {
      this.requestRedraw();
    }
  };

  public resize(w: number, h: number, dpr?: number): void {
    this.mouse.removeMouseMoveListener(this.mouseMove);
    super.resize(w, h, dpr);
    this.mouse.onMouseMove(
      this.mouseMove,
      new Point(0, -1 * (this.rootDimensions.h - HORIZONTAL_SCROLLBAR_HEIGHT)),
    );
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, this.w, this.h);
    this.thumb.draw(ctx);
  }
}

class HorizontalThumb extends WorldObject {
  private dimensions: Dimensions;
  private boundingBox: BoundingBox;
  private isHovered: boolean = false;

  constructor(
    viewportWidth: number,
    worldWidth: number,
    parentWidth: number,
    parentHeight: number,
  ) {
    super();
    this.dimensions = new Dimensions(
      this.computeWidth(viewportWidth, worldWidth, parentWidth),
      parentHeight,
    );
    this.boundingBox = new BoundingBox(this.point, this.dimensions);
  }

  private computeWidth(
    viewportWidth: number,
    worldWidth: number,
    parentWidth: number,
  ): number {
    const ratio = viewportWidth / worldWidth;
    return Math.max(parentWidth * ratio, 20);
  }

  public updateW(
    viewportWidth: number,
    worldWidth: number,
    parentWidth: number,
  ): void {
    this.dimensions.w = this.computeWidth(
      viewportWidth,
      worldWidth,
      parentWidth,
    );
  }

  public updateX(
    viewportWidth: number,
    worldWidth: number,
    camX: number,
    parentWidth: number,
  ): void {
    this.point.x =
      (camX / (worldWidth - viewportWidth)) * (parentWidth - this.dimensions.w);
  }

  /**
   * Set a new isHovered state for the thumb
   * @param isHovered The new hovered state
   * @returns True if the value changed, and False if no change
   */
  public setIsHovered(isHovered: boolean): boolean {
    const prevIsHovered = this.isHovered;
    this.isHovered = isHovered;
    return this.isHovered !== prevIsHovered;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.isHovered ? "#6b7280" : "#9ca3af";
    ctx.fillRect(this.point.x, 0, this.dimensions.w, this.dimensions.h);
  }

  public getBoundingBox(): BoundingBox {
    return this.boundingBox;
  }
}
