import { merge, Subscription } from "rxjs";
import { WorkerCanvas } from "./worker-canvas";
import { Closeable } from "../utils/closeable";

export class Renderer implements Closeable {
  private pendingDraw = false;
  private subscription: Subscription;

  constructor(private readonly children: Array<WorkerCanvas>) {
    const drawQueues = this.children.map((child) => child.drawQueue);
    this.subscription = merge(...drawQueues).subscribe(() => {
      this.scheduleDraw();
    });
  }

  public close(): void {
    this.subscription.unsubscribe();
  }

  private scheduleDraw(): void {
    if (this.pendingDraw) return;
    this.pendingDraw = true;

    requestAnimationFrame(() => {
      this.pendingDraw = false;
      this.children.forEach((child) => child._drawImpl());
    });
  }
}
