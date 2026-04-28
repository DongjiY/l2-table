import { useEffect, useMemo, useRef, useState } from "react";
import { numberSource } from "../../../common/numberSource";
import { config } from "../../L2/utils/tableConfig";
import { toComparisonRows } from "../utils/tableData";
import type { CellColumnId, ComparisonRow } from "../types";

export function useComparisonRows(): ComparisonRow[] {
  const initialRows = useMemo(() => toComparisonRows(), []);
  const [rows, setRows] = useState<ComparisonRow[]>(initialRows);

  const rowIndexById = useMemo(() => {
    const map = new Map<string, number>();
    initialRows.forEach((row, index) => {
      map.set(row.rowId, index);
    });
    return map;
  }, [initialRows]);

  const updateColumnIdSet = useMemo(() => {
    const set = new Set<CellColumnId>();
    config.columns.forEach((column) => {
      if (column.columnId !== "index") {
        set.add(column.columnId as CellColumnId);
      }
    });
    return set;
  }, []);

  const pendingUpdatesRef = useRef<
    Map<string, Partial<Record<CellColumnId, number>>>
  >(new Map());

  useEffect(() => {
    const subscription = numberSource(config).subscribe((update) => {
      if (!updateColumnIdSet.has(update.columnId as CellColumnId)) {
        return;
      }

      const existingPatch = pendingUpdatesRef.current.get(update.rowId) ?? {};
      existingPatch[update.columnId as CellColumnId] = update.data as number;
      pendingUpdatesRef.current.set(update.rowId, existingPatch);
    });

    const flushTimer = window.setInterval(() => {
      if (pendingUpdatesRef.current.size === 0) {
        return;
      }

      const pending = pendingUpdatesRef.current;
      pendingUpdatesRef.current = new Map();

      setRows((previousRows) => {
        const nextRows = previousRows.slice();
        const changedRows = new Map<number, ComparisonRow>();

        pending.forEach((patch, rowId) => {
          const rowIndex = rowIndexById.get(rowId);
          if (rowIndex === undefined) {
            return;
          }

          let changedRow = changedRows.get(rowIndex);
          if (!changedRow) {
            changedRow = { ...nextRows[rowIndex] };
            changedRows.set(rowIndex, changedRow);
          }

          Object.entries(patch).forEach(([columnId, value]) => {
            if (value !== undefined) {
              changedRow[columnId as CellColumnId] = value;
            }
          });
        });

        changedRows.forEach((changedRow, rowIndex) => {
          nextRows[rowIndex] = changedRow;
        });

        return nextRows;
      });
    }, 100);

    return () => {
      subscription.unsubscribe();
      window.clearInterval(flushTimer);
    };
  }, [rowIndexById, updateColumnIdSet]);

  return rows;
}
