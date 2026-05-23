import { WorkerRequest, WorkerResponse } from "../types/table-worker-types";
import { ContentWidthCache } from "../utils/content-width-cache";
import { ColumnSizeManager } from "./column-size-manager";

const columnSizeManager = new ColumnSizeManager();

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const source = e.data;
  switch (source.type) {
    case "INIT":
      columnSizeManager.init(
        source.payload.w,
        source.payload.h,
        source.payload.columnConstraints,
        source.payload.cellStyling
      );
      replyMessage({ type: "INIT", payload: { ack: true } });
      break;
    case "CELL_SIZE":
      const res = columnSizeManager.computeColumnSize(
        source.payload.columnId,
        source.payload.content
      );
      replyMessage({
        type: "CELL_SIZE",
        payload: res,
      });
      break;
    case "MEASURE_CONTENT":
      const measuredWidth = columnSizeManager.measureContent(
        source.payload.content,
        source.payload.font
      );
      replyMessage({
        type: "MEASURE_CONTENT",
        payload: {
          key: ContentWidthCache.generateKey(
            source.payload.content,
            source.payload.font
          ),
          width: measuredWidth,
          type: source.payload.type,
        },
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
