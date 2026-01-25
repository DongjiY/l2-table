import { TableWorkerEvent } from "../types/table-worker-types";
import { ColumnSizeManager } from "./column-size-manager";

const columnSizeManager = new ColumnSizeManager();

self.onmessage = (e: MessageEvent<TableWorkerEvent>) => {
  const source = e.data;
  switch (source.type) {
    case "INIT":
      columnSizeManager.init(source.data.w, source.data.h);
      break;
    case "CELL_SIZE":
      columnSizeManager.computeColumnSize(
        source.data.content,
        source.data.styling,
      );
      break;
    default: {
      const _exhaustive: never = source;
      return _exhaustive;
    }
  }
};
