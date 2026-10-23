import { BoundingBox } from "../../utils/bounding-box";
import { Camera } from "../../utils/camera";
import { Dimensions } from "../../utils/dimensions";
import { DrawCanvas } from "../../utils/draw-canvas";
import { Painter } from "../../utils/painter";
import { Point } from "../../utils/point";
import { Pointer } from "../../utils/pointer";
import { WorldObject } from "../../utils/world-object";

export const HORIZONTAL_SCROLLBAR_HEIGHT = 6;

export class HorizontalScrollbar extends DrawCanvas {
  private thumb: HorizontalThumb;
  private isDraggingThumb: boolean = false;
  private readonly pointer: Pointer;

  constructor(private readonly camera: Camera, dimensions: Dimensions) {
    super(dimensions);

    this.thumb = new HorizontalThumb(
      this.camera.viewportWidth,
      this.camera.worldWidth,
      this.w,
      this.h
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

    this.pointer = new Pointer(this.getElement());
    this.pointer.onPointerDown(this.handlePointerDown);
    this.pointer.onPointerMove(this.handlePointerMove);
    this.pointer.onPointerLeave(this.handlePointerLeave);
    this.pointer.onDrag(this.handleDrag);
    this.pointer.onPointerUp(this.handlePointerUp);

    this.requestRedraw();
  }

  private handlePointerDown = (point: Point): void => {
    this.isDraggingThumb = this.thumb.getBoundingBox().intersects(point);
    this.thumb.setIsActive(this.isDraggingThumb);
  };

  private handlePointerUp = (): void => {
    this.isDraggingThumb = false;
    this.thumb.setIsActive(false);
  };

  private handlePointerMove = (point: Point): void => {
    if (
      this.thumb.setIsHovered(this.thumb.getBoundingBox().intersects(point))
    ) {
      this.requestRedraw();
    }
  };

  private handlePointerLeave = (): void => {
    if (this.thumb.setIsHovered(false)) this.requestRedraw();
  };

  private handleDrag = (delta: Point): void => {
    if (!this.isDraggingThumb) return;

    const contentRange = this.camera.worldWidth - this.camera.viewportWidth;
    const thumbRange = this.w - this.thumb.w;
    const contentDelta = (delta.x / thumbRange) * contentRange;
    this.camera.updateFocus({ dx: contentDelta });
  };

  public close(): void {
    this.pointer.close();
    super.close();
  }

  public draw(painter: Painter): void {
    painter.drawRect(Point.at(0, 0), Dimensions.of(this.w, this.h), "#fff");
    this.thumb.draw(painter);
  }
}

class HorizontalThumb extends WorldObject {
  private dimensions: Dimensions;
  private boundingBox: BoundingBox;

  constructor(
    viewportWidth: number,
    worldWidth: number,
    parentWidth: number,
    parentHeight: number
  ) {
    super();
    this.dimensions = new Dimensions(
      this.computeWidth(viewportWidth, worldWidth, parentWidth),
      parentHeight
    );
    this.boundingBox = new BoundingBox(this.point, this.dimensions);
  }

  public get w(): number {
    return this.dimensions.w;
  }

  private computeWidth(
    viewportWidth: number,
    worldWidth: number,
    parentWidth: number
  ): number {
    const ratio = viewportWidth / worldWidth;
    return Math.max(parentWidth * ratio, 20);
  }

  public updateW(
    viewportWidth: number,
    worldWidth: number,
    parentWidth: number
  ): void {
    this.dimensions.w = this.computeWidth(
      viewportWidth,
      worldWidth,
      parentWidth
    );
  }

  public updateX(
    viewportWidth: number,
    worldWidth: number,
    camX: number,
    parentWidth: number
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
