import { memo, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

function SortIndicator({ direction }: { direction: false | "asc" | "desc" }): ReactNode {
  const upColor = direction === "asc" ? "#1d4ed8" : "#cbd5e1";
  const downColor = direction === "desc" ? "#1d4ed8" : "#cbd5e1";
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        lineHeight: 1,
        marginLeft: 8,
        transform: "translateY(2px)",
        gap: 2,
      }}
    >
      <svg width="8" height="6" viewBox="0 0 8 6">
        <path d="M4 0 L8 6 H0 Z" fill={upColor} />
      </svg>
      <svg width="8" height="6" viewBox="0 0 8 6">
        <path d="M0 0 H8 L4 6 Z" fill={downColor} />
      </svg>
    </span>
  );
}

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
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: BodyRowProps): ReactNode {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
        backgroundColor: isHovered ? "rgba(255, 0, 0, 0.2)" : "transparent",
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
    prev.virtualRowSize === next.virtualRowSize &&
    prev.isHovered === next.isHovered,
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
  const [hoveredHeaderId, setHoveredHeaderId] = useState<string | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
    },
    defaultColumn: {
      minSize: 110,
      size: 160,
    },
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    // Avoid building sorted row model when sorting is off.
    getSortedRowModel: sorting.length ? getSortedRowModel() : undefined,
    getRowId: (row) => row.rowId,
  });

  const rowModel = table.getRowModel();
  const visibleLeafColumns = table.getAllLeafColumns().filter((column) => column.id !== "rowId");
  const visibleColumnIds = useMemo(
    () => visibleLeafColumns.map((column) => column.id as CellColumnId),
    [visibleLeafColumns],
  );
  const gridTemplateColumns = useMemo(
    () => visibleLeafColumns.map((column) => `${column.getSize()}px`).join(" "),
    [visibleLeafColumns],
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
                alignItems: "stretch",
                height: 60,
              }}
            >
              {headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    color: "red",
                    font: "24px 'Playfair Display'",
                    padding: "0 6px",
                    height: "100%",
                    whiteSpace: "nowrap",
                    cursor: header.column.getCanSort() ? "pointer" : "default",
                    userSelect: "none",
                  }}
                  onMouseEnter={() => setHoveredHeaderId(header.id)}
                  onMouseLeave={() => setHoveredHeaderId((current) => (current === header.id ? null : current))}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <span>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </span>
                      {header.column.getCanSort() ? (
                        <SortIndicator direction={header.column.getIsSorted()} />
                      ) : null}
                    </span>
                  )}
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    onClick={(event) => event.stopPropagation()}
                    style={{
                      opacity:
                        hoveredHeaderId === header.id || header.column.getIsResizing() ? 1 : 0,
                      position: "absolute",
                      right: 0,
                      top: 0,
                      height: "100%",
                      width: 3,
                      cursor: "col-resize",
                      userSelect: "none",
                      touchAction: "none",
                      transition: "opacity 120ms ease-in-out",
                      backgroundColor: header.column.getIsResizing()
                        ? "red"
                        : hoveredHeaderId === header.id
                          ? "rgba(255, 0, 0, 0.35)"
                          : "transparent",
                    }}
                  />
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
                isHovered={hoveredRowId === row.id}
                onMouseEnter={() => setHoveredRowId(row.id)}
                onMouseLeave={() =>
                  setHoveredRowId((current) => (current === row.id ? null : current))
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
