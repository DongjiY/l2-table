import { Drawable } from "./drawable";
import { Point } from "./point";

export abstract class WorldObject implements Drawable {
  protected point: Point = new Point();

  constructor(point?: Point) {
    if (point) this.point = point;
  }

  public abstract draw(ctx: OffscreenCanvasRenderingContext2D): void;
}
