import { Axis } from "./axis";
import { BoundingBox } from "./bounding-box";

export function boundaryBinarySearchLeftOrTop<
  TBoundingBoxA extends BoundingBox,
  TBoundingBoxB extends BoundingBox,
>(
  arr: Array<TBoundingBoxA>,
  target: TBoundingBoxB,
  axis: Axis,
): TBoundingBoxA | undefined {
  let lp = 0;
  let rp = arr.length - 1;
  let res: TBoundingBoxA | undefined = undefined;
  while (lp <= rp) {
    const mid = Math.floor((lp + rp) / 2);
    const bb = arr[mid];
    if (target.compare(bb, axis) === 0) {
      res = bb;
      rp = mid - 1;
    } else if (target.compare(bb, axis) === -1) {
      rp = mid - 1;
    } else {
      lp = mid + 1;
    }
  }
  return res;
}

export function boundaryBinarySearchRightOrBottom<
  TBoundingBoxA extends BoundingBox,
  TBoundingBoxB extends BoundingBox,
>(
  arr: Array<TBoundingBoxA>,
  target: TBoundingBoxB,
  axis: Axis,
): TBoundingBoxA | undefined {
  let lp = 0;
  let rp = arr.length - 1;
  let res: TBoundingBoxA | undefined = undefined;
  while (lp <= rp) {
    const mid = Math.floor((lp + rp) / 2);
    const bb = arr[mid];
    if (target.compare(bb, axis) === 0) {
      res = bb;
      lp = mid + 1;
    } else if (target.compare(bb, axis) === 1) {
      lp = mid + 1;
    } else {
      rp = mid - 1;
    }
  }
  return res;
}

export function calculateTopAndBottomRowBounds(
  rowHeight: number,
  rowCount: number,
  cameraY: number,
  viewportHeight: number,
): {
  topIndex: number;
  bottomIndex: number;
} {
  const startIndex = Math.floor(cameraY / rowHeight);
  const endIndex = Math.ceil((cameraY + viewportHeight) / rowHeight) - 1;
  return {
    topIndex: Math.max(0, startIndex),
    bottomIndex: Math.min(rowCount - 1, endIndex),
  };
}
