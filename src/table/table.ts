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
  private readonly camera: Camera;

  constructor(
    container: HTMLDivElement,
    source: Observable<SourceData<TRow>>,
    tableConfig: TableConfig<TRow>
  ) {
    this.container = container;
    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.camera = new Camera({
      viewportHeight: 500,
      viewportWidth: 600,
    });

    this.header = new TableHeader(
      tableConfig,
      {
        w: 600,
        h: 40,
      },
      this.camera
    );

    this.body = new TableBody(
      tableConfig,
      {
        w: 600,
        h: 500,
      },
      source,
      this.camera
    );

    this.canvasRenderer = new CanvasRenderer([this.header, this.body]);

    this.header.attach(this.container);
    this.body.attach(this.container);
  }
}
