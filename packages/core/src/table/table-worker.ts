import {
  WorkerEvents,
  WorkerRequest,
  WorkerResponse,
} from "../types/table-worker-types";
import workerSource from "../worker/entrypoint-inline";

export class TableWorker {
  private worker: Worker;
  private listeners: Map<keyof WorkerEvents, Set<(data: unknown) => void>>;

  constructor() {
    this.listeners = new Map();

    const blob = new Blob([workerSource], { type: "application/javascript" });
    const blobUrl = URL.createObjectURL(blob);

    this.worker = new Worker(
      blobUrl,
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
    this.worker.onmessage = (e) => this.handleMessage(e);
  }

  private handleMessage(e: MessageEvent<WorkerResponse>): void {
    const callbacks = this.listeners.get(e.data.type);
    if (callbacks === undefined) return;
    for (const cb of callbacks) {
      cb(e.data.payload);
    }
  }

  public on<TEvent extends keyof WorkerEvents>(
    event: TEvent,
    callback: (data: WorkerEvents[TEvent]["response"]) => void,
  ): void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(callback as (data: unknown) => void);
  }

  public send(msg: WorkerRequest): void {
    this.worker.postMessage(msg);
  }
}
