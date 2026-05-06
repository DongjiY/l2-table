import { TableConfig, TableRow, TableSourceObservable } from "l2-table";
import { ReactNode, useRef } from "react";
import { useL2Table } from "./useL2Table";

export function L2Table<TDataRow extends TableRow>({
  config,
  source,
  width,
  height,
}: {
  config: TableConfig<TDataRow>;
  source: TableSourceObservable;
  width?: number;
  height?: number;
}): ReactNode {
  const tableRootRef = useRef<HTMLDivElement>(null);

  useL2Table(config, source, tableRootRef);

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
