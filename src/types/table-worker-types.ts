import { TableCellFontStyling } from "./table-cell-types";

type TableWorkerEventBase<TType extends string, TData> = {
  type: TType;
  data: TData;
};

export type TableWorkerEvent = InitEvent | CellSizeEvent;

type CellSizeEvent = TableWorkerEventBase<
  "CELL_SIZE",
  {
    content: string;
    styling: TableCellFontStyling;
  }
>;

type InitEvent = TableWorkerEventBase<"INIT", { w: number; h: number }>;

// type TableWorkerScrollEvent = TableWorkerEventBase<
//   "SCROLL",
//   {
//     dx: number;
//     dy: number;
//   }
// >;

// export type TableWorkerInitEvent = TableWorkerEventBase<"INIT", InitEventData>;

// export type InitEventData = {
//   body: OffscreenCanvas;
//   config: string; // this is TableConfig stringified
// };

// export type TableWorkerResizeEvent = TableWorkerEventBase<
//   "RESIZE",
//   ResizeEventData
// >;

// export type ResizeEventData = {
//   w: number;
//   h: number;
//   dpr: number;
// };
