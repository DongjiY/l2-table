import { interval, map, Observable } from "rxjs";
import type { TableColumns, TableConfig, TableSourceData } from "../../../dist";

export function numberSource<C extends TableColumns>(
  tableConfig: TableConfig<C>,
): Observable<TableSourceData<C>> {
  const cells: Array<{ rowId: string; columnId: keyof C }> = [];

  tableConfig.rows.forEach((row) => {
    (Object.keys(row.cells) as Array<keyof C>).forEach((colId) => {
      cells.push({ rowId: row.rowId, columnId: colId });
    });
  });

  let index = 0;

  return interval(500).pipe(
    map(() => {
      const cell = cells[index];
      index = (index + 1) % cells.length;

      const value = Number((Math.random() * 1000).toFixed(2));

      return {
        rowId: cell.rowId,
        columnId: cell.columnId,
        data: value,
      };
    }),
  );
}
