import { Observable } from "rxjs";
import { Camera } from "../canvas/camera";
import { DrawCanvas } from "../canvas/draw-canvas";
import { RowData, SourceData, TableConfig } from "./table-config";
import { TableBody } from "./body";
import { TableHeader } from "./header";
import { CanvasRenderer } from "../canvas/canvas-renderer";

export class Table<TRow extends RowData> {
  private container: HTMLDivElement;
  private header: TableHeader<TRow>;
  private body: TableBody<TRow>;
  private canvasRenderer: CanvasRenderer;

  constructor(
    container: HTMLDivElement,
    source: Observable<SourceData<TRow>>,
    tableConfig: TableConfig<TRow>
  ) {
    this.container = container;
    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";

    // Create canvases
    this.header = new TableHeader(tableConfig, {
      w: 600,
      h: 40,
    });

    this.body = new TableBody(
      tableConfig,
      {
        w: 600,
        h: 500,
      },
      source
    );

    this.canvasRenderer = new CanvasRenderer([this.header, this.body]);

    // Sync header camera to body (horizontal scroll only)
    this.body.getCamera().onCameraChange(({ dx }) => {
      this.header.getCamera().updateCamera({ dx });
    });

    // Attach canvases to DOM
    this.header.attach(this.container);
    this.body.attach(this.container);
  }
}
