import { WorkerRequest, WorkerResponse } from "../types/table-worker-types";
import { ColumnSizeManager } from "./column-size-manager";

const columnSizeManager = new ColumnSizeManager();

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const source = e.data;
  switch (source.type) {
    case "INIT":
      columnSizeManager.init(source.payload.w, source.payload.h);
      replyMessage({ type: "INIT", payload: { ack: true } });
      break;
    case "CELL_SIZE":
      const res = columnSizeManager.computeColumnSize(
        source.payload.content,
        source.payload.styling,
      );
      replyMessage({
        type: "CELL_SIZE",
        payload: res,
      });
      break;
    default: {
      const _exhaustive: never = source;
      return _exhaustive;
    }
  }
};

function replyMessage(msg: WorkerResponse) {
  self.postMessage(msg);
}
