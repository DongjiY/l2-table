export class Point {
  constructor(
    public x: number = 0,
    public y: number = 0,
  ) {}

  public static at(x: number, y: number): Point {
    return new Point(x, y);
  }

  public equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public add(other: Point): Point {
    return new Point(this.x + other.x, this.y + other.y);
  }

  public copy(other: Point): void {
    this.x = other.x;
    this.y = other.y;
  }

  public static clone(other: Point): Point {
    return new Point(other.x, other.y);
  }

  public static snapToDevicePixel(value: number): number {
    return (
      Math.round(value * window.devicePixelRatio) / window.devicePixelRatio
    );
  }
}
