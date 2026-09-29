import {
  createTable,
  Table,
  TableConfig,
  TableRow,
  TableSourceObservable,
} from "@dongjiy/l2-table";
import { MutableRefObject, RefObject, useEffect, useRef } from "react";

export function useL2Table<TDataRow extends TableRow>(
  config: TableConfig<TDataRow>,
  source: TableSourceObservable,
  root: RefObject<HTMLDivElement | null>,
  externalTableRef?: MutableRefObject<Table<TDataRow> | null>
) {
  const internalTableRef = useRef<Table<TDataRow>>(null);
  const tableRef = externalTableRef ?? internalTableRef;

  useEffect(() => {
    if (root.current) {
      tableRef.current = createTable(root.current, {
        config,
        source,
      });
    }

    const table = tableRef.current;

    return () => {
      table?.close();
      table?.unmount();
      if (tableRef.current === table) {
        tableRef.current = null;
      }
    };
  }, [config, source, root, tableRef]);

  return tableRef;
}
