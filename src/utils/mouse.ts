import { Point } from "./point";

type MouseMoveCallbackFn = (p: Point) => void;

type MouseLostCallbackFn = VoidFunction;

export class Mouse {
  private readonly onMouseMoveCallbacks: Map<MouseMoveCallbackFn, Point> =
    new Map();
  private readonly onMouseLostCallbacks: Set<MouseLostCallbackFn> = new Set();
  private point: Point = new Point();
  private _tempPoint: Point = new Point();

  constructor(private readonly container: HTMLElement) {
    container.addEventListener("mousemove", this.handleMouseMove.bind(this));
    container.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
  }

  /**
   * Assigns a callback function to be called when the mouse point updates.
   * @param fn The callback function invoked. You should not store the reference of the input point parameter because it is a shared instance.
   * @param transposition A point transposition that will be added to the mouse point. Use this to convert to local coordinates.
   */
  public onMouseMove(
    fn: MouseMoveCallbackFn,
    transposition: Point = new Point(0, 0),
  ): void {
    this.onMouseMoveCallbacks.set(fn, transposition);
  }

  public removeMouseMoveListener(fn: MouseMoveCallbackFn): void {
    this.onMouseMoveCallbacks.delete(fn);
  }

  public onMouseLost(fn: MouseLostCallbackFn): void {
    this.onMouseLostCallbacks.add(fn);
  }

  public removeMouseLostListener(fn: MouseLostCallbackFn): void {
    this.onMouseLostCallbacks.delete(fn);
  }

  private handleMouseLeave(): void {
    this.onMouseLostCallbacks.forEach((cb) => cb());
  }

  private handleMouseMove(e: MouseEvent): void {
    const rect = this.container.getBoundingClientRect();
    this.point.x = e.clientX - rect.left;
    this.point.y = e.clientY - rect.top;
    this.onMouseMoveCallbacks.forEach((transpose, cb) => {
      this._tempPoint.x = this.point.x + transpose.x;
      this._tempPoint.y = this.point.y + transpose.y;
      cb(this._tempPoint);
    });
  }
}
