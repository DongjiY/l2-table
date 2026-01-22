import { TableWorkerEvent } from "../types/table-worker-types";

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
}
