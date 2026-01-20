import { TableColumns } from "../types/table-config";
import { InitEventData, TableWorkerEvent } from "../types/table-worker-types";

export class TableWorker {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(
      new URL("./table/worker-entrypoint.js", import.meta.url), // this is relative to dist
      {
        type: "module",
      },
    );

    this.worker.onerror = (e) => {
      console.error("Worker error:", e);
    };
    this.worker.onmessageerror = (e) => {
      console.error("Worker message error:", e);
    };
  }

  public send(event: TableWorkerEvent, transfer?: Array<Transferable>): void {
    this.worker.postMessage(event, transfer ?? []);
  }

  public init(val: InitEventData): void {
    const canvases = [val.body];
    this.send(
      {
        type: "INIT",
        data: val,
      },
      canvases,
    );
  }
}
