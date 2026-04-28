import { useMemo, useRef } from "react";
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
import type { ComparisonRow } from "../types";

type TanStackTableViewProps = {
  rows: ComparisonRow[];
  columns: Array<ColumnDef<ComparisonRow, number>>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  width: number;
  height: number;
};

export function TanStackTableView({
  rows,
  columns,
  sorting,
  onSortingChange,
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
              <div
                key={row.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  display: "grid",
                  gridTemplateColumns,
                  alignItems: "center",
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
