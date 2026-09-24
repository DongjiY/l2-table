import { useMemo, useRef, useState, type ReactNode } from "react";
import { numberSource } from "../../../common/numberSource";
import { config, type StatsRow } from "../utils/tableConfig";
import { L2Table } from "@dongjiy/l2-table-react";
import type { Table } from "@dongjiy/l2-table";

export function NumberTable(): ReactNode {
  const [isLargeW, setIsLargeW] = useState<boolean>(true);
  const [isLargeH, setIsLargeH] = useState<boolean>(true);
  const [isP50Hidden, setIsP50Hidden] = useState<boolean>(true);
  const tableRef = useRef<Table<StatsRow>>(null);

  const source = useMemo(() => numberSource(config), []);

  return (
    <div
      style={{
        width: "min-content",
      }}
    >
      <div style={{ border: "2px solid red" }}>
        <L2Table
          config={config}
          source={source}
          width={isLargeW ? 600 : 300}
          height={isLargeH ? 600 : 300}
          tableRef={tableRef}
        />
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
        }}
      >
        <button
          style={{
            flex: 1,
          }}
          onClick={() => setIsLargeW(!isLargeW)}
        >
          Resize X
        </button>
        <button
          style={{
            flex: 1,
          }}
          onClick={() => setIsLargeH(!isLargeH)}
        >
          Resize Y
        </button>
        <button
          style={{
            flex: 1,
          }}
          onClick={() => {
            const hidden = !isP50Hidden;
            tableRef.current?.setColumnHidden("p50", hidden);
            setIsP50Hidden(hidden);
          }}
        >
          {isP50Hidden ? "Show P50" : "Hide P50"}
        </button>
      </div>
    </div>
  );
}
