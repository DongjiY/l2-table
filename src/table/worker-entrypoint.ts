import { TableWorkerEvent } from "../types/table-worker-types";
import { WorkerManager } from "../worker/worker-manager";

const workerManager: WorkerManager = new WorkerManager();

self.onmessage = (e: MessageEvent<TableWorkerEvent>) => {
  throw new Error("Method not implemented");
  // const source = e.data;
  // switch (source.type) {
  //   case "INIT":
  //     workerManager.init(source.data);
  //     break;
  //   case "SCROLL":
  //     workerManager.onScroll(source.data.dx, source.data.dy);
  //     break;
  //   case "RESIZE":
  //     workerManager.onResize(source.data.w, source.data.h, source.data.dpr);
  //     break;
  //   default: {
  //     const _exhaustive: never = source;
  //     return _exhaustive;
  //   }
  // }
};
