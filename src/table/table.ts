import { ColumnConstraints } from "../types/column-constraints";
import {
  TableColumnDef,
  TableConfig,
  TableOptions,
  TableRow,
} from "../types/table-config";
import { Camera } from "../utils/camera";
import { ColumnSizeMap } from "../utils/column-size-map";
import { Dimensions } from "../utils/dimensions";
import { Renderer } from "../utils/renderer";
import {
  HORIZONTAL_SCROLLBAR_HEIGHT,
  HorizontalScrollbar,
} from "./components/horizontal-scrollbar";
import { TableBody } from "./components/table-body";
import { TableHeader } from "./components/table-header";
import {
  VERTICAL_SCROLLBAR_WIDTH,
  VerticalScrollbar,
} from "./components/vertical-scrollbar";
import { TableWorker } from "./table-worker";

export class Table<TDataRow extends TableRow> {
  private verticalWrapper: HTMLDivElement;
  private horizontalWrapper: HTMLDivElement;

  private tableConfig: TableConfig<TDataRow>;
  private resizeObserver: ResizeObserver;
  private camera: Camera;
  private renderer: Renderer;

  private body: TableBody<TDataRow>;
  private header: TableHeader<TDataRow>;
  private scrollXBar: HorizontalScrollbar;
  private scrollYBar: VerticalScrollbar;

  private columnSizes: ColumnSizeMap<TDataRow>;
  private tableWorker: TableWorker;

  constructor(
    private root: HTMLDivElement,
    private readonly opts: TableOptions<TDataRow>,
  ) {
    this.tableConfig = this.opts.config;

    this.tableWorker = new TableWorker();

    const { width: TOTAL_WIDTH, height: TOTAL_HEIGHT } =
      this.root.getBoundingClientRect();

    this.tableWorker.send({
      type: "INIT",
      payload: {
        w: TOTAL_WIDTH,
        h: TOTAL_HEIGHT,
        columnConstraints: this.getColumnConstraints(this.opts.config.columns),
        cellStyling: this.opts.config.style.body.cell,
      },
    });

    this.horizontalWrapper = document.createElement("div");
    this.horizontalWrapper.style.display = "flex";
    this.horizontalWrapper.style.width = "100%";
    this.horizontalWrapper.style.height = "100%";
    this.root.appendChild(this.horizontalWrapper);

    this.verticalWrapper = document.createElement("div");
    this.verticalWrapper.style.display = "flex";
    this.verticalWrapper.style.flexDirection = "column";
    this.horizontalWrapper.style.width = "100%";
    this.horizontalWrapper.style.height = "100%";
    this.horizontalWrapper.appendChild(this.verticalWrapper);

    this.columnSizes = new ColumnSizeMap(this.opts.config.columns);
    this.tableWorker.on("CELL_SIZE", ({ columnId, width }) => {
      this.columnSizes.updateColumnSize(columnId, width);
    });

    this.camera = new Camera({
      viewportWidth: TOTAL_WIDTH,
      viewportHeight: TOTAL_HEIGHT,
    });

    this.columnSizes.getTotalColumnSizeObservable().subscribe((w) => {
      this.camera.updateWorldDimensions({
        w: w + VERTICAL_SCROLLBAR_WIDTH,
        h:
          this.opts.config.rows.length *
            this.opts.config.style.body.row.height +
          this.opts.config.style.header.row.height +
          HORIZONTAL_SCROLLBAR_HEIGHT,
      });
    });

    this.body = new TableBody(
      this.camera,
      this.tableConfig,
      this.opts.source,
      this.columnSizes,
      this.tableWorker,
      new Dimensions(
        TOTAL_WIDTH - VERTICAL_SCROLLBAR_WIDTH,
        TOTAL_HEIGHT -
          this.opts.config.style.header.row.height -
          HORIZONTAL_SCROLLBAR_HEIGHT,
      ),
    );
    this.header = new TableHeader(
      this.camera,
      this.columnSizes,
      new Dimensions(
        TOTAL_WIDTH - VERTICAL_SCROLLBAR_WIDTH,
        this.opts.config.style.header.row.height,
      ),
      this.tableConfig,
    );
    this.scrollXBar = new HorizontalScrollbar(
      this.camera,
      new Dimensions(
        TOTAL_WIDTH - VERTICAL_SCROLLBAR_WIDTH,
        HORIZONTAL_SCROLLBAR_HEIGHT,
      ),
    );
    this.scrollYBar = new VerticalScrollbar(
      this.camera,
      new Dimensions(VERTICAL_SCROLLBAR_WIDTH, TOTAL_HEIGHT),
    );
    this.verticalWrapper.appendChild(this.header.getElement());
    this.verticalWrapper.appendChild(this.body.getElement());
    this.verticalWrapper.appendChild(this.scrollXBar.getElement());
    this.horizontalWrapper.appendChild(this.scrollYBar.getElement());

    this.resizeObserver = new ResizeObserver(() => {
      const { width, height } = this.root.getBoundingClientRect();
      this.camera.updateViewportDimensions({
        w: width,
        h: height,
      });
      this.body.resize(
        width - VERTICAL_SCROLLBAR_WIDTH,
        height -
          this.opts.config.style.header.row.height -
          HORIZONTAL_SCROLLBAR_HEIGHT,
        window.devicePixelRatio,
      );
      this.header.resize(
        width - VERTICAL_SCROLLBAR_WIDTH,
        this.opts.config.style.header.row.height,
        window.devicePixelRatio,
      );
      this.scrollXBar.resize(
        width - VERTICAL_SCROLLBAR_WIDTH,
        HORIZONTAL_SCROLLBAR_HEIGHT,
        window.devicePixelRatio,
      );
      this.scrollYBar.resize(
        VERTICAL_SCROLLBAR_WIDTH,
        height,
        window.devicePixelRatio,
      );
    });

    this.resizeObserver.observe(this.root);

    this.renderer = new Renderer([
      this.body,
      this.header,
      this.scrollXBar,
      this.scrollYBar,
    ]);
  }

  private getColumnConstraints(
    columns: Array<TableColumnDef<TDataRow>>,
  ): ColumnConstraints {
    const res: ColumnConstraints = {};
    for (const column of columns) {
      res[column.columnId] = {
        maxWidth: column.maxWidth,
        minWidth: column.minWidth,
      }; // TODO - should max width be optional?
    }
    return res;
  }
}

export function createTable<TDataRow extends TableRow>(
  root: HTMLDivElement,
  opts: TableOptions<TDataRow>,
): Table<TDataRow> {
  return new Table(root, opts);
}
