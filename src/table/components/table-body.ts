import { TableWorker } from "../table-worker";
import { TransferrableCanvas } from "../transferrable-canvas";

export class TableBody extends TransferrableCanvas {
  constructor(private readonly worker: TableWorker) {
    super();

    this.getElement().addEventListener(
      "wheel",
      (e: WheelEvent) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        this.worker.send({
          type: "SCROLL",
          data: {
            dx: e.deltaX,
            dy: e.deltaY,
          },
        });
      },
      { passive: false },
    );
  }

  public onResize(w: number, h: number): void {
    this.worker.send({
      type: "RESIZE",
      data: {
        w,
        h,
        dpr: window.devicePixelRatio,
      },
    });
  }
}
