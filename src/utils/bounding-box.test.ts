import { Axis } from "./axis";
import { BoundingBox } from "./bounding-box";
import { Dimensions } from "./dimensions";
import { Point } from "./point";

describe("BoundingBox", () => {
  test("CompareX box A is fully to the left of box B without overlap", () => {
    const boxA = new BoundingBox(new Point(0, 0), new Dimensions(20, 20));
    const boxB = new BoundingBox(new Point(21, 0), new Dimensions(20, 20));
    expect(boxA.compare(boxB, Axis.X)).toBe(-1);
  });

  test("CompareX box A is fully to the left of box B without overlap and with touching edges", () => {
    const boxA = new BoundingBox(new Point(0, 0), new Dimensions(20, 20));
    const boxB = new BoundingBox(new Point(20, 0), new Dimensions(20, 20));
    expect(boxA.compare(boxB, Axis.X)).toBe(-1);
  });

  test("CompareX box A starts to the left of box B and ends within box B with overlap", () => {
    const boxA = new BoundingBox(new Point(0, 0), new Dimensions(20, 20));
    const boxB = new BoundingBox(new Point(15, 0), new Dimensions(20, 20));
    expect(boxA.compare(boxB, Axis.X)).toBe(0);
  });

  test("CompareX box A is fully enclosed within box B with overlap", () => {
    const boxA = new BoundingBox(new Point(20, 0), new Dimensions(20, 20));
    const boxB = new BoundingBox(new Point(0, 0), new Dimensions(100, 20));
    expect(boxA.compare(boxB, Axis.X)).toBe(0);
  });

  test("CompareX box A is equal to box B with overlap", () => {
    const boxA = new BoundingBox(new Point(0, 0), new Dimensions(20, 20));
    const boxB = new BoundingBox(new Point(0, 0), new Dimensions(20, 20));
    expect(boxA.compare(boxB, Axis.X)).toBe(0);
  });

  test("CompareX box A fully encloses box B with overlap", () => {
    const boxA = new BoundingBox(new Point(0, 0), new Dimensions(100, 20));
    const boxB = new BoundingBox(new Point(20, 0), new Dimensions(20, 20));
    expect(boxA.compare(boxB, Axis.X)).toBe(0);
  });

  test("CompareX box A starts within box B and ends to the right of box B with overlap", () => {
    const boxA = new BoundingBox(new Point(15, 0), new Dimensions(20, 20));
    const boxB = new BoundingBox(new Point(0, 0), new Dimensions(20, 20));
    expect(boxA.compare(boxB, Axis.X)).toBe(0);
  });

  test("CompareX box A is fully to the right of box B without overlap", () => {
    const boxA = new BoundingBox(new Point(21, 0), new Dimensions(20, 20));
    const boxB = new BoundingBox(new Point(0, 0), new Dimensions(20, 20));
    expect(boxA.compare(boxB, Axis.X)).toBe(1);
  });

  test("CompareX box A is fully to the right of box B without overlap and with touching edges", () => {
    const boxA = new BoundingBox(new Point(20, 0), new Dimensions(20, 20));
    const boxB = new BoundingBox(new Point(0, 0), new Dimensions(20, 20));
    expect(boxA.compare(boxB, Axis.X)).toBe(1);
  });

  test("CompareY box A is fully above box B without overlap", () => {
    const boxA = new BoundingBox(new Point(0, 0), new Dimensions(20, 20));
    const boxB = new BoundingBox(new Point(0, 21), new Dimensions(20, 20));
    expect(boxA.compare(boxB, Axis.Y)).toBe(-1);
  });

  test("CompareY box A is fully above box B without overlap and with touching edges", () => {
    const boxA = new BoundingBox(new Point(0, 0), new Dimensions(20, 20));
    const boxB = new BoundingBox(new Point(0, 20), new Dimensions(20, 20));
    expect(boxA.compare(boxB, Axis.Y)).toBe(-1);
  });

  test("CompareY box A starts above box B and ends within box B with overlap", () => {
    const boxA = new BoundingBox(new Point(0, 0), new Dimensions(20, 20));
    const boxB = new BoundingBox(new Point(0, 15), new Dimensions(20, 20));
    expect(boxA.compare(boxB, Axis.Y)).toBe(0);
  });

  test("CompareY box A is equal to box B with overlap", () => {
    const boxA = new BoundingBox(new Point(0, 0), new Dimensions(20, 20));
    const boxB = new BoundingBox(new Point(0, 0), new Dimensions(20, 20));
    expect(boxA.compare(boxB, Axis.Y)).toBe(0);
  });

  test("CompareY box A is fully enclosed by box B with overlap", () => {
    const boxA = new BoundingBox(new Point(0, 15), new Dimensions(20, 20));
    const boxB = new BoundingBox(new Point(0, 0), new Dimensions(20, 100));
    expect(boxA.compare(boxB, Axis.Y)).toBe(0);
  });

  test("CompareY box A fully encloses box B with overlap", () => {
    const boxA = new BoundingBox(new Point(0, 0), new Dimensions(20, 100));
    const boxB = new BoundingBox(new Point(0, 15), new Dimensions(20, 20));
    expect(boxA.compare(boxB, Axis.Y)).toBe(0);
  });

  test("CompareY box A starts within box B and ends below box B with overlap", () => {
    const boxA = new BoundingBox(new Point(0, 5), new Dimensions(20, 20));
    const boxB = new BoundingBox(new Point(0, 20), new Dimensions(20, 20));
    expect(boxA.compare(boxB, Axis.Y)).toBe(0);
  });

  test("CompareY box A starts below box B without overlap", () => {
    const boxA = new BoundingBox(new Point(0, 21), new Dimensions(20, 20));
    const boxB = new BoundingBox(new Point(0, 0), new Dimensions(20, 20));
    expect(boxA.compare(boxB, Axis.Y)).toBe(1);
  });

  test("CompareY box A starts below box B without overlap and with touching edges", () => {
    const boxA = new BoundingBox(new Point(0, 20), new Dimensions(20, 20));
    const boxB = new BoundingBox(new Point(0, 0), new Dimensions(20, 20));
    expect(boxA.compare(boxB, Axis.Y)).toBe(1);
  });
});
