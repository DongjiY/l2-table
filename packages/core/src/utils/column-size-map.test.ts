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

  test("excludes hidden columns from geometry without discarding their widths", () => {
    const columns = [
      { columnId: "first", maxWidth: 100 },
      { columnId: "second", maxWidth: 100 },
    ] as Array<TableColumnDef<TableRow>>;
    const sizes = new ColumnSizeMap(columns, {
      first: { minWidth: 0, maxWidth: 100 },
      second: { minWidth: 0, maxWidth: 100 },
    });

    sizes.updateColumnSize("first", 20);
    sizes.updateColumnSize("second", 30);
    sizes.setVisibleColumns(["first"]);

    expect(sizes.getTotalColumnWidth()).toBe(20);
    expect(sizes.getBoundingBoxes().map((box) => box.meta.columnId)).toEqual([
      "first",
    ]);

    sizes.setVisibleColumns(["first", "second"]);

    expect(sizes.getColumnWidth("second")).toBe(30);
    expect(sizes.getTotalColumnWidth()).toBe(50);
  });

  test("supports an empty visible-column set", () => {
    const sizes = new ColumnSizeMap(
      [{ columnId: "only", maxWidth: 100 }] as Array<TableColumnDef<TableRow>>,
      { only: { minWidth: 0, maxWidth: 100 } }
    );

    sizes.setVisibleColumns([]);

    expect(sizes.getTotalColumnWidth()).toBe(0);
    expect(sizes.getBoundingBoxes()).toEqual([]);
  });
});
