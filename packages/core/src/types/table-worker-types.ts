import { ColumnConstraints } from "./column-constraints";
import { TableCellStyles } from "./styles";

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
  MEASURE_CONTENT: {
    request: {
      content: string;
      font: string;
      type: "dynamic" | "static";
    };
    response: {
      key: string;
      width: number;
      type: "dynamic" | "static";
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
