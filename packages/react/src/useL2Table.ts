import {
  createTable,
  Table,
  TableConfig,
  TableRow,
  TableSourceObservable,
} from "@dongjiy/l2-table";
import { RefObject, useEffect, useRef } from "react";

export function useL2Table<TDataRow extends TableRow>(
  config: TableConfig<TDataRow>,
  source: TableSourceObservable,
  root: RefObject<HTMLDivElement | null>,
) {
  const tableRef = useRef<Table<TDataRow>>(null);

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
    };
  }, [config, source, root]);

  return tableRef;
}
