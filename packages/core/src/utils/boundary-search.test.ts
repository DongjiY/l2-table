import { Axis } from "./axis";
import {
  boundaryBinarySearchLeftOrTop,
  boundaryBinarySearchRightOrBottom,
} from "./boundary-search";
import { BoundingBox } from "./bounding-box";
import { Dimensions } from "./dimensions";
import { Point } from "./point";

describe("Boundary Binary Search", () => {
  test("look for the left boundary where target is in the middle", () => {
    const H = 10;
    const arr = [
      new BoundingBox(new Point(0, 0), new Dimensions(10, H)),
      new BoundingBox(new Point(10, 0), new Dimensions(20, H)),
      new BoundingBox(new Point(30, 0), new Dimensions(15, H)),
      new BoundingBox(new Point(45, 0), new Dimensions(10, H)),
    ];
    const target = new BoundingBox(new Point(15, 0), new Dimensions(25, H));
    const res = boundaryBinarySearchLeftOrTop(arr, target, Axis.X);
    expect(res).toBe(arr[1]);
  });

  test("look for the left boundary where target is on the left edge", () => {
    const H = 10;
    const arr = [
      new BoundingBox(new Point(0, 0), new Dimensions(10, H)),
      new BoundingBox(new Point(10, 0), new Dimensions(20, H)),
      new BoundingBox(new Point(30, 0), new Dimensions(15, H)),
      new BoundingBox(new Point(45, 0), new Dimensions(10, H)),
    ];
    const target = new BoundingBox(new Point(0, 0), new Dimensions(25, H));
    const res = boundaryBinarySearchLeftOrTop(arr, target, Axis.X);
    expect(res).toBe(arr[0]);
  });

  test("look for the left boundary where target is on the right edge", () => {
    const H = 10;
    const arr = [
      new BoundingBox(new Point(0, 0), new Dimensions(10, H)),
      new BoundingBox(new Point(10, 0), new Dimensions(20, H)),
      new BoundingBox(new Point(30, 0), new Dimensions(15, H)),
      new BoundingBox(new Point(45, 0), new Dimensions(10, H)),
    ];
    const target = new BoundingBox(new Point(46, 0), new Dimensions(25, H));
    const res = boundaryBinarySearchLeftOrTop(arr, target, Axis.X);
    expect(res).toBe(arr[3]);
  });

  test("look for the left boundary where target DNE", () => {
    const H = 10;
    const arr = [
      new BoundingBox(new Point(0, 0), new Dimensions(10, H)),
      new BoundingBox(new Point(10, 0), new Dimensions(20, H)),
      new BoundingBox(new Point(30, 0), new Dimensions(15, H)),
      new BoundingBox(new Point(45, 0), new Dimensions(10, H)),
    ];
    const target = new BoundingBox(new Point(1000, 0), new Dimensions(25, H));
    const res = boundaryBinarySearchLeftOrTop(arr, target, Axis.X);
    expect(res).toBeUndefined();
  });

  test("look for the top boundary where target is in the middle", () => {
    const W = 10;
    const arr = [
      new BoundingBox(new Point(0, 0), new Dimensions(W, 10)),
      new BoundingBox(new Point(0, 10), new Dimensions(W, 20)),
      new BoundingBox(new Point(0, 30), new Dimensions(W, 15)),
      new BoundingBox(new Point(0, 45), new Dimensions(W, 10)),
    ];
    const target = new BoundingBox(new Point(0, 15), new Dimensions(W, 25));
    const res = boundaryBinarySearchLeftOrTop(arr, target, Axis.Y);
    expect(res).toBe(arr[1]);
  });

  test("look for the top boundary where target is on the top edge", () => {
    const W = 10;
    const arr = [
      new BoundingBox(new Point(0, 0), new Dimensions(W, 10)),
      new BoundingBox(new Point(0, 10), new Dimensions(W, 20)),
      new BoundingBox(new Point(0, 30), new Dimensions(W, 15)),
      new BoundingBox(new Point(0, 45), new Dimensions(W, 10)),
    ];
    const target = new BoundingBox(new Point(0, 0), new Dimensions(W, 25));
    const res = boundaryBinarySearchLeftOrTop(arr, target, Axis.Y);
    expect(res).toBe(arr[0]);
  });

  test("look for the top boundary where target is on the bottom edge", () => {
    const W = 10;
    const arr = [
      new BoundingBox(new Point(0, 0), new Dimensions(W, 10)),
      new BoundingBox(new Point(0, 10), new Dimensions(W, 20)),
      new BoundingBox(new Point(0, 30), new Dimensions(W, 15)),
      new BoundingBox(new Point(0, 45), new Dimensions(W, 10)),
    ];
    const target = new BoundingBox(new Point(0, 46), new Dimensions(W, 25));
    const res = boundaryBinarySearchLeftOrTop(arr, target, Axis.Y);
    expect(res).toBe(arr[3]);
  });

  test("look for the top boundary where target DNE", () => {
    const W = 10;
    const arr = [
      new BoundingBox(new Point(0, 0), new Dimensions(W, 10)),
      new BoundingBox(new Point(0, 10), new Dimensions(W, 20)),
      new BoundingBox(new Point(0, 30), new Dimensions(W, 15)),
      new BoundingBox(new Point(0, 45), new Dimensions(W, 10)),
    ];
    const target = new BoundingBox(new Point(0, 1000), new Dimensions(W, 25));
    const res = boundaryBinarySearchLeftOrTop(arr, target, Axis.Y);
    expect(res).toBeUndefined();
  });

  test("look for the right boundary where the target is in the middle", () => {
    const H = 10;
    const arr = [
      new BoundingBox(new Point(0, 0), new Dimensions(10, H)),
      new BoundingBox(new Point(10, 0), new Dimensions(20, H)),
      new BoundingBox(new Point(30, 0), new Dimensions(15, H)),
      new BoundingBox(new Point(45, 0), new Dimensions(10, H)),
    ];
    const target = new BoundingBox(new Point(15, 0), new Dimensions(20, H));
    const res = boundaryBinarySearchRightOrBottom(arr, target, Axis.X);
    expect(res).toBe(arr[2]);
  });

  test("look for the right boundary where the target is on the left edge", () => {
    const H = 10;
    const arr = [
      new BoundingBox(new Point(0, 0), new Dimensions(10, H)),
      new BoundingBox(new Point(10, 0), new Dimensions(20, H)),
      new BoundingBox(new Point(30, 0), new Dimensions(15, H)),
      new BoundingBox(new Point(45, 0), new Dimensions(10, H)),
    ];
    const target = new BoundingBox(new Point(0, 0), new Dimensions(5, H));
    const res = boundaryBinarySearchRightOrBottom(arr, target, Axis.X);
    expect(res).toBe(arr[0]);
  });

  test("look for the right boundary where the target is on the right edge", () => {
    const H = 10;
    const arr = [
      new BoundingBox(new Point(0, 0), new Dimensions(10, H)),
      new BoundingBox(new Point(10, 0), new Dimensions(20, H)),
      new BoundingBox(new Point(30, 0), new Dimensions(15, H)),
      new BoundingBox(new Point(45, 0), new Dimensions(10, H)),
    ];
    const target = new BoundingBox(new Point(35, 0), new Dimensions(12, H));
    const res = boundaryBinarySearchRightOrBottom(arr, target, Axis.X);
    expect(res).toBe(arr[3]);
  });

  test("look for the right boundary where the target DNE", () => {
    const H = 10;
    const arr = [
      new BoundingBox(new Point(0, 0), new Dimensions(10, H)),
      new BoundingBox(new Point(10, 0), new Dimensions(20, H)),
      new BoundingBox(new Point(30, 0), new Dimensions(15, H)),
      new BoundingBox(new Point(45, 0), new Dimensions(10, H)),
    ];
    const target = new BoundingBox(new Point(1000, 0), new Dimensions(12, H));
    const res = boundaryBinarySearchRightOrBottom(arr, target, Axis.X);
    expect(res).toBeUndefined();
  });

  test("look for the bottom boundary where target is in the middle", () => {
    const W = 10;
    const arr = [
      new BoundingBox(new Point(0, 0), new Dimensions(W, 10)),
      new BoundingBox(new Point(0, 10), new Dimensions(W, 20)),
      new BoundingBox(new Point(0, 30), new Dimensions(W, 15)),
      new BoundingBox(new Point(0, 45), new Dimensions(W, 10)),
    ];
    const target = new BoundingBox(new Point(0, 15), new Dimensions(W, 20));
    const res = boundaryBinarySearchRightOrBottom(arr, target, Axis.Y);
    expect(res).toBe(arr[2]);
  });

  test("look for the bottom boundary where target is on the top edge", () => {
    const W = 10;
    const arr = [
      new BoundingBox(new Point(0, 0), new Dimensions(W, 10)),
      new BoundingBox(new Point(0, 10), new Dimensions(W, 20)),
      new BoundingBox(new Point(0, 30), new Dimensions(W, 15)),
      new BoundingBox(new Point(0, 45), new Dimensions(W, 10)),
    ];
    const target = new BoundingBox(new Point(0, 0), new Dimensions(W, 5));
    const res = boundaryBinarySearchRightOrBottom(arr, target, Axis.Y);
    expect(res).toBe(arr[0]);
  });

  test("look for the bottom boundary where target is on the bottom edge", () => {
    const W = 10;
    const arr = [
      new BoundingBox(new Point(0, 0), new Dimensions(W, 10)),
      new BoundingBox(new Point(0, 10), new Dimensions(W, 20)),
      new BoundingBox(new Point(0, 30), new Dimensions(W, 15)),
      new BoundingBox(new Point(0, 45), new Dimensions(W, 10)),
    ];
    const target = new BoundingBox(new Point(0, 35), new Dimensions(W, 20));
    const res = boundaryBinarySearchRightOrBottom(arr, target, Axis.Y);
    expect(res).toBe(arr[3]);
  });

  test("look for the top boundary where target DNE", () => {
    const W = 10;
    const arr = [
      new BoundingBox(new Point(0, 0), new Dimensions(W, 10)),
      new BoundingBox(new Point(0, 10), new Dimensions(W, 20)),
      new BoundingBox(new Point(0, 30), new Dimensions(W, 15)),
      new BoundingBox(new Point(0, 45), new Dimensions(W, 10)),
    ];
    const target = new BoundingBox(new Point(0, 1000), new Dimensions(W, 25));
    const res = boundaryBinarySearchRightOrBottom(arr, target, Axis.Y);
    expect(res).toBeUndefined();
  });
});
