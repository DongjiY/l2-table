import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { numberSource } from "../../../common/numberSource";
import { config } from "../../L2/utils/tableConfig";
import { toComparisonRows } from "../utils/tableData";
import type { CellColumnId, ComparisonRow } from "../types";

type ComparisonRowsResult = {
  rows: ComparisonRow[];
  setVisibleRowIds: (rowIds: string[]) => void;
};

type RowPatch = Partial<Record<CellColumnId, number>>;

const HIDDEN_FLUSH_MS = 120;

export function useComparisonRows(): ComparisonRowsResult {
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

  const pendingVisibleUpdatesRef = useRef<Map<string, RowPatch>>(new Map());
  const pendingHiddenUpdatesRef = useRef<Map<string, RowPatch>>(new Map());
  const visibleRowIdsRef = useRef<Set<string>>(new Set());
  const rafIdRef = useRef<number | undefined>(undefined);
  const hiddenFlushTimerRef = useRef<number | undefined>(undefined);

  const applyPendingUpdates = useCallback(
    (pending: Map<string, RowPatch>): void => {
      if (pending.size === 0) {
        return;
      }

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
    },
    [rowIndexById],
  );

  const flushVisibleUpdates = useCallback((): void => {
    rafIdRef.current = undefined;
    const pending = pendingVisibleUpdatesRef.current;
    pendingVisibleUpdatesRef.current = new Map();
    applyPendingUpdates(pending);
  }, [applyPendingUpdates]);

  const flushHiddenUpdates = useCallback((): void => {
    hiddenFlushTimerRef.current = undefined;
    const pending = pendingHiddenUpdatesRef.current;
    pendingHiddenUpdatesRef.current = new Map();
    applyPendingUpdates(pending);
  }, [applyPendingUpdates]);

  const mergePatch = (
    updatesMap: Map<string, RowPatch>,
    rowId: string,
    columnId: CellColumnId,
    value: number,
  ): void => {
    const patch = updatesMap.get(rowId) ?? {};
    patch[columnId] = value;
    updatesMap.set(rowId, patch);
  };

  const setVisibleRowIds = useCallback((rowIds: string[]) => {
    visibleRowIdsRef.current = new Set(rowIds);
  }, []);

  useEffect(() => {
    const subscription = numberSource(config).subscribe((update) => {
      if (!updateColumnIdSet.has(update.columnId as CellColumnId)) {
        return;
      }

      const cellColumnId = update.columnId as CellColumnId;
      const rowId = update.rowId;
      const value = update.data as number;
      if (visibleRowIdsRef.current.has(rowId)) {
        mergePatch(pendingVisibleUpdatesRef.current, rowId, cellColumnId, value);
        if (rafIdRef.current === undefined) {
          rafIdRef.current = window.requestAnimationFrame(flushVisibleUpdates);
        }
        return;
      }

      mergePatch(pendingHiddenUpdatesRef.current, rowId, cellColumnId, value);
      if (hiddenFlushTimerRef.current === undefined) {
        hiddenFlushTimerRef.current = window.setTimeout(
          flushHiddenUpdates,
          HIDDEN_FLUSH_MS,
        );
      }
    });

    return () => {
      subscription.unsubscribe();
      if (rafIdRef.current !== undefined) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
      if (hiddenFlushTimerRef.current !== undefined) {
        window.clearTimeout(hiddenFlushTimerRef.current);
      }
    };
  }, [flushHiddenUpdates, flushVisibleUpdates, updateColumnIdSet]);

  return { rows, setVisibleRowIds };
}
