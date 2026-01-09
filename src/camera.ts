export class Camera {
  private cameraChangeCallbacks: Set<(x: number, y: number) => void> =
    new Set();

  constructor(private x: number = 0, private y: number = 0) {}

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

  public updateCamera(coords: { x?: number; y?: number }): void {
    const { x, y } = coords;

    if (typeof x === "number") this.x += x;
    if (typeof y === "number") this.y += y;

    this.cameraChangeCallbacks.forEach((callbackFn) => {
      callbackFn(this.x, this.y);
    });
  }

  public onCameraChange(callbackFn: (x: number, y: number) => void): void {
    this.cameraChangeCallbacks.add(callbackFn);
  }
}
