import { useMemo, useState, type ReactNode } from "react";
import { type SortingState } from "@tanstack/react-table";
import { ResizeControls } from "../../common/ResizeControls";
import { toTanStackColumns } from "./utils/tableData";
import { TanStackTableView } from "./components/TanStackTableView";
import { useComparisonRows } from "./hooks/useComparisonRows";

export function TanStackComparisonPage(): ReactNode {
  const [isLargeW, setIsLargeW] = useState<boolean>(true);
  const [isLargeH, setIsLargeH] = useState<boolean>(true);
  const [sorting, setSorting] = useState<SortingState>([]);

  const rows = useComparisonRows();
  const columns = useMemo(() => toTanStackColumns(), []);

  return (
    <div
      style={{
        width: "min-content",
        border: "2px solid red",
      }}
    >
      <TanStackTableView
        rows={rows}
        columns={columns}
        sorting={sorting}
        onSortingChange={setSorting}
        width={isLargeW ? 600 : 300}
        height={isLargeH ? 600 : 400}
      />
      <ResizeControls
        onToggleWidth={() => setIsLargeW(!isLargeW)}
        onToggleHeight={() => setIsLargeH(!isLargeH)}
      />
    </div>
  );
}
