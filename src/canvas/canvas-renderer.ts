import { merge, animationFrameScheduler } from "rxjs";
import { auditTime } from "rxjs/operators";
import { DrawCanvas } from "./draw-canvas";

export class CanvasRenderer {
  private dirty = true;

  constructor(private layers: DrawCanvas[]) {
    const invalidations$ = merge(...layers.map((l) => l.invalidateStream));

    invalidations$
      .pipe(auditTime(0, animationFrameScheduler))
      .subscribe(() => this.invalidate());

    this.frame = this.frame.bind(this);
    requestAnimationFrame(this.frame);
  }

  private invalidate() {
    this.dirty = true;
  }

  private frame() {
    if (this.dirty) {
      for (const layer of this.layers) {
        layer.draw();
      }
      this.dirty = false;
    }
    requestAnimationFrame(this.frame);
  }
}
