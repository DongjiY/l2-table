import { BoundingBox } from "./bounding-box";
import { Dimensions } from "./dimensions";
import { Point } from "./point";

export class AnnotatedBoundingBox<
  TAnnotation extends Record<string, any>,
> extends BoundingBox {
  public meta: TAnnotation;

  constructor(point: Point, dimensions: Dimensions, annotation: TAnnotation) {
    super(point, dimensions);
    this.meta = annotation;
  }
}
