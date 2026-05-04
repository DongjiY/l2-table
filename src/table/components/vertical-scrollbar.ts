import { BoundingBox } from "../../utils/bounding-box";
import { Camera } from "../../utils/camera";
import { Dimensions } from "../../utils/dimensions";
import { DrawCanvas } from "../../utils/draw-canvas";
import { Mouse } from "../../utils/mouse";
import { Painter } from "../../utils/painter";
import { Point } from "../../utils/point";
import { WorldObject } from "../../utils/world-object";

export const VERTICAL_SCROLLBAR_WIDTH = 6;

export class VerticalScrollbar extends DrawCanvas {
  private thumb: VerticalThumb;
  private dragStart: Point | undefined;

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

    this.mouse.onMouseLost(() => this.thumb.setIsHovered(false));
    this.initMouseCallbacks();

    this.requestRedraw();
  }

  private initMouseCallbacks(): void {
    this.mouse.onMouseMove(
      this.mouseMove,
      generateTransposePoint(this.rootDimensions.w),
    );
    this.mouse.onMouseDown(
      this.mouseDown,
      generateTransposePoint(this.rootDimensions.w),
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
      const trackDeltaY = point.y - this.dragStart.y;
      const contentRange = this.camera.worldHeight - this.camera.viewportHeight;
      const thumbRange = this.h - this.thumb.h;
      const contentDelta = (trackDeltaY / thumbRange) * contentRange;
      this.camera.updateFocus({
        dy: contentDelta,
      });
      this.dragStart.y = point.y;
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
    this.mouse.removeMouseUpListener(this.mouseUp);
    super.resize(w, h, dpr);
    this.initMouseCallbacks();
  }

  public draw(painter: Painter): void {
    painter.drawRect(Point.at(0, 0), Dimensions.of(this.w, this.h), "#fff");
    this.thumb.draw(painter);
  }
}

function generateTransposePoint(rootWidth: number): Point {
  return new Point(-1 * (rootWidth - VERTICAL_SCROLLBAR_WIDTH), 0);
}

class VerticalThumb extends WorldObject {
  private dimensions: Dimensions;
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

  public get h(): number {
    return this.dimensions.h;
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
    painter.drawRect(Point.at(0, this.point.y), this.dimensions, color);
  }

  public getBoundingBox(): BoundingBox {
    return this.boundingBox;
  }
}
