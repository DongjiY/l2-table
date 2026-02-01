export class Point {
  constructor(
    public x: number = 0,
    public y: number = 0,
  ) {}

  public add(other: Point): Point {
    return new Point(this.x + other.x, this.y + other.y);
  }

  public static copy(other: Point): Point {
    return new Point(other.x, other.y);
  }
}
