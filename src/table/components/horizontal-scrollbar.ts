import { BoundingBox } from "../../utils/bounding-box";
import { Camera } from "../../utils/camera";
import { Dimensions } from "../../utils/dimensions";
import { DrawCanvas } from "../../utils/draw-canvas";
import { Mouse } from "../../utils/mouse";
import { Painter } from "../../utils/painter";
import { Point } from "../../utils/point";
import { WorldObject } from "../../utils/world-object";

export const HORIZONTAL_SCROLLBAR_HEIGHT = 6;

export class HorizontalScrollbar extends DrawCanvas {
  private thumb: HorizontalThumb;
  private dragStart: Point | undefined;

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
    this.camera.onWorldResize(({ viewportWidth, worldWidth, x }) => {
      this.thumb.updateW(viewportWidth, worldWidth, this.w);
      this.thumb.updateX(viewportWidth, worldWidth, x, this.w);
      this.requestRedraw();
    });

    this.mouse.onMouseLost(() => this.thumb.setIsHovered(false));
    this.initMouseCallbacks();

    this.requestRedraw();
  }

  private initMouseCallbacks(): void {
    this.mouse.onMouseMove(
      this.mouseMove,
      generateTransposePoint(this.rootDimensions.h),
    );
    this.mouse.onMouseDown(
      this.mouseDown,
      generateTransposePoint(this.rootDimensions.h),
    );
    this.mouse.onMouseUp(this.mouseUp);
  }

  mouseDown = (point: Point): void => {
    if (this.thumb.getBoundingBox().intersects(point)) {
      this.dragStart = Point.clone(point);
      this.thumb.setIsActive(true);
    }
  };

  mouseUp = (): void => {
    this.dragStart = undefined;
    this.thumb.setIsActive(false);
  };

  mouseMove = (point: Point): void => {
    if (this.dragStart) {
      const trackDeltaX = point.x - this.dragStart.x;
      const contentRange = this.camera.worldWidth - this.camera.viewportWidth;
      const thumbRange = this.w - this.thumb.w;
      const contentDelta = (trackDeltaX / thumbRange) * contentRange;
      this.camera.updateFocus({
        dx: contentDelta,
      });
      this.dragStart.x = point.x;
    }
    if (
      this.thumb.setIsHovered(this.thumb.getBoundingBox().intersects(point))
    ) {
      this.requestRedraw();
    }
  };

  public resize(w: number, h: number, dpr?: number): void {
    this.mouse.removeMouseMoveListener(this.mouseMove);
    this.mouse.removeMouseDownListener(this.mouseDown);
    this.mouse.removeMouseUpListener(this.mouseDown);
    super.resize(w, h, dpr);
    this.initMouseCallbacks();
  }

  public draw(painter: Painter): void {
    painter.drawRect(Point.at(0, 0), Dimensions.of(this.w, this.h), "#fff");
    this.thumb.draw(painter);
  }
}

function generateTransposePoint(rootHeight: number): Point {
  return new Point(0, -1 * (rootHeight - HORIZONTAL_SCROLLBAR_HEIGHT));
}

class HorizontalThumb extends WorldObject {
  private dimensions: Dimensions;
  private boundingBox: BoundingBox;

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

  public get w(): number {
    return this.dimensions.w;
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
    const prevIsHovered = this.state.isHovered;
    this.state.isHovered = isHovered;
    return this.state.isHovered !== prevIsHovered;
  }

  public setIsActive(isActive: boolean): void {
    this.state.isActive = isActive;
  }

  public draw(painter: Painter): void {
    const color =
      this.state.isHovered || this.state.isActive ? "#6b7280" : "#9ca3af";
    painter.drawRect(Point.at(this.point.x, 0), this.dimensions, color);
  }

  public getBoundingBox(): BoundingBox {
    return this.boundingBox;
  }
}
