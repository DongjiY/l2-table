import { Point } from "./point";

type AnimationFrameCallback = (timestamp: number) => void;

export type MomentumScrollerOptions = {
  friction?: number;
  minimumVelocity?: number;
  now?: () => number;
  requestFrame?: (callback: AnimationFrameCallback) => number;
  cancelFrame?: (frame: number) => void;
};

/**
 * Continues drag movement after release while gradually reducing its velocity.
 *
 * Callers pass deltas in their own scroll coordinate system. This keeps the
 * class independent of pointer coordinates, camera direction, and scrollbar
 * track-to-content conversions.
 */
export class MomentumScroller {
  private animationFrame: number | undefined;
  private velocity: Point = new Point();
  private previousTime: number | undefined;

  constructor(
    private readonly onDelta: (delta: Point) => void,
    private readonly options: MomentumScrollerOptions = {}
  ) {}

  public start(): void {
    this.stop();
    this.previousTime = this.now();
  }

  /** Applies a drag delta immediately and records it as the release velocity. */
  public drag(delta: Point): void {
    const now = this.now();
    const elapsed = Math.max(now - (this.previousTime ?? now), 1);

    this.onDelta(delta);
    this.velocity = new Point(delta.x / elapsed, delta.y / elapsed);
    this.previousTime = now;
  }

  public release(): void {
    this.previousTime = undefined;
    if (this.isBelowMinimumVelocity()) return;

    let previousFrameTime = this.now();
    const animate = (now: number): void => {
      const elapsed = now - previousFrameTime;
      previousFrameTime = now;

      this.onDelta(
        new Point(this.velocity.x * elapsed, this.velocity.y * elapsed)
      );

      const decay = Math.exp(-this.friction * elapsed);
      this.velocity = new Point(
        this.velocity.x * decay,
        this.velocity.y * decay
      );

      if (this.isBelowMinimumVelocity()) {
        this.stop();
        return;
      }

      this.animationFrame = this.requestFrame(animate);
    };

    this.animationFrame = this.requestFrame(animate);
  }

  public stop(): void {
    if (this.animationFrame !== undefined) {
      this.cancelFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
    this.velocity = new Point();
    this.previousTime = undefined;
  }

  private get friction(): number {
    return this.options.friction ?? 0.008;
  }

  private get minimumVelocity(): number {
    return this.options.minimumVelocity ?? 0.01;
  }

  private now(): number {
    return this.options.now?.() ?? performance.now();
  }

  private requestFrame(callback: AnimationFrameCallback): number {
    return (
      this.options.requestFrame?.(callback) ?? requestAnimationFrame(callback)
    );
  }

  private cancelFrame(frame: number): void {
    if (this.options.cancelFrame) {
      this.options.cancelFrame(frame);
      return;
    }
    cancelAnimationFrame(frame);
  }

  private isBelowMinimumVelocity(): boolean {
    return (
      Math.abs(this.velocity.x) < this.minimumVelocity &&
      Math.abs(this.velocity.y) < this.minimumVelocity
    );
  }
}
