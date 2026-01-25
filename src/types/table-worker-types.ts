import { TableCellFontStyling } from "./table-cell-types";

export interface WorkerEvents {
  INIT: {
    request: { w: number; h: number; columnMaxWidths: Record<string, number> };
    response: { ack: true };
  };
  CELL_SIZE: {
    request: {
      content: string;
      styling: TableCellFontStyling;
    };
    response: {
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
