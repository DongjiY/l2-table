import { TableColumnDef, TableRow } from "../types/table-config";
import { ColumnSizeMap } from "./column-size-map";

describe("ColumnSizeMap intrinsic content widths", () => {
  const columnId = "price";
  const columns = [
    {
      columnId,
      maxWidth: 100,
    } as TableColumnDef<TableRow>,
  ];
  const constraints = {
    [columnId]: {
      minWidth: 10,
      maxWidth: 100,
    },
  };

  test("uses the first rendered width and only grows for wider content", () => {
    const sizes = new ColumnSizeMap(columns, constraints);

    sizes.updateIntrinsicContentWidth(columnId, 24);
    expect(sizes.getColumnWidth(columnId)).toBe(24);

    sizes.updateIntrinsicContentWidth(columnId, 18);
    expect(sizes.getColumnWidth(columnId)).toBe(24);

    sizes.updateIntrinsicContentWidth(columnId, 42);
    expect(sizes.getColumnWidth(columnId)).toBe(42);
  });
});
