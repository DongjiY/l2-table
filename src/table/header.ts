import { Camera } from "../camera";
import { DrawCanvas, DrawCanvasDimensions } from "../draw-canvas";
import { TableConfig } from "../table-config";

export class TableHeader extends DrawCanvas {
  constructor(
    config: TableConfig,
    camera: Camera,
    dimensions: DrawCanvasDimensions
  ) {
    super(camera, dimensions);

    this.camera.onCameraChange(this.draw);

    this.draw();
  }

  protected drawImpl(): void {
    this.canvasCtx.translate(-this.camera.X, 0);

    this.canvasCtx.fillStyle = "blue";
    this.canvasCtx.fillRect(0, 0, 100, 40);
  }
}
