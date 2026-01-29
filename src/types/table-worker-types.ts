import { ColumnConstraints } from "./column-constraints";
import { TableCellStyles } from "./table-cell-types";

export interface WorkerEvents {
  INIT: {
    request: {
      w: number;
      h: number;
      columnConstraints: ColumnConstraints;
      cellStyling: TableCellStyles | undefined;
    };
    response: { ack: true };
  };
  CELL_SIZE: {
    request: {
      columnId: string;
      content: string;
    };
    response: {
      columnId: string;
      overflown: boolean;
      width: number;
    };
  };
}

export type WorkerRequest = {
  [K in keyof WorkerEvents]: {
    type: K;
    payload: WorkerEvents[K]["request"];
  };
}[keyof WorkerEvents];

export type WorkerResponse = {
  [K in keyof WorkerEvents]: {
    type: K;
    payload: WorkerEvents[K]["response"];
    error?: unknown;
  };
}[keyof WorkerEvents];
