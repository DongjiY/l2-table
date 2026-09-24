import {
  Table,
  TableConfig,
  TableRow,
  TableSourceObservable,
} from "@dongjiy/l2-table";
import { MutableRefObject, ReactNode, useRef } from "react";
import { useL2Table } from "./useL2Table";

export function L2Table<TDataRow extends TableRow>({
  config,
  source,
  width,
  height,
  tableRef: externalTableRef,
}: {
  config: TableConfig<TDataRow>;
  source: TableSourceObservable;
  width?: number;
  height?: number;
  tableRef?: MutableRefObject<Table<TDataRow> | null>;
}): ReactNode {
  const tableRootRef = useRef<HTMLDivElement>(null);
  const internalTableRef = useRef<Table<TDataRow>>(null);
  const tableRef = externalTableRef ?? internalTableRef;

  useL2Table(config, source, tableRootRef, tableRef);

  return (
    <div
      ref={tableRootRef}
      style={{
        width,
        height,
      }}
    />
  );
}
