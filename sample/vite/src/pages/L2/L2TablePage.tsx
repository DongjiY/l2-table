import type { ReactNode } from "react";
import { NumberTable } from "./components/Table";

export function L2TablePage(): ReactNode {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <NumberTable />
    </div>
  );
}
