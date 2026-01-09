import { Observable } from "../node_modules/rxjs/dist/types/index";
import { Camera } from "./camera";
import { DrawCanvas } from "./draw-canvas";
import { SourceData, TableConfig } from "./table-config";
import { TableBody } from "./table/body";
import { TableHeader } from "./table/header";

export class Table {
  private container: HTMLDivElement;
  private camera: Camera;
  private header: TableHeader;
  private body: TableBody;

  constructor(
    container: HTMLDivElement,
    source: Observable<SourceData<string>>,
    tableConfig: TableConfig
  ) {
    this.camera = new Camera();
    this.container = container;
    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";

    this.header = new TableHeader(tableConfig, this.camera, {
      w: 600,
      h: 40,
    });
    this.header.attach(this.container);

    this.body = new TableBody(
      tableConfig,
      this.camera,
      {
        w: 600,
        h: 500,
      },
      source
    );
    this.body.attach(this.container);
  }
}
