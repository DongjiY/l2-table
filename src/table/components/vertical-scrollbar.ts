import { BoundingBox } from "../../utils/bounding-box";
import { Camera } from "../../utils/camera";
import { Dimensions } from "../../utils/dimensions";
import { DrawCanvas } from "../../utils/draw-canvas";
import { Mouse } from "../../utils/mouse";
import { Point } from "../../utils/point";
import { WorldObject } from "../../utils/world-object";

export const VERTICAL_SCROLLBAR_WIDTH = 6;

export class VerticalScrollbar extends DrawCanvas {
  private thumb: VerticalThumb;

  constructor(
    private readonly camera: Camera,
    private readonly mouse: Mouse,
    private readonly rootDimensions: Dimensions,
    dimensions: Dimensions,
  ) {
    super(dimensions);

    this.thumb = new VerticalThumb(
      this.camera.viewportHeight,
      this.camera.worldHeight,
      this.h,
      this.w,
    );

    this.camera.onCameraFocusChange(({ viewportHeight, worldHeight, y }) => {
      this.thumb.updateY(viewportHeight, worldHeight, y, this.h);
      this.requestRedraw();
    });
    this.camera.onCameraResize(({ viewportHeight, worldHeight, y }) => {
      this.thumb.updateH(viewportHeight, worldHeight, this.h);
      this.thumb.updateY(viewportHeight, worldHeight, y, this.h);
      this.requestRedraw();
    });
    this.mouse.onMouseMove(
      this.mouseMove,
      new Point(-1 * (this.rootDimensions.w - VERTICAL_SCROLLBAR_WIDTH), 0),
    );
    this.mouse.onMouseLost(() => this.thumb.setIsHovered(false));

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
      new Point(-1 * (this.rootDimensions.w - VERTICAL_SCROLLBAR_WIDTH), 0),
    );
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, this.w, this.h);
    this.thumb.draw(ctx);
  }
}

class VerticalThumb extends WorldObject {
  private dimensions: Dimensions;
  private isHovered: boolean = false;
  private boundingBox: BoundingBox;

  constructor(
    viewportHeight: number,
    worldHeight: number,
    parentHeight: number,
    parentWidth: number,
  ) {
    super();
    this.dimensions = new Dimensions(
      parentWidth,
      this.computeHeight(viewportHeight, worldHeight, parentHeight),
    );
    this.boundingBox = new BoundingBox(this.point, this.dimensions);
  }

  private computeHeight(
    viewportHeight: number,
    worldHeight: number,
    parentHeight: number,
  ): number {
    const ratio = viewportHeight / worldHeight;
    return Math.max(parentHeight * ratio, 20);
  }

  public updateH(
    viewportHeight: number,
    worldHeight: number,
    parentHeight: number,
  ): void {
    this.dimensions.h = this.computeHeight(
      viewportHeight,
      worldHeight,
      parentHeight,
    );
  }

  public updateY(
    viewportHeight: number,
    worldHeight: number,
    camY: number,
    parentHeight: number,
  ): void {
    const scrollableWorld = worldHeight - viewportHeight;
    this.point.y =
      scrollableWorld > 0
        ? (camY / scrollableWorld) * (parentHeight - this.dimensions.h)
        : 0;
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
    ctx.fillRect(0, this.point.y, this.dimensions.w, this.dimensions.h);
  }

  public getBoundingBox(): BoundingBox {
    return this.boundingBox;
  }
}
