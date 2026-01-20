import { InitEventData } from "../types/table-worker-types";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { TableBody } from "./table-components/table-body";

export class WorkerManager {
  private renderer: Renderer | undefined;
  private camera: Camera | undefined;
  private body: TableBody | undefined;

  public init(vals: InitEventData): void {
    this.camera = new Camera();
    this.body = new TableBody(this.camera, JSON.parse(vals.config), vals.body);

    this.camera.onCameraChange(() => {
      this.body?.requestRedraw();
    });

    this.renderer = new Renderer([this.body]);
  }

  public onScroll(dx: number, dy: number): void {
    this.camera?.updateFocus({ dx, dy });
  }

  public onResize(w: number, h: number, dpr: number): void {
    this.body?.onResize(w, h, dpr);
  }
}
