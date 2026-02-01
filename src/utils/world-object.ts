import { BoundingBox } from "./bounding-box";
import { Drawable } from "./drawable";
import { ObjectState } from "./object-state";
import { Point } from "./point";

export abstract class WorldObject implements Drawable {
  protected point: Point = new Point();
  protected state: ObjectState = new ObjectState();

  constructor(point?: Point) {
    if (point) this.point = point;
  }

  public abstract draw(ctx: CanvasRenderingContext2D): void;

  public abstract getBoundingBox(): BoundingBox;
}
