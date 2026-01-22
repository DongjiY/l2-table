import { from, merge, Subscription, switchMap } from "rxjs";
import { Closeable } from "./closeable";
import { DrawCanvas } from "./draw-canvas";

export class Renderer implements Closeable {
  private pendingDraw = false;
  private subscription: Subscription;

  constructor(private readonly children: Array<DrawCanvas>) {
    const drawQueues = this.children.map((child) => child.drawQueue);

    const fontsReady$ = from(document.fonts.ready);

    this.subscription = fontsReady$
      .pipe(switchMap(() => merge(...drawQueues)))
      .subscribe(() => {
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
