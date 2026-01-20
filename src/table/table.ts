import { TableColumns, TableConfig, TableOptions } from "../types/table-config";
import { TableBody } from "./components/table-body";
import { TableWorker } from "./table-worker";
export class Table<C extends TableColumns> {
  private tableConfig: TableConfig<C>;
  private resizeObserver: ResizeObserver;
  private tableWorker: TableWorker;
  private body: TableBody;

  constructor(
    private root: HTMLDivElement,
    opts: TableOptions<C>,
  ) {
    this.tableConfig = opts.config;

    this.tableWorker = new TableWorker();
    this.body = new TableBody(this.tableWorker);

    this.root.appendChild(this.body.getElement());

    this.resizeObserver = new ResizeObserver(() => {
      const dimensions = this.root.getBoundingClientRect();
      console.log("resizing", dimensions.width, dimensions.height);
      this.body.onResize(dimensions.width, dimensions.height);
    });

    this.resizeObserver.observe(this.root);

    this.initialize();
  }

  private initialize(): void {
    this.tableWorker.init({
      body: this.body.transferOffscreen(),
      config: JSON.stringify(this.tableConfig),
    });
  }
}

export function createTable<C extends TableColumns>(
  root: HTMLDivElement,
  opts: TableOptions<C>,
): Table<C> {
  return new Table(root, opts);
}
