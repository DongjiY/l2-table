import { Dimensions } from "../utils/dimensions";
import { Point } from "../utils/point";

type CameraChangeCallback = ({
  dx,
  dy,
  x,
  y,
}: {
  dx: number;
  dy: number;
  x: number;
  y: number;
}) => void;

type CameraOptions = {
  x?: number;
  y?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  worldWidth?: number;
  worldHeight?: number;
};

export class Camera {
  private cameraChangeCallbacks: Set<CameraChangeCallback> = new Set();
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

  public updateWorldDimensions({ w, h }: { w?: number; h?: number }): void {
    if (w) this.worldDimensions.w = w;
    if (h) this.worldDimensions.h = h;
  }

  public updateViewportDimensions({ w, h }: { w?: number; h?: number }): void {
    if (w) this.viewportDimensions.w = w;
    if (h) this.viewportDimensions.h = h;
  }

  public updateFocus({ dx = 0, dy = 0 }: { dx?: number; dy?: number }): void {
    this.focus.x = this.clampX(this.focus.x + dx);
    this.focus.y = this.clampY(this.focus.y + dy);
    this.cameraChangeCallbacks.forEach((cb) => {
      cb({
        x: this.x,
        y: this.y,
        dx,
        dy,
      });
    });
  }

  public onCameraChange(fn: CameraChangeCallback): void {
    this.cameraChangeCallbacks.add(fn);
  }
}
