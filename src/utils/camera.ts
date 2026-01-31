import { BoundingBox } from "./bounding-box";
import { Dimensions } from "./dimensions";
import { Point } from "./point";

type CameraChangeCallback = (c: Camera) => void;

type CameraResizeCallback = (c: Camera) => void;

type CameraOptions = {
  x?: number;
  y?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  worldWidth?: number;
  worldHeight?: number;
};

export class Camera {
  private cameraFocusChangeCallbacks: Set<CameraChangeCallback> = new Set();
  private cameraResizeCallbacks: Set<CameraResizeCallback> = new Set();
  private focus: Point;
  private viewportDimensions: Dimensions;
  private worldDimensions: Dimensions;

  constructor({
    x = 0,
    y = 0,
    viewportWidth = 0,
    viewportHeight = 0,
    worldWidth = Infinity,
    worldHeight = Infinity,
  }: CameraOptions = {}) {
    this.focus = new Point(x, y);
    this.viewportDimensions = new Dimensions(viewportWidth, viewportHeight);
    this.worldDimensions = new Dimensions(worldWidth, worldHeight);
  }

  private clampX(x: number): number {
    return Math.max(
      0,
      Math.min(x, this.worldDimensions.w - this.viewportDimensions.w),
    );
  }

  private clampY(y: number): number {
    return Math.max(
      0,
      Math.min(y, this.worldDimensions.h - this.viewportDimensions.h),
    );
  }

  public get x(): number {
    return this.focus.x;
  }

  public get y(): number {
    return this.focus.y;
  }

  public get viewportWidth(): number {
    return this.viewportDimensions.w;
  }

  public get viewportHeight(): number {
    return this.viewportDimensions.h;
  }

  public get worldWidth(): number {
    return this.worldDimensions.w;
  }

  public get worldHeight(): number {
    return this.worldDimensions.h;
  }

  public get boundingBox(): BoundingBox {
    return new BoundingBox(this.focus, this.viewportDimensions);
  }

  public updateWorldDimensions({ w, h }: { w?: number; h?: number }): void {
    if (w !== undefined) this.worldDimensions.w = w;
    if (h !== undefined) this.worldDimensions.h = h;
  }

  public updateViewportDimensions({ w, h }: { w?: number; h?: number }): void {
    if (w !== undefined) this.viewportDimensions.w = w;
    if (h !== undefined) this.viewportDimensions.h = h;
    this.focus.x = this.clampX(this.focus.x);
    this.focus.y = this.clampY(this.focus.y);
    this.cameraResizeCallbacks.forEach((cb) => {
      cb(this);
    });
  }

  public updateFocus({ dx = 0, dy = 0 }: { dx?: number; dy?: number }): void {
    this.focus.x = this.clampX(this.focus.x + dx);
    this.focus.y = this.clampY(this.focus.y + dy);
    this.cameraFocusChangeCallbacks.forEach((cb) => {
      cb(this);
    });
  }

  public onCameraResize(fn: CameraResizeCallback): void {
    this.cameraResizeCallbacks.add(fn);
  }

  public onCameraFocusChange(fn: CameraChangeCallback): void {
    this.cameraFocusChangeCallbacks.add(fn);
  }
}
