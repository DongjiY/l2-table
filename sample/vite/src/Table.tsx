import { useEffect, useRef, useState, type ReactNode } from "react";
import { createTable, type Table } from "l2-table";
import { numberSource } from "./numberSource";
import { EMPTY } from "rxjs";
import { config, type StatsRow } from "./tableConfig";

export function NumberTable(): ReactNode {
  const [isLargeW, setIsLargeW] = useState<boolean>(true);
  const [isLargeH, setIsLargeH] = useState<boolean>(true);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useRef<Table<StatsRow> | null>(null);

  useEffect(() => {
    if (tableContainerRef.current && !table.current) {
      table.current = createTable(tableContainerRef.current, {
        config,
        source: numberSource(config),
      });
    }
  }, []);

  return (
    <div
      style={{
        width: "min-content",
        border: "2px solid red",
      }}
    >
      <div
        ref={tableContainerRef}
        style={{
          width: isLargeW ? 600 : 300,
          height: isLargeH ? 600 : 400,
        }}
      ></div>

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
