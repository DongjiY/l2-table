import { Closeable } from "./closeable";
import { Point } from "./point";

type PointListener = (point: Point) => void;
type DragListener = (delta: Point) => void;

/**
 * Normalizes primary-pointer input for one element.
 *
 * Pointer movement continues after the pointer leaves the element because the
 * element captures the pointer at the start of each press.
 */
export class Pointer implements Closeable {
  private readonly downListeners: Set<PointListener> = new Set();
  private readonly moveListeners: Set<PointListener> = new Set();
  private readonly dragListeners: Set<DragListener> = new Set();
  private readonly upListeners: Set<VoidFunction> = new Set();
  private readonly leaveListeners: Set<VoidFunction> = new Set();
  private readonly clickListeners: Set<PointListener> = new Set();
  private activePointerId: number | undefined;
  private previousPoint: Point | undefined;
  private clickStartPoint: Point | undefined;
  private readonly previousTouchAction: string;

  constructor(private readonly element: HTMLElement) {
    this.previousTouchAction = this.element.style.touchAction;
    this.element.style.touchAction = "none";

    this.element.addEventListener("pointerdown", this.handlePointerDown);
    this.element.addEventListener("pointermove", this.handlePointerMove);
    this.element.addEventListener("pointerup", this.handlePointerUp);
    this.element.addEventListener("pointercancel", this.handlePointerCancel);
    this.element.addEventListener("pointerleave", this.handlePointerLeave);
    this.element.addEventListener(
      "lostpointercapture",
      this.handleLostPointerCapture
    );
  }

  public onPointerDown(listener: PointListener): void {
    this.downListeners.add(listener);
  }

  public onPointerMove(listener: PointListener): void {
    this.moveListeners.add(listener);
  }

  public onDrag(listener: DragListener): void {
    this.dragListeners.add(listener);
  }

  public onPointerUp(listener: VoidFunction): void {
    this.upListeners.add(listener);
  }

  public onPointerLeave(listener: VoidFunction): void {
    this.leaveListeners.add(listener);
  }

  public onClick(listener: PointListener): void {
    this.clickListeners.add(listener);
  }

  public close(): void {
    this.finishDrag();
    this.element.removeEventListener("pointerdown", this.handlePointerDown);
    this.element.removeEventListener("pointermove", this.handlePointerMove);
    this.element.removeEventListener("pointerup", this.handlePointerUp);
    this.element.removeEventListener("pointercancel", this.handlePointerCancel);
    this.element.removeEventListener("pointerleave", this.handlePointerLeave);
    this.element.removeEventListener(
      "lostpointercapture",
      this.handleLostPointerCapture
    );
    this.element.style.touchAction = this.previousTouchAction;

    this.downListeners.clear();
    this.moveListeners.clear();
    this.dragListeners.clear();
    this.upListeners.clear();
    this.leaveListeners.clear();
    this.clickListeners.clear();
  }

  private handlePointerDown = (event: PointerEvent): void => {
    if (
      !event.isPrimary ||
      event.button !== 0 ||
      this.activePointerId !== undefined
    ) {
      return;
    }

    const point = this.getPoint(event);
    this.activePointerId = event.pointerId;
    this.previousPoint = point;
    this.clickStartPoint = Point.clone(point);
    this.element.setPointerCapture(event.pointerId);
    this.downListeners.forEach((listener) => listener(point));
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (!event.isPrimary) return;

    const point = this.getPoint(event);
    this.moveListeners.forEach((listener) => listener(point));

    if (
      event.pointerId !== this.activePointerId ||
      this.previousPoint === undefined
    ) {
      return;
    }

    const delta = new Point(
      point.x - this.previousPoint.x,
      point.y - this.previousPoint.y
    );
    if (this.clickStartPoint && !this.clickStartPoint.equals(point)) {
      this.clickStartPoint = undefined;
    }
    this.previousPoint = point;
    this.dragListeners.forEach((listener) => listener(delta));
  };

  private handlePointerUp = (event: PointerEvent): void => {
    if (event.pointerId !== this.activePointerId) return;

    const point = this.getPoint(event);
    const isClick = this.clickStartPoint?.equals(point) ?? false;
    this.finishDrag();
    if (this.element.hasPointerCapture(event.pointerId)) {
      this.element.releasePointerCapture(event.pointerId);
    }
    if (isClick) {
      this.clickListeners.forEach((listener) => listener(point));
    }
  };

  private handlePointerCancel = (event: PointerEvent): void => {
    if (event.pointerId !== this.activePointerId) return;

    this.finishDrag();
    if (this.element.hasPointerCapture(event.pointerId)) {
      this.element.releasePointerCapture(event.pointerId);
    }
  };

  private handlePointerLeave = (): void => {
    this.leaveListeners.forEach((listener) => listener());
  };

  private handleLostPointerCapture = (event: PointerEvent): void => {
    if (event.pointerId === this.activePointerId) {
      this.finishDrag();
    }
  };

  private finishDrag(): void {
    if (this.activePointerId === undefined) return;

    this.activePointerId = undefined;
    this.previousPoint = undefined;
    this.clickStartPoint = undefined;
    this.upListeners.forEach((listener) => listener());
  }

  private getPoint(event: PointerEvent): Point {
    const rect = this.element.getBoundingClientRect();
    return new Point(event.clientX - rect.left, event.clientY - rect.top);
  }
}
