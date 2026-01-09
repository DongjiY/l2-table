import { WorldObject } from "./world-object";

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
  private x: number;
  private y: number;
  private viewportWidth: number;
  private viewportHeight: number;
  private worldWidth: number;
  private worldHeight: number;

  constructor({
    x = 0,
    y = 0,
    viewportWidth = 0,
    viewportHeight = 0,
    worldWidth = Infinity,
    worldHeight = Infinity,
  }: CameraOptions = {}) {
    this.x = x;
    this.y = y;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
  }

  private clampX(x: number): number {
    return Math.max(0, Math.min(x, this.worldWidth - this.viewportWidth));
  }

  private clampY(y: number): number {
    return Math.max(0, Math.min(y, this.worldHeight - this.viewportHeight));
  }

  public setX(x: number): void {
    this.x = x;
  }

  public get X(): number {
    return this.x;
  }

  public getX(): number {
    return this.x;
  }

  public setY(y: number): void {
    this.y = y;
  }

  public get Y(): number {
    return this.y;
  }

  public getY(): number {
    return this.y;
  }

  public getViewportWidth(): number {
    return this.viewportWidth;
  }

  public getViewportHeight(): number {
    return this.viewportHeight;
  }

  public updateCamera(coords: { dx?: number; dy?: number }): void {
    const dx = coords.dx ?? 0;
    const dy = coords.dy ?? 0;

    const prevX = this.x;
    const prevY = this.y;

    this.x = this.clampX(this.x + dx);
    this.y = this.clampY(this.y + dy);

    const actualDx = this.x - prevX;
    const actualDy = this.y - prevY;

    if (actualDx === 0 && actualDy === 0) return;

    this.cameraChangeCallbacks.forEach((callbackFn) => {
      callbackFn({
        x: this.x,
        y: this.y,
        dx: actualDx,
        dy: actualDy,
      });
    });
  }

  public onCameraChange(callbackFn: CameraChangeCallback): void {
    this.cameraChangeCallbacks.add(callbackFn);
  }

  public isVisible(obj: WorldObject, buffer: number = 0): boolean {
    const bbox = obj.getBoundingBox();

    const objLeft = bbox.x;
    const objRight = bbox.x + bbox.width;
    const objTop = bbox.y;
    const objBottom = bbox.y + bbox.height;

    const viewportLeft = this.x - buffer;
    const viewportRight = this.x + this.viewportWidth + buffer;
    const viewportTop = this.y - buffer;
    const viewportBottom = this.y + this.viewportHeight + buffer;

    return !(
      objRight < viewportLeft ||
      objLeft > viewportRight ||
      objBottom < viewportTop ||
      objTop > viewportBottom
    );
  }
}
