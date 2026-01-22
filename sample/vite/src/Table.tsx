import { useEffect, useRef, useState, type ReactNode } from "react";
import { createTable, type Table } from "l2-table";
import { config, type ColsType } from "./tableConfig";
import { numberSource } from "./numberSource";

export function NumberTable(): ReactNode {
  const [isLarge, setIsLarge] = useState<boolean>(true);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useRef<Table<ColsType> | null>(null);

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
          width: isLarge ? 600 : 300,
          height: 600,
        }}
      ></div>

      {/* <button
        style={{
          width: "100%",
        }}
        onClick={() => setIsLarge(!isLarge)}
      >
        Resize
      </button> */}
    </div>
  );
}
