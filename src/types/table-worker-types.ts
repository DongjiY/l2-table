type TableWorkerEventBase<TType extends string, TData> = {
  type: TType;
  data: TData;
};

export type TableWorkerEvent =
  | TableWorkerScrollEvent
  | TableWorkerInitEvent
  | TableWorkerResizeEvent;

type TableWorkerScrollEvent = TableWorkerEventBase<
  "SCROLL",
  {
    dx: number;
    dy: number;
  }
>;

export type TableWorkerInitEvent = TableWorkerEventBase<"INIT", InitEventData>;

export type InitEventData = {
  body: OffscreenCanvas;
  config: string; // this is TableConfig stringified
};

export type TableWorkerResizeEvent = TableWorkerEventBase<
  "RESIZE",
  ResizeEventData
>;

export type ResizeEventData = {
  w: number;
  h: number;
  dpr: number;
};
