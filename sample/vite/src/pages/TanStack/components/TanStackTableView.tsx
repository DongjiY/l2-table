import { memo, useEffect, useMemo, useRef, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { CellColumnId, ComparisonRow } from "../types";

type TanStackTableViewProps = {
  rows: ComparisonRow[];
  columns: Array<ColumnDef<ComparisonRow, number>>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onVisibleRowIdsChange?: (rowIds: string[]) => void;
  width: number;
  height: number;
};

type BodyRowProps = {
  row: ComparisonRow;
  columnIds: CellColumnId[];
  gridTemplateColumns: string;
  virtualRowStart: number;
  virtualRowSize: number;
};

function BodyCell({ value }: { value: number }): ReactNode {
  return (
    <div
      style={{
        textAlign: "right",
        color: "blue",
        font: "24px monospace",
        padding: "0 6px",
        height: 40,
        lineHeight: "40px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {value.toString()}
    </div>
  );
}

const MemoizedBodyCell = memo(BodyCell);

function BodyRow({
  row,
  columnIds,
  gridTemplateColumns,
  virtualRowStart,
  virtualRowSize,
}: BodyRowProps): ReactNode {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: `${virtualRowSize}px`,
        transform: `translateY(${virtualRowStart}px)`,
        display: "grid",
        gridTemplateColumns,
        alignItems: "center",
      }}
    >
      {columnIds.map((columnId) => (
        <MemoizedBodyCell key={`${row.rowId}-${columnId}`} value={row[columnId]} />
      ))}
    </div>
  );
}

const MemoizedBodyRow = memo(
  BodyRow,
  (prev, next) =>
    prev.row === next.row &&
    prev.columnIds === next.columnIds &&
    prev.gridTemplateColumns === next.gridTemplateColumns &&
    prev.virtualRowStart === next.virtualRowStart &&
    prev.virtualRowSize === next.virtualRowSize,
);

export function TanStackTableView({
  rows,
  columns,
  sorting,
  onSortingChange,
  onVisibleRowIdsChange,
  width,
  height,
}: TanStackTableViewProps) {
  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
    },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    // Avoid building sorted row model when sorting is off.
    getSortedRowModel: sorting.length ? getSortedRowModel() : undefined,
    getRowId: (row) => row.rowId,
  });

  const rowModel = table.getRowModel();
  const leafColumnCount = table.getAllLeafColumns().length;
  const visibleColumnIds = useMemo(
    () =>
      table
        .getAllLeafColumns()
        .map((column) => column.id)
        .filter((columnId): columnId is CellColumnId => columnId !== "rowId"),
    [table],
  );
  const gridTemplateColumns = useMemo(
    () => `repeat(${leafColumnCount}, minmax(110px, 1fr))`,
    [leafColumnCount],
  );

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtualizer({
    count: rowModel.rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 40,
    overscan: 12,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalHeight = rowVirtualizer.getTotalSize();

  useEffect(() => {
    if (!onVisibleRowIdsChange) {
      return;
    }
    const visibleIds = virtualRows
      .map((virtualRow) => rowModel.rows[virtualRow.index]?.id)
      .filter((rowId): rowId is string => rowId !== undefined);
    onVisibleRowIdsChange(visibleIds);
  }, [onVisibleRowIdsChange, rowModel.rows, virtualRows]);

  return (
    <div
      ref={scrollContainerRef}
      style={{
        width,
        height,
        overflow: "auto",
      }}
    >
      <div style={{ minWidth: "max-content", width: "100%" }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "white",
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <div
              key={headerGroup.id}
              style={{
                display: "grid",
                gridTemplateColumns,
                alignItems: "center",
                height: 60,
              }}
            >
              {headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  style={{
                    textAlign: "center",
                    color: "red",
                    font: "24px 'Playfair Display'",
                    padding: "0 6px",
                    whiteSpace: "nowrap",
                    cursor: header.column.getCanSort() ? "pointer" : "default",
                    userSelect: "none",
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getIsSorted() === "asc" ? " ▲" : ""}
                      {header.column.getIsSorted() === "desc" ? " ▼" : ""}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ position: "relative", height: totalHeight }}>
          {virtualRows.map((virtualRow) => {
            const row = rowModel.rows[virtualRow.index];

            return (
              <MemoizedBodyRow
                key={row.id}
                row={row.original}
                columnIds={visibleColumnIds}
                gridTemplateColumns={gridTemplateColumns}
                virtualRowStart={virtualRow.start}
                virtualRowSize={virtualRow.size}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
