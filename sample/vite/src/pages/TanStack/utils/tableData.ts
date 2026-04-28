import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { config } from "../../L2/utils/tableConfig";
import type { CellColumnId, ComparisonRow } from "../types";

const columnHelper = createColumnHelper<ComparisonRow>();

export function toComparisonRows(): ComparisonRow[] {
  return config.rows.map((row) => ({
    rowId: row.rowId,
    ...row.placeholders,
  }));
}

export function toTanStackColumns(): Array<ColumnDef<ComparisonRow, number>> {
  return config.columns.map((column) =>
    columnHelper.accessor((row) => row[column.columnId as CellColumnId], {
      id: column.columnId,
      header: column.name,
      cell: (info) => info.getValue().toString(),
    }),
  );
}
