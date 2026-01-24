import { Dimensions } from "./dimensions";
import { Axis } from "./axis";
import { Point } from "./point";

export class BoundingBox {
  constructor(
    private point: Point,
    private dimensions: Dimensions,
  ) {}

  public compare(bb: BoundingBox, axis: Axis): -1 | 0 | 1 {
    switch (axis) {
      case Axis.X:
        return this.compareX(bb);
      case Axis.Y:
        return this.compareY(bb);
      default:
        const exhaustive: never = axis;
        return exhaustive;
    }
  }

  private compareX(bb: BoundingBox): -1 | 0 | 1 {
    if (
      this.point.x + this.dimensions.w > bb.point.x &&
      this.point.x < bb.point.x + bb.dimensions.w
    ) {
      return 0; // X overlap
    }
    return this.point.x + this.dimensions.w <= bb.point.x ? -1 : 1;
  }

  private compareY(bb: BoundingBox): -1 | 0 | 1 {
    if (
      this.point.y + this.dimensions.h > bb.point.y &&
      this.point.y < bb.point.y + bb.dimensions.h
    ) {
      return 0; // Y overlap
    }
    return this.point.y + this.dimensions.h <= bb.point.y ? -1 : 1;
  }

  public overlap(bb: BoundingBox): boolean {
    return !(
      this.point.x + this.dimensions.w <= bb.point.x ||
      this.point.x >= bb.point.x + bb.dimensions.w ||
      this.point.y + this.dimensions.h <= bb.point.y ||
      this.point.y >= bb.point.y + bb.dimensions.h
    );
  }
}
