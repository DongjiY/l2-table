import { Point } from "./point";

type MouseCallbackFn = (p: Point) => void;

export class Mouse {
  private readonly onMouseMoveCallbacks: Map<MouseCallbackFn, Point> =
    new Map();
  private readonly onMouseLostCallbacks: Set<VoidFunction> = new Set();
  private readonly onMouseDownCallbacks: Map<MouseCallbackFn, Point> =
    new Map();
  private readonly onMouseUpCallbacks: Map<MouseCallbackFn, Point> = new Map();
  private point: Point = new Point();
  private _tempPoint: Point = new Point();

  constructor(private readonly container: HTMLElement) {
    container.addEventListener("mousemove", this.handleMouseMove.bind(this));
    container.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    container.addEventListener("mousedown", this.handleMouseDown.bind(this));
    container.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  /**
   * Assigns a callback function to be called when the mouse point updates.
   * @param fn The callback function invoked. You should not store the reference of the input point parameter because it is a shared instance.
   * @param transposition A point transposition that will be added to the mouse point. Use this to convert to local coordinates.
   */
  public onMouseMove(
    fn: MouseCallbackFn,
    transposition: Point = new Point(0, 0),
  ): void {
    this.onMouseMoveCallbacks.set(fn, transposition);
  }

  public removeMouseMoveListener(fn: MouseCallbackFn): void {
    this.onMouseMoveCallbacks.delete(fn);
  }

  public onMouseLost(fn: VoidFunction): void {
    this.onMouseLostCallbacks.add(fn);
  }

  public removeMouseLostListener(fn: VoidFunction): void {
    this.onMouseLostCallbacks.delete(fn);
  }

  private handleMouseLeave(): void {
    this.onMouseLostCallbacks.forEach((cb) => cb());
  }

  public onMouseDown(
    fn: MouseCallbackFn,
    transposition: Point = new Point(0, 0),
  ): void {
    this.onMouseDownCallbacks.set(fn, transposition);
  }

  public removeMouseDownListener(fn: MouseCallbackFn): void {
    this.onMouseMoveCallbacks.delete(fn);
  }

  public onMouseUp(
    fn: MouseCallbackFn,
    transposition: Point = new Point(0, 0),
  ): void {
    this.onMouseUpCallbacks.set(fn, transposition);
  }

  public removeMouseUpListener(fn: MouseCallbackFn): void {
    this.onMouseUpCallbacks.delete(fn);
  }

  private updatePointFromMouseEvent(e: MouseEvent): Point {
    const rect = this.container.getBoundingClientRect();
    this.point.x = e.clientX - rect.left;
    this.point.y = e.clientY - rect.top;
    return this.point;
  }

  private updateTempPointFromMouseEvent(transpose: Point): Point {
    this._tempPoint.x = this.point.x + transpose.x;
    this._tempPoint.y = this.point.y + transpose.y;
    return this._tempPoint;
  }

  private handleMouseUp(e: MouseEvent): void {
    this.updatePointFromMouseEvent(e);
    this.onMouseUpCallbacks.forEach((transpose, cb) => {
      const p = this.updateTempPointFromMouseEvent(transpose);
      cb(p);
    });
  }

  private handleMouseDown(e: MouseEvent): void {
    this.updatePointFromMouseEvent(e);
    this.onMouseDownCallbacks.forEach((transpose, cb) => {
      const p = this.updateTempPointFromMouseEvent(transpose);
      cb(p);
    });
  }

  private handleMouseMove(e: MouseEvent): void {
    this.updatePointFromMouseEvent(e);
    this.onMouseMoveCallbacks.forEach((transpose, cb) => {
      const p = this.updateTempPointFromMouseEvent(transpose);
      cb(p);
    });
  }
}
