import { TableColumnDef, TableRow } from "../types/table-config";
import { CellDataStore } from "./cell-data-store";
import { SortedRowModel } from "./sorted-row-model";
import { TableData } from "./table-data";

class NumberData extends TableData<number> {
  compare(a: number, b: number): -1 | 0 | 1 {
    return a === b ? 0 : a < b ? -1 : 1;
  }

  toString(value: number): string {
    return String(value);
  }
}

describe("SortedRowModel", () => {
  test("initializes unrendered cells through placeholderAccessorFn before sorting", () => {
    type Row = TableRow & { initialPrice: number };
    const rows: Array<Row> = [
      { rowId: "first", initialPrice: 2, placeholders: { price: 999 } },
      { rowId: "second", initialPrice: 1, placeholders: { price: 999 } },
    ];
    const column: TableColumnDef<Row, number> = {
      columnId: "price",
      name: "Price",
      hidden: false,
      autoResize: false,
      placeholderAccessorFn: (row) => row.initialPrice,
      cellData: () => new NumberData(undefined, "—"),
    };
    const cellDataStore = new CellDataStore([column]);
    const model = new SortedRowModel(cellDataStore, rows, [column]);

    model.toggleSort(column.columnId);

    expect(model.getRow(0).rowId).toBe("second");
    expect(model.getRow(1).rowId).toBe("first");
    expect(cellDataStore.getCellData("first", column.columnId).getValue()).toBe(
      2
    );
    expect(
      cellDataStore
        .getCellData("first", column.columnId)
        .getDisplayableContent()
    ).toBe("2");
  });
});
