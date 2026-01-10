import { Observable } from "rxjs";
import { Camera } from "../canvas/camera";
import { DrawCanvas } from "../canvas/draw-canvas";
import { RowData, SourceData, TableConfig } from "./table-config";
import { TableBody } from "./body";
import { TableHeader } from "./header";
import { CanvasRenderer } from "../canvas/canvas-renderer";
import { HorizontalScrollbar } from "../scroll/horizontal-scrollbar";
import { VerticalScrollbar } from "../scroll/vertical-scrollbar";

export class Table<TRow extends RowData> {
  private container: HTMLDivElement;
  private verticalWrapper: HTMLDivElement;
  private horizontalWrapper: HTMLDivElement;

  private header: TableHeader<TRow>;
  private body: TableBody<TRow>;
  private xScrollBar: HorizontalScrollbar;
  private yScrollBar: VerticalScrollbar;
  private canvasRenderer: CanvasRenderer;
  private readonly camera: Camera;

  constructor(
    container: HTMLDivElement,
    source: Observable<SourceData<TRow>>,
    tableConfig: TableConfig<TRow>
  ) {
    this.container = container;

    this.horizontalWrapper = document.createElement("div");
    this.horizontalWrapper.style.display = "flex";
    this.container.appendChild(this.horizontalWrapper);

    this.verticalWrapper = document.createElement("div");
    this.verticalWrapper.style.display = "flex";
    this.verticalWrapper.style.flexDirection = "column";
    this.horizontalWrapper.appendChild(this.verticalWrapper);

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

    this.xScrollBar = new HorizontalScrollbar(
      {
        w: 600,
      },
      this.camera
    );

    this.yScrollBar = new VerticalScrollbar(
      {
        h: 540,
      },
      this.camera
    );

    this.canvasRenderer = new CanvasRenderer([
      this.header,
      this.body,
      this.xScrollBar,
      this.yScrollBar,
    ]);

    this.header.attach(this.verticalWrapper);
    this.body.attach(this.verticalWrapper);
    this.xScrollBar.attach(this.verticalWrapper);
    this.yScrollBar.attach(this.horizontalWrapper);
  }
}
