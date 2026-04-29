import type { ReactNode } from "react";
import { StaticNumberTable } from "./components/StaticTable";

export function L2StaticTablePage(): ReactNode {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <StaticNumberTable />
    </div>
  );
}
