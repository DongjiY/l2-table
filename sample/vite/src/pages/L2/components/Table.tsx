import { useMemo, useState, type ReactNode } from "react";
import { numberSource } from "../../../common/numberSource";
import { config } from "../utils/tableConfig";
import { L2Table } from "@l2-table/react";

export function NumberTable(): ReactNode {
  const [isLargeW, setIsLargeW] = useState<boolean>(true);
  const [isLargeH, setIsLargeH] = useState<boolean>(true);

  const source = useMemo(() => numberSource(config), []);

  return (
    <div
      style={{
        width: "min-content",
        border: "2px solid red",
      }}
    >
      <L2Table
        config={config}
        source={source}
        width={isLargeW ? 600 : 300}
        height={isLargeH ? 600 : 300}
      />

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
      </div>
    </div>
  );
}
