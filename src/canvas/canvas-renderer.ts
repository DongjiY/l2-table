import { merge } from "rxjs";
import { DrawCanvas } from "./draw-canvas";

export class CanvasRenderer {
  private scheduled = false;

  constructor(private layers: DrawCanvas[]) {
    const invalidations$ = merge(...layers.map((l) => l.invalidateStream));

    invalidations$.subscribe(() => this.scheduleDraw());
  }

  private scheduleDraw() {
    if (this.scheduled) return;

    this.scheduled = true;

    requestAnimationFrame(() => {
      this.scheduled = false;

      for (const layer of this.layers) {
        layer.draw();
      }
    });
  }
}
