"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Table } from "l2-table";

export function NumberTable(): ReactNode {
  const [isLarge, setIsLarge] = useState<boolean>(true);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useRef<Table | null>(null);

  useEffect(() => {
    if (tableContainerRef.current && !table.current) {
      table.current = new Table(tableContainerRef.current);
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

      <button
        className="bg-gray-200"
        style={{
          width: "100%",
        }}
        onClick={() => setIsLarge(!isLarge)}
      >
        Resize
      </button>
    </div>
  );
}
